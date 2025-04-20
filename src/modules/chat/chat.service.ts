import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, UserType } from '../../entities/message.entity';
import { PetOwner } from '../../entities/pet-owner.entity';
import { Caretaker } from '../../entities/caretaker.entity';
import { Pet } from '../../entities/pet.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationPreview } from './models/conversation.model';
import * as crypto from 'crypto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(PetOwner)
    private petOwnerRepository: Repository<PetOwner>,
    @InjectRepository(Caretaker)
    private caretakerRepository: Repository<Caretaker>,
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
  ) {}

  private generateConversationId(petOwnerId: number, caretakerId: number): string {
    // Garante que o ID da conversa seja o mesmo independente de quem envia a mensagem
    const ids = [petOwnerId, caretakerId].sort().join('-');
    return crypto.createHash('md5').update(ids).digest('hex');
  }

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const { content, petOwnerId, caretakerId, petId, senderType } = createMessageDto;

    if (!petOwnerId || !caretakerId) {
      throw new BadRequestException('IDs do dono do pet e do cuidador são obrigatórios');
    }

    // Verificar se o dono do pet existe
    const petOwner = await this.petOwnerRepository.findOne({ where: { id: petOwnerId } });
    if (!petOwner) {
      throw new NotFoundException(`Dono de pet com ID ${petOwnerId} não encontrado`);
    }

    // Verificar se o cuidador existe
    const caretaker = await this.caretakerRepository.findOne({ where: { id: caretakerId } });
    if (!caretaker) {
      throw new NotFoundException(`Cuidador com ID ${caretakerId} não encontrado`);
    }

    // Verificar se o pet existe, se fornecido
    let pet: Pet | null = null;
    if (petId) {
      pet = await this.petRepository.findOne({ where: { id: petId } });
      if (!pet) {
        throw new NotFoundException(`Pet com ID ${petId} não encontrado`);
      }
    }

    // Gerar o ID da conversa
    const conversationId = this.generateConversationId(petOwnerId, caretakerId);

    // Criar a mensagem
    const messageData: Partial<Message> = {
      content,
      senderType,
      conversationId,
      isRead: false,
    };

    if (senderType === UserType.PET_OWNER) {
      messageData.petOwner = petOwner;
    } else {
      messageData.caretaker = caretaker;
    }

    if (pet) {
      messageData.pet = pet;
    }

    const message = this.messageRepository.create(messageData);
    return await this.messageRepository.save(message);
  }

  async getConversation(petOwnerId: number, caretakerId: number): Promise<Message[]> {
    const conversationId = this.generateConversationId(petOwnerId, caretakerId);
    
    return this.messageRepository.find({
      where: { conversationId },
      relations: ['petOwner', 'caretaker', 'pet'],
      order: { createdAt: 'ASC' },
    });
  }

  async getPetOwnerConversations(petOwnerId: number): Promise<ConversationPreview[]> {
    // Buscar todos os cuidadores com quem o dono do pet conversou
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .select('message.conversationId')
      .where('message.pet_owner_id = :petOwnerId', { petOwnerId })
      .groupBy('message.conversationId')
      .getMany();

    const conversationIds = messages.map(message => message.conversationId);
    
    // Para cada conversa, buscar a última mensagem e informações do cuidador
    const conversations: ConversationPreview[] = [];
    
    for (const conversationId of conversationIds) {
      const lastMessage = await this.messageRepository.findOne({
        where: { conversationId },
        relations: ['petOwner', 'caretaker', 'pet'],
        order: { createdAt: 'DESC' },
      });
      
      if (lastMessage && lastMessage.caretaker) {
        conversations.push({
          conversationId,
          caretaker: lastMessage.caretaker,
          lastMessage: {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            isRead: lastMessage.isRead,
            senderType: lastMessage.senderType,
          },
          unreadCount: await this.countUnreadMessages(conversationId, UserType.PET_OWNER),
        });
      }
    }
    
    return conversations;
  }

  async getCaretakerConversations(caretakerId: number): Promise<ConversationPreview[]> {
    // Buscar todos os donos de pet com quem o cuidador conversou
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .select('message.conversationId')
      .where('message.caretaker_id = :caretakerId', { caretakerId })
      .groupBy('message.conversationId')
      .getMany();

    const conversationIds = messages.map(message => message.conversationId);
    
    // Para cada conversa, buscar a última mensagem e informações do dono do pet
    const conversations: ConversationPreview[] = [];
    
    for (const conversationId of conversationIds) {
      const lastMessage = await this.messageRepository.findOne({
        where: { conversationId },
        relations: ['petOwner', 'caretaker', 'pet'],
        order: { createdAt: 'DESC' },
      });
      
      if (lastMessage && lastMessage.petOwner) {
        conversations.push({
          conversationId,
          petOwner: lastMessage.petOwner,
          lastMessage: {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            isRead: lastMessage.isRead,
            senderType: lastMessage.senderType,
          },
          unreadCount: await this.countUnreadMessages(conversationId, UserType.CARETAKER),
        });
      }
    }
    
    return conversations;
  }

  async markAsRead(conversationId: string, userType: UserType): Promise<void> {
    await this.messageRepository.update(
      {
        conversationId,
        senderType: userType === UserType.PET_OWNER ? UserType.CARETAKER : UserType.PET_OWNER,
        isRead: false,
      },
      { isRead: true }
    );
  }

  private async countUnreadMessages(conversationId: string, userType: UserType): Promise<number> {
    const count = await this.messageRepository.count({
      where: {
        conversationId,
        senderType: userType === UserType.PET_OWNER ? UserType.CARETAKER : UserType.PET_OWNER,
        isRead: false,
      },
    });
    
    return count;
  }
} 