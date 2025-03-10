import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { WsGuard } from 'src/guards/ws.guard';
import { ConversationService } from 'src/modules/conversation/conversation.service';
import { CreateConversationDto } from 'src/modules/conversation/dto/create-conversation.dto';
import { UserConversation } from 'src/modules/conversation/dto/user-conversation.dto';
import { MessageCreationDto } from 'src/modules/message/dto/message.creation.dto';
import { MessageService } from 'src/modules/message/message.service';

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

      const messageData = {
        userId: userId,
        userEmail: message.userEmail,
        conversationId: message.conversationId,
        messageText: message.messageText,
      };
      const insertMessage =
        await this.messageService.insertMessages(messageData);

      if (insertMessage.rowCount > 0) {
        this.server.to(message.conversationId).emit('onMessage', {
          status: 'success',
          data: message,
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

      this.server.to(usersReceiveNotification).emit('onNotification', {
        status: 'success',
        data: `You have a message from user ${userSendMessage[0].userEmail} conversation:${message.conversationId}`,
      });
    } catch (error) {
      socket.emit('onMessage', {
        status: 'error',
        message: error.message,
      });
    }
  }

  // join conversation
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

      if (findConversation.length <= 0) {
        socket.emit('statusJoin', {
          status: 'failed',
          message: 'Currently this conversation not exited',
        });
        return;
      }

      socket.join(body.conversationId);
      const results = await this.messageService.getMessages(
        body.conversationId,
      );
      socket.emit('historyMessage', {
        result:
          results.length > 0
            ? results
            : 'There are no message logs in this chat',
      });
      socket.emit('statusJoin', {
        status: 'success',
      });
    } catch (error) {
      socket.emit('statusJoin', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('messageNotification')
  async messageNotification(@ConnectedSocket() socket: Socket): Promise<void> {
    try {
      const userId = this.getUserId(socket);
      socket.join(userId);
      socket.emit('onNotification', {
        status: 'success',
        data: `Connected to notification at ${new Date().toLocaleString()}`,
      });
    } catch (error) {
      socket.emit('onNotification', {
        message: error.message,
      });
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
        // message sending
        socket.emit('onMessage', {
          result: result.conversationId,
          status: 'success',
        });
        //send notification to users
        this.server.to(result.users.slice(1)).emit('onNotification', {
          status: 'success',
          data: `You have a new chat conversation:${result.conversationId}`,
        });
      }
    } catch (error) {
      socket.emit('onMessage', {
        message: error.message,
      });
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
        socket.emit('onChats', {
          data: result,
          status: 'success',
        });
      }
    } catch (error) {
      socket.emit('onChats', {
        message: error.message,
      });
    }
  }
}
