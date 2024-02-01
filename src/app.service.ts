import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhereProperty, ILike, Repository } from 'typeorm';
import { UserEntity } from './user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagEntity } from './post/entities/hashtag.entity';
import { PostEntity } from './post/entities/post.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(HashtagEntity)
    private readonly hashtagRepository: Repository<HashtagEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async searchSomeone(searchTerm: string, only: string | undefined) {
    let options: FindOptionsWhereProperty<UserEntity | HashtagEntity> = {};
    if (!searchTerm) return [];

    if (only === 'tag' || searchTerm.startsWith('#')) {
      options = {
        name: ILike(`%${searchTerm}%`),
      };
      const tags = await this.hashtagRepository
        .createQueryBuilder('tag')
        .leftJoin('tag.posts', 'post')
        .select([
          'COUNT(post.id) AS postCount',
          'tag.id AS id',
          'tag.name AS name',
        ])
        .where('tag.name ILIKE :name', { name: `%${searchTerm}%` })
        .take(12)
        .groupBy('tag.id')
        .getRawMany();
      return tags;
    } else {
      let s = searchTerm.startsWith('@') ? searchTerm.slice(1) : searchTerm;

      options = {
        userName: ILike(`%${s}%`),
      };
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where(
          'user.userName ILIKE :searchTerm OR user.displayName ILIKE :searchTerm',
          { searchTerm: `%${s}%` },
        )
        .take(12)
        .getMany();
      // const users = await this.userRepository.find({
      //   where: {
      //     ...options,
      //   },
      //   take: 12,
      // });
      return users;
    }
  }
  async searchSomeoneBy(
    searchTerm: string,
    only: string | undefined,
    currentUserId: string,
    skip: number = 0,
  ) {
    let options: FindOptionsWhereProperty<UserEntity | HashtagEntity> = {};
    if (!searchTerm) return [];

    if (only === 'tag' || searchTerm.startsWith('#')) {
      let s = searchTerm.startsWith('#') ? searchTerm.slice(1) : searchTerm;

      options = {
        name: ILike(`%${s}%`),
      };
      const postByTags = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.attachment', 'attachment')
        .leftJoinAndSelect('post.tags', 'tags')
        .leftJoinAndSelect('post.likes', 'l', 'l.user.id = :likeId', {
          likeId: currentUserId,
        })
        .leftJoinAndSelect('post.bookmarks', 'b', 'b.user.id = :bookmarksId', {
          bookmarksId: currentUserId,
        })
        .leftJoinAndSelect('user.followers', 'u', 'u.fromUser = :followersId', {
          followersId: currentUserId,
        })
        .where('tags.name ILIKE :name', { name: `%${s}%` })
        // .take(20)
        // .skip(skip)
        .getMany();
      // const tags = await this.hashtagRepository
      //   .createQueryBuilder('tag')
      //   .leftJoin('tag.posts', 'post')
      //   .select([
      //     'COUNT(post.id) AS postCount',
      //     'tag.id AS id',
      //     'tag.name AS name',
      //   ])
      //   .where('tag.name ILIKE :name', { name: `%${searchTerm}%` })
      //   .take(12)
      //   .groupBy('tag.id')
      //   .getRawMany();
      return postByTags;
    } else {
      let s = searchTerm.startsWith('@') ? searchTerm.slice(1) : searchTerm;

      options = {
        userName: ILike(`%${s}%`),
      };
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where(
          'user.userName ILIKE :searchTerm OR user.displayName ILIKE :searchTerm',
          { searchTerm: `%${s}%` },
        )
        .take(12)
        .getMany();
      // const users = await this.userRepository.find({
      //   where: {
      //     ...options,
      //   },
      //   take: 12,
      // });
      return users;
    }
  }
}
