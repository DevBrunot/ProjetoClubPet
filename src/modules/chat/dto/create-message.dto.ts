import { UserType } from '../../../entities/message.entity';

export class CreateMessageDto {
  content: string;
  petOwnerId?: number;
  caretakerId?: number;
  petId?: number;
  senderType: UserType;
} 