import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { LikeToPostEntity } from './entities/like.entity';
import { SubscriptionEntity } from 'src/user/entities/subscription.entity';
import { HashtagEntity } from './entities/hashtag.entity';
import { BookmarkEntity } from './entities/bookmark.entity';

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
    @InjectRepository(BookmarkEntity)
    private readonly bookmarkRepository: Repository<BookmarkEntity>,
  ) {}

  async likePost(currentUserId: string, postId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post)
      throw new BadRequestException(
        "You are trying to like a post that doesn't exist",
      );
    const data = { post: { id: postId }, user: { id: currentUserId } };
    // const res = {
    //   status: false,
    //   likesCount: 0,
    // };
    const likeExist = await this.likeRepository.findOne({
      where: data,
    });

    if (!likeExist) {
      // await this.likeRepository.save({
      //   post: { id: postId },
      //   user: { id: currentUserId },
      // });
      const s = await this.likeRepository.save(data);
      post.likesCount++;
      // post.likes.push(s);
      await this.postRepository.save(post);
      post.likes = [s];
      return post;
    }

    await this.likeRepository.delete({ id: likeExist.id });
    post.likesCount--;
    await this.postRepository.save(post);
    post.likes = [];
    return post;
  }

  async getProfilePosts(currentUserId: string, userName: string) {
    // if (!userName.startsWith('@')) userName = '@' + userName;
    const user = await this.userRepository.findOne({
      where: { userName },
    });
    if (!user) return new BadRequestException('user not found');
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.likes', 'l', 'l.user.id = :likeId', {
        likeId: currentUserId,
      })
      .leftJoinAndSelect('post.bookmarks', 'b', 'b.user.id = :bookmarksId', {
        bookmarksId: currentUserId,
      })
      .leftJoinAndSelect('user.followers', 'u', 'u.fromUser = :followersId', {
        followersId: currentUserId,
      })
      .where('user.userName = :userName', { userName })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
    return posts;
  }

  async getProfilePostsWithLikes(currentUserId: string, userName: string) {
    // if (!userName.startsWith('@')) userName = '@' + userName;
    const user = await this.userRepository.findOne({
      where: { userName },
    });
    if (!user) return new BadRequestException('user not found');
    // const posts = await this.likeRepository
    //   .createQueryBuilder('like')
    //   .leftJoinAndSelect('like.post', 'post')
    //   .leftJoin('like.user', 'user')

    //   .leftJoinAndSelect('post.likes', 'l', 'l.user.id = :id', {
    //     id: user.id,
    //   })
    //   .leftJoinAndSelect('post.bookmarks', 'b', 'b.user.id = :id', {
    //     id: user.id,
    //   })
    //   .leftJoinAndSelect('user.followers', 'u', 'u.following = :id', {
    //     id: user.id,
    //   })
    //   .where('user.userName = :userName', { userName })
    //   .getMany();
    // const posts = await this.postRepository
    //   .createQueryBuilder('post')
    //   // .leftJoin('post.likes', 'like')
    //   .leftJoinAndSelect('post.user', 'user')
    //   .innerJoinAndSelect('post.likes', 'l', 'l.user.id = :id', {
    //     id: user.id,
    //   })
    // .leftJoinAndSelect('post.likes', 'l', 'l.user.id = :id', {
    //   id: user.id,
    // })
    // .leftJoinAndSelect('l.user', 'pp')
    // .leftJoinAndSelect('post.bookmarks', 'b', 'b.user.id = :id', {
    //   id: currentUserId,
    // })
    // .leftJoinAndSelect('user.followers', 'u', 'u.fromUser = :id', {
    //   id: currentUserId,
    // })
    // .where('user.userName = :userName', { userName })
    // .where('like.user.userName = :userName', { userName })
    // .where((qb) => {
    //   const query = qb
    //     .subQuery()
    //     .select('like.post.id')
    //     .from(LikeToPostEntity, 'like')
    //     .where('like.user.id = :id', { id: user.id })
    //     .getQuery();
    //   return 'post.id IN ' + query;
    // })
    // .orderBy('post.createdAt', 'DESC')
    //   // .groupBy('post.id')
    // .getMany();
    // const posts = await this.postRepository
    //   .createQueryBuilder('post')
    //   .leftJoin('post.likes', 'like')
    //   .select(['post', 'like'])
    //   .where((qb) => {
    //     const query = qb
    //       .subQuery()
    //       .select('like.post.id')
    //       .from(LikeToPostEntity, 'like')
    //       .where('like.user.id = :id', { id: user.id })
    //       .getQuery();
    //     return 'post.id IN ' + query;
    //   })
    //   // .groupBy('post.id, like.id')
    //   // .getRawMany();
    //   .getMany();
    // const isLiked = await this.likeRepository.findOne({where: {user: {id: currentUserId}, post: {id: post.id}}})

    // const likes = await this.likeRepository.find({
    //   where: { user: { userName } },
    //   relations: ['post'],
    // });
    // const likes = await // .getMany();
    // this.likeRepository
    //   .createQueryBuilder('like')
    //   .leftJoin('like.post', 'post')
    //   .leftJoin('like.user', 'user')
    //   .select('post.id')
    //   .where('user.id = :id', { id: user.id })
    //   // .orderBy('post.id')
    //   // .getRawMany();
    //   // .subQuery
    //   .getQuery();
    // const ll = likes.map((el) => el.post.id);
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.likes', 'l', 'l.user.id = :likeId', {
        likeId: currentUserId,
      })
      .leftJoinAndSelect('post.bookmarks', 'b', 'b.user.id = :bookmarksId', {
        bookmarksId: currentUserId,
      })
      .leftJoinAndSelect('user.followers', 'u', 'u.fromUser = :followersId', {
        followersId: currentUserId,
      })
      .where(
        (qb) =>
          'post.id IN ' +
          qb
            .subQuery()
            .select('like.post.id')
            .from(LikeToPostEntity, 'like')
            .where('like.user.id = :userId', { userId: user.id })
            .getQuery(),
      )
      .getMany();
    return posts;
  }

  async getAllPosts() {
    const posts = await this.postRepository.find({
      // relations: { comments: true, likes: true, user: true, tags: true },
    });
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
    // const following = await this.subscriptionRepository
    //   .createQueryBuilder('f')
    //   .leftJoin('f.follower', 'follower')
    //   .leftJoin('f.following', 'following')
    //   .where('following.id = :id', { id: userId })
    //   .select('follower.id')
    //   .getRawMany();
    // .leftJoinAndSelect('f.following', 'follower')
    // .groupBy('follower.id')

    // .leftJoinAndSelect('f.following', 'following')
    // .leftJoinAndSelect('f.follower', 'followers')
    // .addSelect('ff.id')
    // .addSelect('following.id')
    // .getMany();
    // if (!following.length) return [];
    // const followerIds = following.map((result) => result.follower_id);
    // const followingIds = following.map((result) => result.following_id);
    // const existsQuery = <T>(builder: SelectQueryBuilder<T>) =>
    // `exists (${builder.getQuery()})`;
    // console.time('post');
    // .leftJoin('post.likes', 'like', 'like')
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.likes', 'l', 'l.user.id = :id', {
        id: userId,
      })
      .leftJoinAndSelect('post.bookmarks', 'b', 'b.user.id = :id', {
        id: userId,
      })
      .leftJoinAndSelect('user.followers', 'u', 'u.fromUser = :id', {
        id: userId,
      })
      .where((qb) => {
        const s = qb
          .subQuery()
          .select('sub.toUser.id')
          .from(SubscriptionEntity, 'sub')
          .where('sub.fromUser.id = :id', { id: userId })
          .getQuery();
        return 'user.id IN ' + s;
      })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
    // .groupBy('post.id, user.id, l.id')
    // .loadRelationCountAndMap('post.likesCount', 'post.likes')
    // .loadRelationCountAndMap('post.commentsCount', 'post.comments')
    // .loadRelationCountAndMap('post.bookmarksCount', 'post.bookmarks')
    // .loadRelationCountAndMap('post.followersCount', 'user.followers')
    // .loadRelationCountAndMap('post.followingCount', 'user.following')
    // .where('user.id IN (:...ids)', { ids: followerIds })
    // .addSelect('like', 'l')
    // console.timeEnd('post');
    // .getRawMany();
    // const post = await this.postRepository.createQueryBuilder('post')
    // .leftJoinAndSelect('post.user', 'user')
    // .select(['post', 'user', 'COUNT(post.)'])

    // .leftJoinAndSelect('post.likes', 'likes')
    // .leftJoin('post.likes', 'likes')
    // .select(['post', 'user', 'likes', 'COUNT(likes.id) AS likes'])
    // .addSelect('post.user', 'user')
    // .addSelect('COUNT(likes.id)', 'likesCount')
    // .groupBy('post.id, post.user.id')
    // .getRawMany();
    // .setParameter('ids', followingIds)
    // .getCount();
    // const isExistLike = await this.likeRepository.find({where: {
    //   post: {id: postd}
    // }})
    return post;
  }

  async getPostById(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: {
        comments: { likes: true },
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

  async bookmarkHandle(currentUserId: string, postId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) return new BadRequestException("this post don't exist");
    const data = {
      user: { id: currentUserId },
      post: { id: postId },
    };
    const bookmarkExist = await this.bookmarkRepository.findOne({
      where: data,
    });

    if (!bookmarkExist) {
      const b = await this.bookmarkRepository.save(data);
      post.bookmarksCount++;
      await this.postRepository.save(post);
      post.bookmarks = [b];
      return post;
    }
    await this.bookmarkRepository.delete({ id: bookmarkExist.id });
    post.bookmarksCount--;
    await this.postRepository.save(post);
    post.bookmarks = [];
    return post;
  }

  async getBookmarks() {
    const bookmarks = await this.bookmarkRepository.find({
      relations: { post: true, user: true },
    });
    return bookmarks;
    // return 'getBookmarks';
  }
}
