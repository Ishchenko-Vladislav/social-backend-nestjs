import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentEntity } from './entities/attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttachmentEntity])],
  controllers: [CloudinaryController],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
