import { UserEntity } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/Base';
import { Entity, ManyToOne, Column, OneToMany } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { AttachmentEntity } from 'src/cloudinary/entities/attachment.entity';

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

  @OneToMany(() => AttachmentEntity, (attach) => attach.message)
  attachment: AttachmentEntity[];
}
