import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { SubscriptionEntity } from './entities/subscription.entity';

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

    let userName =
      Math.random().toString(36).substring(2, 8) +
      Math.random().toString(36).substring(2, 8) +
      Math.random().toString(36).substring(2, 8);

    let isExistUserName = true;
    while (isExistUserName) {
      const u = await this.userRepository.findOne({ where: { userName } });
      if (!u) {
        isExistUserName = false;
        break;
      }
      userName += Math.random().toString(36).substring(2, 4);
    }

    const user = await this.userRepository.save({
      userName,
      displayName: createUserDto.displayName,
      email: createUserDto.email,
      password: hashPassword,
    });
    const { password: pass, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getProfile(userName: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      // .loadRelationCountAndMap('user.followers', 'user.followers')
      // .loadRelationCountAndMap('user.following', 'user.following')
      .where('user.userName = :userName', { userName })
      .getOne();
    return user;
  }

  async getUserWithFollowerCount(userId: string) {
    if (!userId) return new UnauthorizedException();
    const user = await this.userRepository
      .createQueryBuilder('user')
      // .loadRelationCountAndMap('user.followers', 'user.followers')
      // .loadRelationCountAndMap('user.following', 'user.following')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!user) return new UnauthorizedException();
    return user;
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
      fromUser: { id: currentUserId },
      toUser: { id: recipientId },
    };

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
    });
    const recipientUser = await this.userRepository.findOne({
      where: { id: recipientId },
    });
    if (!currentUser || !recipientUser)
      return new BadRequestException("user don't exist");

    const isSubscribe = await this.subscriptionRepository.findOneBy(data);

    if (!isSubscribe) {
      await this.subscriptionRepository.save(data);
      // const sub = this.subscriptionRepository.create(data)
      currentUser.followingCount++;
      recipientUser.followersCount++;
      await this.userRepository.save([currentUser, recipientUser]);
      return true;
    }
    // return isSubscribe;
    await this.subscriptionRepository.delete(isSubscribe.id);
    currentUser.followingCount--;
    recipientUser.followersCount--;
    await this.userRepository.save([currentUser, recipientUser]);
    return false;
  }

  async getFollowers(currentUserId: string, userName: string) {
    // if (!userName.startsWith('@')) userName = '@' + userName;
    const followers = await this.subscriptionRepository
      .createQueryBuilder('sub')
      .leftJoinAndSelect('sub.fromUser', 'fromUser')
      .leftJoinAndSelect('sub.toUser', 'toUser')
      // .leftJoinAndSelect('sub.toUser', 'toUser', 'toUser = :id', {
      //   id: currentUserId,
      // })
      .where('toUser.userName = :userName', { userName })
      .getMany();
    return followers;
  }
  async getFollowing(currentUserId: string, userName: string) {
    // if (!userName.startsWith('@')) userName = '@' + userName;
    const followers = await this.subscriptionRepository
      .createQueryBuilder('sub')
      .leftJoinAndSelect('sub.fromUser', 'fromUser')
      // .leftJoinAndSelect('sub.fromUser', 'fromUser', 'toUser = :id', {
      //   id: currentUserId,
      // })
      .leftJoinAndSelect('sub.toUser', 'toUser')
      .where('fromUser.userName = :userName', { userName })
      .getMany();
    return followers;
  }

  // async search(searchTerm?: string) {
  //   let options: FindOptionsWhereProperty<UserEntity> = {};

  //   if (searchTerm) {
  //     options = {
  //       userName: ILike(`%${searchTerm}%`),
  //     };
  //   }
  //   const users = await this.userRepository.find({
  //     where: {
  //       ...options,
  //     },
  //   });
  //   return users;
  // }

  async allUser() {
    return await this.userRepository.find({
      relations: {
        likesToComment: true,
        likesToPost: true,
        conversation: true,
        posts: true,
        bookmarks: true,
      },
    });
  }

  // async statusIsSubscription(currentUserId: string, userId: string) {
  //   // const isExist = await this.userRepository.createQueryBuilder('user')
  //   // .where('user.id = :id', {id: currentUserId})
  //   const isExist = await this.subscriptionRepository.findOne({
  //     where: {
  //       follower: { id: userId },
  //       following: { id: currentUserId },
  //     },
  //   });
  //   if (isExist) return { status: true };
  //   return { status: false };
  // }
}
