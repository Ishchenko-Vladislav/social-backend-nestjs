import { Base } from 'src/utils/Base';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('subscription')
export class SubscriptionEntity extends Base {
  @ManyToOne(() => UserEntity, (u) => u.following)
  @JoinColumn({ name: 'from_user_id' })
  fromUser: UserEntity;

  @ManyToOne(() => UserEntity, (u) => u.followers)
  @JoinColumn({ name: 'to_user_id' })
  toUser: UserEntity;
}
