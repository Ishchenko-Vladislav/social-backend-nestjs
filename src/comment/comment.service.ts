import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/post/entities/post.entity';
import { LikeToCommentEntity } from './entities/like.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(LikeToCommentEntity)
    private readonly likeRepository: Repository<LikeToCommentEntity>,
  ) {}
  async create(
    currentUserId: string,
    createCommentDto: CreateCommentDto,
    postId: string,
  ) {
    const comment = await this.commentRepository.save({
      post: { id: postId },
      user: { id: currentUserId },
      text: createCommentDto.text,
    });
    return comment;
  }

  async deleteComment(currentUserId: string, commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        user: { id: currentUserId },
      },
    });

    if (!comment) throw new BadRequestException('Something went wrong');
    await this.commentRepository.delete(commentId);

    return comment;
  }

  async likeToComment(currentUserId: string, commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment)
      throw new BadRequestException(
        "You are trying to like a comment that doesn't exist",
      );
    const likeExist = await this.likeRepository.findOne({
      where: { comment: { id: commentId }, user: { id: currentUserId } },
    });

    if (!likeExist) {
      await this.likeRepository.save({
        post: { id: commentId },
        user: { id: currentUserId },
      });
      return true;
    }

    await this.likeRepository.delete({ id: likeExist.id });
    return false;
  }

  async getCommentById(commentId: string) {}
  async getCommentsByPostId(postId: string) {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.post.id = :postId', { postId })
      .getMany();
  }
  async getAllComments() {
    return await this.commentRepository.find();
  }
}
