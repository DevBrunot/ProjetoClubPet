import { Caretaker } from '../../../entities/caretaker.entity';
import { PetOwner } from '../../../entities/pet-owner.entity';
import { UserType } from '../../../entities/message.entity';

export interface ConversationPreview {
  conversationId: string;
  caretaker?: Caretaker;
  petOwner?: PetOwner;
  lastMessage: {
    content: string;
    createdAt: Date;
    isRead: boolean;
    senderType: UserType;
  };
  unreadCount: number;
} 