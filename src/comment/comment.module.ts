import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/entities/post.entity';
import { CommentEntity } from './entities/comment.entity';
import { LikeToCommentEntity } from './entities/like.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, CommentEntity, LikeToCommentEntity]),
    CloudinaryModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
