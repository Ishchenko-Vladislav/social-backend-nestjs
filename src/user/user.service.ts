import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import {
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhereProperty,
  ILike,
  QueryBuilder,
  Repository,
} from 'typeorm';
import { hash } from 'bcrypt';
import { SubscriptionEntity } from './entities/follower.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (isExist) throw new BadRequestException('This email already exist');
    const hashPassword = await hash(createUserDto.password, 12);

    const userName =
      '@' +
      createUserDto.displayName +
      Math.random().toString(36).substring(2, 8) +
      Math.random().toString(36).substring(2, 8);
    const user = await this.userRepository.save({
      userName,
      displayName: createUserDto.displayName,
      email: createUserDto.email,
      password: hashPassword,
    });
    const { password: pass, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getProfile(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .loadRelationCountAndMap('user.followers', 'user.followers')
      .loadRelationCountAndMap('user.following', 'user.following')
      .where('user.id = :userId', { userId: userId })
      .getOne();
    return user;
  }

  async getUserWithFollowerCount(
    userId: string,
  ): Promise<UserEntity | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .loadRelationCountAndMap('user.followers', 'user.followers')
      .loadRelationCountAndMap('user.following', 'user.following')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async findOne(email: string) {
    return this.userRepository.findOne({
      where: { email },
      // relations: { chats: { chat: { participant: { user: true } } } },
    });
  }
  async findOneSelect(
    email: string,
    select?:
      | FindOptionsSelect<UserEntity>
      | FindOptionsSelectByString<UserEntity>,
  ) {
    return this.userRepository.findOne({ where: { email }, select });
  }

  async subscribeToUser(currentUserId: string, recipientId: string) {
    const data = {
      follower: { id: recipientId },
      following: { id: currentUserId },
    };

    const isSubscribe = await this.subscriptionRepository.findOneBy(data);

    if (!isSubscribe) {
      await this.subscriptionRepository.save(data);
      return true;
    }
    // return isSubscribe;
    await this.subscriptionRepository.delete(isSubscribe.id);
    return false;
  }

  async search(searchTerm?: string) {
    let options: FindOptionsWhereProperty<UserEntity> = {};

    if (searchTerm) {
      options = {
        userName: ILike(`%${searchTerm}%`),
      };
    }
    const users = await this.userRepository.find({
      where: {
        ...options,
      },
    });
    return users;
  }

  async allUser() {
    return await this.userRepository.find({
      relations: {
        followers: true,
        following: true,
        likesToComment: true,
        likesToPost: true,
        conversation: true,
        posts: true,
      },
    });
  }
}
