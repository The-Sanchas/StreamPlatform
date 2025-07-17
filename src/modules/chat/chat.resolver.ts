import { SendMessageInput } from './inputs/send-message.input';
import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ChatService } from './chat.service';
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input';
import { ChatMessagesModel } from './models/chat-message.model';

@Resolver('Chat')
export class ChatResolver {

  private readonly pubSub: PubSub

  public constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub()
  }

  @Query(() => [ChatMessagesModel], { name: 'findChatMessagesByStream' })
  public async findMessagesByStream(@Args('streamId') streamId: string){
    return await this.chatService.findMessageByStream(streamId)
  }

  @Authorization()
	@Mutation(() => ChatMessagesModel, { name: 'sendChatMessage' })
	public async sendMessage(
		@Authorized('id') userId: string,
		@Args('data') input: SendMessageInput
	) {
		const message = await this.chatService.sendMessage(userId, input)

		this.pubSub.publish('CHAT_MESSAGE_ADDED', { chatMessageAdded: message })

		return message
	}

	@Subscription(() => ChatMessagesModel, {
		name: 'chatMessageAdded',
		filter: (payload, variables) =>
			payload.chatMessageAdded.streamid === variables.streamid,
    resolve: (payload) => payload.chatMessageAdded
	})
	public chatMessageAdded(@Args('streamid') streamid: string) {
		return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED')
	}

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeChatSettings' })
  public async changeChatSettings(
    @Authorized() user: User, 
    @Args('data') input: ChangeChatSettingsInput
  ){
    console.log(user)
    return this.chatService.changeChatSettings(user, input)
  }

  
}
