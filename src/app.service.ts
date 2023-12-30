import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhereProperty, ILike, Repository } from 'typeorm';
import { UserEntity } from './user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagEntity } from './post/entities/hashtag.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(HashtagEntity)
    private readonly hashtagRepository: Repository<HashtagEntity>,
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
}
