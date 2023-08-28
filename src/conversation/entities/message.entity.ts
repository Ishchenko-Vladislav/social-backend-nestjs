import { UserEntity } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/Base';
import { Entity, ManyToOne, Column } from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity('message')
export default class MessageEntity extends Base {
  @Column()
  content: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(
    () => ConversationEntity,
    (conversation) => conversation.messages,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  conversation: ConversationEntity;
}
