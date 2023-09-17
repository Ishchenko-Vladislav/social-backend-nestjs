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

  async searchSomeone(searchTerm: string) {
    let options: FindOptionsWhereProperty<UserEntity | HashtagEntity> = {};
    if (!searchTerm) return [];

    if (searchTerm.startsWith('#')) {
      options = {
        name: ILike(`%${searchTerm}%`),
      };
      // const tags = await this.hashtagRepository.find({ where: { ...options } });
      // const s = tags.map(tag => tag.)
      const tags = await this.hashtagRepository
        .createQueryBuilder('tag')
        .leftJoin('tag.posts', 'post')
        // .alias
        .select([
          'COUNT(post.id) AS postCount',
          'tag.id AS id',
          'tag.name AS name',
        ])
        // .addSelect('tag.name')
        // .select('tag.name')
        // .addSelect('COUNT(post.id)', 'postCount') // Подсчитываем количество постов и даем ему псевдоним postCount
        .where('tag.name ILIKE :name', { name: `%${searchTerm}%` })
        // .groupBy('tag.id, post.id') // Группируем по ID тега, чтобы получить правильные счетчики
        .groupBy('tag.id')
        .getRawMany();

      // const tags = await this.hashtagRepository
      //   .createQueryBuilder('tag')
      //   .leftJoin('tag.posts', 'post')
      //   .select(['COUNT(post.id) AS postCount', 'tag'])
      //   // .addSelect('COUNT(post.id) AS postCount')
      //   // .loadRelationCountAndMap('tag.postCount', 'tag.posts')
      //   .where('tag.name ILIKE :name', { name: `%${searchTerm}%` })
      //   // .groupBy('tag.id, post.id')
      //   .groupBy('tag.id')
      //   // .addGroupBy('post.id')
      //   // .getMany();
      //   .getRawMany();

      // .getMany();
      //   const tags = await this.hashtagRepository
      //     .createQueryBuilder('tag')
      //     // .leftJoinAndSelect('tag.posts', 'post')
      //     // .leftJoinAndSelect('tag.posts', 'post')
      //     // .addSelect('COUNT(post.id)', 'postCount')
      //     // .loadAllRelationIds({ relations: ['posts'] })

      //     .loadRelationCountAndMap('tag.postsCount', 'tag.posts')
      //     // .where('tag.name = :tagsName', { tagsName: ILike(`%${searchTerm}%`) })
      //     .where('tag.name ILIKE :name', { name: `%${searchTerm}%` })
      // .getRawMany();
      //       .getMany();
      //   .groupBy('tag')
      //   .getOne();
      return tags;
    }
    let s;
    if (searchTerm.startsWith('@')) {
      s = searchTerm.length > 1 ? searchTerm.slice(1) : '';
    }
    options = {
      userName: ILike(`%${s}%`),
    };
    const users = await this.userRepository.find({
      where: {
        ...options,
      },
    });
    return users;
    // if (searchTerm.startsWith('@')) {
    //   options = {
    //     userName: ILike(`%${searchTerm}%`),
    //   };
    // }
  }
}
