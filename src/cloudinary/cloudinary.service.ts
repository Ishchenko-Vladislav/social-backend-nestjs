import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { CreateDtoAttachment } from 'src/comment/dto/create-comment.dto';
import { Repository } from 'typeorm';
import { AttachmentEntity } from './entities/attachment.entity';
import { InjectRepository } from '@nestjs/typeorm';
const streamifier = require('streamifier');
// import streamifier from 'streamifier';
// import { Express } from 'express';
type TFileTypes = 'auto' | 'video' | 'image' | 'raw';
// type TLimitFileSize = 'image' | 'video' | 'raw';
@Injectable()
export class CloudinaryService {
  constructor(
    @InjectRepository(AttachmentEntity)
    private readonly attachmentRepository: Repository<AttachmentEntity>,
  ) {}

  dictionary: Record<TFileTypes, string> = {
    image: 'image',
    video: 'video',
    raw: 'raw',
    auto: 'auto',
  };
  limitFileSize: Record<TFileTypes, number> = {
    image: 1024 * 1024 * 10,
    video: 1024 * 1024 * 50,
    raw: 1024 * 1024 * 10,
    auto: 1024 * 1024 * 50,
  };
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return await new Promise<CloudinaryResponse>((resolve, reject) => {
      const typeFromMimetype = file.mimetype.split('/')[0];
      const sizeFile = file.size;
      let fileType: TFileTypes = 'auto';
      if (typeFromMimetype) {
        fileType = this.dictionary[typeFromMimetype] || 'auto';
      }

      if (fileType === 'image' && sizeFile >= this.limitFileSize['image']) {
        return new BadRequestException(
          'Image size must be less than' + this.limitFileSize['image'],
        );
      } else if (
        fileType === 'video' &&
        sizeFile >= this.limitFileSize['video']
      ) {
        return new BadRequestException(
          'Video size must be less than' + this.limitFileSize['video'],
        );
      } else if (fileType === 'raw' && sizeFile >= this.limitFileSize['raw']) {
        return new BadRequestException(
          'File size like this must be less than' + this.limitFileSize['raw'],
        );
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: fileType,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string) {
    console.log('file deleted', publicId);
    return await cloudinary.uploader.destroy(publicId);
  }
  async createAttachment(
    attachment: CreateDtoAttachment[],
    entity: 'comment' | 'post',
    entityId: string,
  ) {
    // const attach = this.filterAttachmentField(attachment)
    // const attachments = attachment.map((el) =>
    //   this.filterAttachmentField(el, entity, entityId),
    // );
    const attachments = await Promise.all(
      attachment.map((el) => this.filterAttachmentField(el, entity, entityId)),
    );
    console.log('here created entitity attach', attachments);

    return attachments;
    // const attach = this.attachmentRepository.create({
    //   assetId: attachment.asset_id,
    //   bytes: attachment.bytes,
    //   createdAt: attachment.created_at,
    //   publicId: attachment.public_id,
    //   resourceType: attachment.resource_type,
    //   secureUrl: attachment.secure_url,
    //   url: attachment.url,
    //   [entity]: { id: entityId },
    // });
    // if (attachment.resource_type === 'video') {
    //   attach.video = {
    //     format: attachment.format,
    //     height: attachment.height,
    //     width: attachment.width,
    //   };
    // } else if (attachment.resource_type === 'image') {
    //   attach.image = {
    //     format: attachment.format,
    //     height: attachment.height,
    //     width: attachment.width,
    //   };
    // }
    // return;
  }

  private async filterAttachmentField(
    attachment: CreateDtoAttachment,
    entity: 'comment' | 'post',
    entityId: string,
  ) {
    const attach = this.attachmentRepository.create({
      assetId: attachment.asset_id,
      bytes: attachment.bytes,
      createdAt: attachment.created_at,
      publicId: attachment.public_id,
      resourceType: attachment.resource_type,
      secureUrl: attachment.secure_url,
      url: attachment.url,
      [entity]: { id: entityId },
    });
    if (attachment.resource_type === 'video') {
      attach.video = {
        format: attachment.format,
        height: attachment.height,
        width: attachment.width,
      };
    } else if (attachment.resource_type === 'image') {
      attach.image = {
        format: attachment.format,
        height: attachment.height,
        width: attachment.width,
      };
    }
    return this.attachmentRepository.save(attach);
    // if(attachment.resource_type === '')
  }
}
