import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { LikeToPostEntity } from './entities/like.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { SubscriptionEntity } from 'src/user/entities/follower.entity';
import { HashtagEntity } from './entities/hashtag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      LikeToPostEntity,
      UserEntity,
      SubscriptionEntity,
      HashtagEntity,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
