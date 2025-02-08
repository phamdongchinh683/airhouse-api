import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, OnModuleInit, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';

import { Server, Socket } from 'socket.io';
import { WsGuard } from 'src/guards/ws.guard';
import { ConversationService } from 'src/modules/conversation/conversation.service';
import { UserConversation } from 'src/modules/conversation/dto/user-conversation.dto';
import {
  Message,
  MessageCreationDto,
} from 'src/modules/message/dto/message.creation.dto';
import { MessageService } from 'src/modules/message/message.service';

@WebSocketGateway(parseInt(process.env.SOCKET_URL), {
  cors: {
    origin: '*',
  },
})
@UseGuards(WsGuard)
export class ChatGateWay implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
        const userId = this.getUserId(socket);
        const cachedMessages: Message[] = await this.cacheManager.get(
          socket.id,
        );
        const data: MessageCreationDto = {
          userId: userId,
          messages: cachedMessages,
        };
        if (cachedMessages) {
          Promise.all([
            this.messageService.insertMessages(data),
            this.cacheManager.del(socket.id),
          ]);
        }
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  @SubscribeMessage('newMessage')
  async newMessage(
    @MessageBody() message: Message,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const userId = this.getUserId(socket);
      const cachedMessages: Message[] =
        (await this.cacheManager.get(socket.id)) || [];

      cachedMessages.push(message);
      await this.cacheManager.set(socket.id, cachedMessages);

      if (message) {
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
        data: `You have a message from user ${userSendMessage[0].userEmail}`,
      });
    } catch (error) {
      socket.emit('onMessage', {
        status: 'error',
        message: error.message,
      });
    }
  }

  @SubscribeMessage('joinConversation')
  async joinConversation(
    @MessageBody() body: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
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
    } catch (error) {
      socket.emit('historyMessage', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('messageNotification')
  async messageNotification(
    @MessageBody() body: { userId: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      socket.join(body.userId);
      socket.emit('onNotification', {
        status: 'success',
      });
    } catch (error) {
      socket.emit('onNotification', {
        message: error.message,
      });
    }
  }
}
