import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: any): Promise<CloudinaryResponse> {
    try {
      const uploadedFile = await cloudinary.uploader.upload(
        file,
        // { public_id: 'olympic_flag_02' },
        //   function (error, result) {
        //     console.log('result v2', result, error);
        //   },
      );
      console.log('uploadedFile here', uploadedFile);
      return uploadedFile;
    } catch (error) {
      //   return new BadRequestException('something went wrong');
    }
  }
}
