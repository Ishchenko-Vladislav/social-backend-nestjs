import { Module } from '@nestjs/common';
// import { AppController } from './AppController';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { ConversationModule } from './conversation/conversation.module';
import { AppController } from './app.controller';
import { UserEntity } from './user/entities/user.entity';
import { HashtagEntity } from './post/entities/hashtag.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { WebsocketModule } from './websocket/websocket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PostEntity } from './post/entities/post.entity';
// import { RedisModule } from '@nestjs-modules/ioredis';
@Module({
  imports: [
    UserModule,
    AuthModule,
    CommentModule,
    PostModule,
    PassportModule,
    JwtModule.register({}),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConversationModule,
    TypeOrmModule.forFeature([UserEntity, HashtagEntity, PostEntity]),
    CloudinaryModule,
    WebsocketModule,
    EventEmitterModule.forRoot(),
    // RedisModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       type: 'single',
    //       options: {
    //         host: 'redis-18758.c274.us-east-1-3.ec2.cloud.redislabs.com',
    //         port: 18758,
    //         password: configService.get('REDIS_PASSWORD'),
    //       },
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
