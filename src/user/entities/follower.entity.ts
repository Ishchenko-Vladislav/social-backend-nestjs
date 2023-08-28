import { Base } from 'src/utils/Base';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('followers')
export class SubscriptionEntity extends Base {
  @ManyToOne(() => UserEntity, (user) => user.following)
  @JoinColumn({ name: 'following_id' })
  following: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.followers)
  @JoinColumn({ name: 'follower_id' })
  follower: UserEntity;
}
