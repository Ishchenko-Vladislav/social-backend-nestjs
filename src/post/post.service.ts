import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { LikeToPostEntity } from './entities/like.entity';
import { SubscriptionEntity } from 'src/user/entities/follower.entity';
import { HashtagEntity } from './entities/hashtag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(LikeToPostEntity)
    private readonly likeRepository: Repository<LikeToPostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(HashtagEntity)
    private readonly hashtagRepository: Repository<HashtagEntity>,
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
    // const post = await this.postRepository.save({
    //   text: createPostDto.text,
    //   user: { id: currentUserId },
    // });
    const { hashtags, text } = createPostDto;
    const post = this.postRepository.create({
      text: text,
      user: { id: currentUserId },
    });
    // if (createPostDto.hashtags.length > 0) {
    // createPostDto.hashtags.forEach(async (el) => {
    //   const tag = await this.hashtagRepository.findOne({
    //     where: { name: el },
    //   });
    //   if (tag) post.tags;
    // });
    // }
    const tags = await Promise.all(
      hashtags.map(async (name) => {
        const tag = await this.hashtagRepository.findOne({ where: { name } });
        if (tag) return tag;
        return await this.createTag(name);
      }),
    );

    post.tags = tags;
    return await this.postRepository.save(post);
  }
  async createTag(name: string): Promise<HashtagEntity> {
    const tag = this.hashtagRepository.create({ name });
    return await this.hashtagRepository.save(tag);
  }

  async getAllHashtags() {
    const tags = await this.hashtagRepository.find({
      relations: { posts: true },
    });
    return tags;
  }

  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ) {
    const { hashtags, text } = updatePostDto;
    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: userId } },
    });
    if (!post) return new BadRequestException('no such post exists');
    if (text) post.text = text;
    if (hashtags) {
      const tags = await Promise.all(
        hashtags.map(async (name) => {
          const tag = await this.hashtagRepository.findOne({ where: { name } });
          if (tag) return tag;
          return await this.createTag(name);
        }),
      );
      post.tags = tags;
    }

    return await this.postRepository.save(post);
  }
  async getFollowingPosts(userId: string) {
    // const followingIds = await this.userRepository
    //   .createQueryBuilder('user')
    //   .leftJoin('user.following', 'following')
    //   // .relation('following', 'foll')
    //   // .select('foll', 'f')
    //   .select('following.id', 'id')
    //   .getMany();
    const following = await this.subscriptionRepository
      .createQueryBuilder('f')
      .leftJoin('f.follower', 'follower')
      .leftJoin('f.following', 'following')
      .where('following.id = :id', { id: userId })
      .select('follower.id')
      .getRawMany();
    // .leftJoinAndSelect('f.following', 'follower')
    // .groupBy('follower.id')

    // .leftJoinAndSelect('f.following', 'following')
    // .leftJoinAndSelect('f.follower', 'followers')
    // .addSelect('ff.id')
    // .addSelect('following.id')
    // .getMany();
    const followerIds = following.map((result) => result.follower_id);
    // const followingIds = following.map((result) => result.following_id);

    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('user.id IN (:...ids)', { ids: followerIds })
      .getMany();
    // .setParameter('ids', followingIds)
    // .getCount();
    return post;
  }

  async getPostById(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: {
        comments: { likes: true },
        likes: true,
        user: true,
        tags: true,
      },
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
