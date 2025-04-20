import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  ParseIntPipe,
  Query,
  Patch
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, UserType } from '../../entities/message.entity';
import { ConversationPreview } from './models/conversation.model';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  async createMessage(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.chatService.createMessage(createMessageDto);
  }

  @Get('conversations/:petOwnerId/:caretakerId')
  async getConversation(
    @Param('petOwnerId', ParseIntPipe) petOwnerId: number,
    @Param('caretakerId', ParseIntPipe) caretakerId: number,
  ): Promise<Message[]> {
    return this.chatService.getConversation(petOwnerId, caretakerId);
  }

  @Get('pet-owner/:petOwnerId/conversations')
  async getPetOwnerConversations(
    @Param('petOwnerId', ParseIntPipe) petOwnerId: number,
  ): Promise<ConversationPreview[]> {
    return this.chatService.getPetOwnerConversations(petOwnerId);
  }

  @Get('caretaker/:caretakerId/conversations')
  async getCaretakerConversations(
    @Param('caretakerId', ParseIntPipe) caretakerId: number,
  ): Promise<ConversationPreview[]> {
    return this.chatService.getCaretakerConversations(caretakerId);
  }

  @Patch('conversations/:conversationId/read')
  async markAsRead(
    @Param('conversationId') conversationId: string,
    @Query('userType') userType: UserType,
  ): Promise<void> {
    return this.chatService.markAsRead(conversationId, userType);
  }
} 