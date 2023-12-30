import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { LikeToPostEntity } from './entities/like.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { SubscriptionEntity } from 'src/user/entities/subscription.entity';
import { HashtagEntity } from './entities/hashtag.entity';
import { BookmarkEntity } from './entities/bookmark.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      LikeToPostEntity,
      UserEntity,
      SubscriptionEntity,
      HashtagEntity,
      BookmarkEntity,
    ]),
    CloudinaryModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
