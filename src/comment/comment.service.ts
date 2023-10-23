import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/post/entities/post.entity';
import { LikeToCommentEntity } from './entities/like.entity';
import {
  v2 as cloudinary,
  UpdateApiOptions,
  ConfigAndUrlOptions,
} from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(LikeToCommentEntity)
    private readonly likeRepository: Repository<LikeToCommentEntity>,
    private cloudinaryService: CloudinaryService, // @InjectRepository(LikeToCommentEntity) // private readonly likeRepository: Repository<LikeToCommentEntity>,
  ) {}
  async create(
    currentUserId: string,
    createCommentDto: CreateCommentDto,
    postId: string,
  ) {
    const { attachment, text } = createCommentDto;
    // cloudinary.config({
    //   // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    //   // api_key: process.env.CLOUDINARY_API_KEY,
    //   // api_secret: process.env.CLOUDINARY_API_SECRET,
    //   cloud_name: 'daswkls85',
    //   api_key: '456839817517438',
    //   api_secret: 'dd',
    //   account_id: 'a700e625a3cb2a0b88b4f282f2f1bf',
    // });
    // cloudinary.uploader.upload(
    //   attachment,
    //   // { public_id: 'olympic_flag' },
    //   function (error, result) {
    //     console.log('result', result, error);
    //   },
    // );
    // if (!attachment && !text) {
    //   return new BadRequestException('');
    // }
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post)
      return new BadRequestException(
        "you're trying to comment on a post that doesn't exist",
      );
    const comment = this.commentRepository.create({
      post: { id: postId },
      user: { id: currentUserId },
      // text: createCommentDto.text,
    });
    if (text) {
      comment.text = text;
    }
    if (attachment && attachment.length > 0) {
      const attachments = await this.cloudinaryService.createAttachment(
        attachment,
        'comment',
        comment.id,
      );
      // comment.attachment = attach
      comment.attachment = attachments;
      // if(attachment.resource_type === 'image') {
      // }
      // comment.attachment = attachment
      // const uploadedFile = await this.cloudinaryService.uploadFile(attachment);
      // comment.attachment = uploadedFile.secure_url;
    }
    await this.commentRepository.save(comment);
    post.commentsCount++;
    await this.postRepository.save(post);
    const response = await this.commentRepository.findOne({
      where: {
        id: comment.id,
      },
      relations: {
        user: true,
        attachment: true,
      },
    });
    return response;
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
    const data = {
      comment: { id: commentId },
      user: { id: currentUserId },
    };
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment)
      throw new BadRequestException(
        "You are trying to like a comment that doesn't exist",
      );
    const likeExist = await this.likeRepository.findOne({
      where: data,
    });

    if (!likeExist) {
      // await this.likeRepository.save(data);
      // comment.likesCount++;
      // const res = await this.commentRepository.save(comment);
      // return res;
      const like = await this.likeRepository.save(data);
      comment.likesCount++;
      const res = await this.commentRepository.save(comment);

      res.likes = [like];
      return res;
    }
    await this.likeRepository.delete({ id: likeExist.id });
    comment.likesCount--;
    const res = await this.commentRepository.save(comment);
    res.likes = [];
    return res;
  }

  async getCommentById(commentId: string) {}
  async getCommentsByPostId(postId: string) {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.attachment', 'attachment')
      .where('comment.post.id = :postId', { postId })
      .orderBy('comment.createdAt', 'DESC')
      .getMany();
  }
  async getAllComments() {
    return await this.commentRepository.find({
      relations: { likes: true },
    });
  }
}
