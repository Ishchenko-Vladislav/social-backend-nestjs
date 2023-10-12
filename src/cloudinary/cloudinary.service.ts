import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');
// import streamifier from 'streamifier';
// import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      // const upload = cloudinary.uploader.upload
      const t = file.mimetype.split('/')[0];
      let type: 'auto' | 'video' | 'image' | 'raw' = 'auto';
      if (t) {
        type = t === 'video' ? 'video' : t === 'image' ? 'image' : 'auto';
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: type,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      // streamifier.createReadS(file.buffer).pipe(uploadStream);
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
    // try {
    //   const uploadedFile = await cloudinary.uploader.upload(
    //     file,
    //     // { public_id: 'olympic_flag_02' },
    //     //   function (error, result) {
    //     //     console.log('result v2', result, error);
    //     //   },
    //   );
    //   console.log('uploadedFile here', uploadedFile);
    //   return uploadedFile;
    // } catch (error) {
    //   //   return new BadRequestException('something went wrong');
    // }
  }
}
