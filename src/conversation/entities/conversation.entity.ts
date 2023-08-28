import { UserEntity } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/Base';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import MessageEntity from './message.entity';

@Entity('conversation')
export class ConversationEntity extends Base {
  @ManyToMany(() => UserEntity, (user) => user.conversation)
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (msg) => msg.conversation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  messages: MessageEntity[];

  @Column()
  type: string;

  @OneToOne(() => MessageEntity)
  @JoinColumn({ name: 'last_message_sent' })
  lastMessageSent: MessageEntity;
}
