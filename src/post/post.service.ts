import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { LikeToPostEntity } from './entities/like.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(LikeToPostEntity)
    private readonly likeRepository: Repository<LikeToPostEntity>,
  ) {}

  async likePost(currentUserId: string, postId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post)
      throw new BadRequestException(
        "You are trying to like a post that doesn't exist",
      );

    const likeExist = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: currentUserId } },
    });

    if (!likeExist) {
      await this.likeRepository.save({
        post: { id: postId },
        user: { id: currentUserId },
      });
      return true;
    }

    await this.likeRepository.delete({ id: likeExist.id });
    return false;
  }

  async getAllPosts() {
    const posts = await this.postRepository.find();
    // const posts = await this.postRepository.find({
    //   relations: { likes: true },
    // });
    return posts;
  }

  async createPost(currentUserId: string, createPostDto: CreatePostDto) {
    const post = await this.postRepository.save({
      text: createPostDto.text,
      user: { id: currentUserId },
    });
    return post;
  }

  async getPostById(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: { comments: { likes: true }, likes: true, user: true },
    });
    if (!post) throw new BadRequestException();

    return post;
  }

  async deletePost(currentUserId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: currentUserId } },
    });
    if (!post) throw new BadRequestException();

    await this.postRepository.delete({ id: postId });
    return true;
  }
}
