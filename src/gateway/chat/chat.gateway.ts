import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { SocketEvents } from 'src/global/globalEnum';
import { WsGuard } from 'src/guards/ws.guard';
import { ConversationService } from 'src/modules/conversation/conversation.service';
import { CreateConversationDto } from 'src/modules/conversation/dto/create-conversation.dto';
import { UserConversation } from 'src/modules/conversation/dto/user-conversation.dto';
import { MessageCreationDto } from 'src/modules/message/dto/message.creation.dto';
import { MessageDeleteDto } from 'src/modules/message/dto/message.delete.dto';
import { MessageResultDto } from 'src/modules/message/dto/message.result.dto';
import { MessageUpdateDto } from 'src/modules/message/dto/message.update.dto';
import { MessageService } from 'src/modules/message/message.service';
import { responseSocket } from 'src/utils/response.util';

@WebSocketGateway(parseInt(process.env.SOCKET_URL), {
  cors: {
    origin: '*',
  },
})
@UseGuards(WsGuard)
export class ChatGateWay implements OnModuleInit {
  constructor(
    private messageService: MessageService,
    private conversationService: ConversationService,
  ) {}
  @WebSocketServer()
  server: Server;

  private getUserId(socket: Socket): any {
    const payload = socket.handshake['user'];
    if (!payload) {
      return 'Missing data user';
    }
    return payload.sub;
  }

  onModuleInit(): void {
    this.server.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      socket.on('disconnect', async () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  //send message
  @SubscribeMessage('newMessage')
  async newMessage(
    @MessageBody() message: MessageCreationDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const userId = this.getUserId(socket);
      let result: MessageResultDto;

      const messageData = {
        userId: userId,
        userEmail: message.userEmail,
        conversationId: message.conversationId,
        messageText: message.messageText,
      };

      const insertMessage =
        await this.messageService.insertMessages(messageData);

      if (insertMessage.length > 0) {
        result = {
          id: insertMessage[0].id,
          userEmail: message.userEmail,
          messageText: message.messageText,
        };

        this.server.to(message.conversationId).emit(SocketEvents.MESSAGE, {
          status: 'success',
          data: result,
        });
      }

      const participants: UserConversation[] =
        await this.conversationService.findAllUserInConversation(
          message.conversationId,
        );

      const usersReceiveNotification: string[] = participants
        .filter((user) => user.userId !== userId)
        .map((user) => user.userId);

      const userSendMessage = participants.filter(
        (user) => user.userId === userId,
      );

      socket.to(usersReceiveNotification).emit(SocketEvents.NOTIFICATION, {
        status: 'success',
        data: `You have a message from user ${userSendMessage[0].userEmail} conversation:${message.conversationId}`,
      });
    } catch (error) {
      responseSocket(socket, SocketEvents.MESSAGE, 'failed', error.message);
    }
  }

  @SubscribeMessage('joinConversation')
  async joinConversation(
    @MessageBody() body: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const findConversation =
        await this.conversationService.findConversationById(
          body.conversationId,
        );
      if (findConversation.length === 0) {
        responseSocket(socket, SocketEvents.JOIN_STATUS, 'failed', []);
      } else {
        socket.join(body.conversationId);

        const results = await this.messageService.getMessages(
          body.conversationId,
        );

        if (results.length > 0) {
          responseSocket(
            socket,
            SocketEvents.MESSAGE_HISTORY,
            'success',
            results,
          );
        } else {
          responseSocket(socket, SocketEvents.MESSAGE_HISTORY, 'failed', []);
        }
      }
    } catch (error) {
      responseSocket(socket, SocketEvents.JOIN_STATUS, 'failed', error.message);
    }
  }

  @SubscribeMessage('messageNotification')
  async messageNotification(@ConnectedSocket() socket: Socket): Promise<void> {
    try {
      const userId = this.getUserId(socket);
      socket.join(userId);

      responseSocket(
        socket,
        SocketEvents.NOTIFICATION,
        'success',
        `Connected to notification at ${new Date().toLocaleString()}`,
      );
    } catch (error) {
      responseSocket(
        socket,
        SocketEvents.NOTIFICATION,
        'failed',
        error.message,
      );
    }
  }

  @SubscribeMessage('newChat')
  async initChatNotExited(
    @MessageBody() body: CreateConversationDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      if (!body) {
        throw new Error('Invalid chat data.');
      }

      const result = await this.conversationService.initChat(body);

      if (result) {
        responseSocket(
          socket,
          SocketEvents.MESSAGE,
          'success',
          result.conversationId,
        );

        //send notification to users
        socket.to(result.users.slice(1)).emit(SocketEvents.NOTIFICATION, {
          status: 'success',
          data: `You have a new chat conversation:${result.conversationId}`,
        });
      }
    } catch (error) {
      responseSocket(socket, 'onMessage', 'failed', error.message);
    }
  }

  @SubscribeMessage('myChats')
  async myChats(
    @MessageBody() body: { userId: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      if (!body) {
        throw new Error('Invalid chat data.');
      }
      const result = await this.conversationService.getConversationsByUser(
        body.userId,
      );
      if (result.length > 0) {
        responseSocket(
          socket,
          SocketEvents.CONVERSATION_LIST,
          'success',
          result,
        );
      }
    } catch (error) {
      responseSocket(
        socket,
        SocketEvents.CONVERSATION_LIST,
        'failed',
        error.message,
      );
    }
  }

  @SubscribeMessage('updateMessage')
  async updateMessage(
    @MessageBody() body: MessageUpdateDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      if (!body) {
        throw new Error('Invalid chat data.');
      }
      const result = await this.messageService.updateMessage(body);
      if (result.rowCount > 0) {
        this.server.to(body.conversation_id).emit(SocketEvents.MESSAGE, {
          data: {
            id: body.id,
            messageText: body.message_text,
          },
          status: 'success',
        });
      } else {
        responseSocket(
          socket,
          SocketEvents.MESSAGE,
          'failed',
          'This message not change',
        );
      }
    } catch (error) {
      responseSocket(socket, SocketEvents.MESSAGE, 'failed', error.message);
    }
  }

  @SubscribeMessage('deleteMessage')
  async deleteMessage(
    @MessageBody() body: MessageDeleteDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      if (!body) {
        throw new Error('Invalid chat data.');
      }
      const result = await this.messageService.deleteMessage(body.ids);
      if (result.rowCount > 0) {
        this.server.to(body.conversationId).emit(SocketEvents.MESSAGE, {
          status: 'success',
        });
        responseSocket(
          socket,
          SocketEvents.MESSAGE,
          'success',
          'A few message deleted',
        );
      }
    } catch (error) {
      socket.emit(SocketEvents.MESSAGE, {
        message: error.message,
      });
    }
  }
}
