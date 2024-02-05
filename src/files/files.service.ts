import { HttpException, HttpStatus, Injectable, PreconditionFailedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceConfigType } from 'src/config/config.type';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly storage: string;

  constructor(
    private readonly configService: ConfigService<ServiceConfigType>,
  ) {
    this.storage = this.configService.getOrThrow('file.driver', {
      infer: true,
    });
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('file.awsS3Region', {
        infer: true,
      }),
      credentials: {
        accessKeyId: this.configService.getOrThrow('file.accessKeyId', {
          infer: true,
        }),
        secretAccessKey: this.configService.getOrThrow('file.secretAccessKey', {
          infer: true,
        }),
      },
    });

    this.bucketName = this.configService.getOrThrow('file.awsDefaultS3Bucket', {
      infer: true,
    });
  }

  async uploadFile(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<any> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = {
      local: `${this.configService.get('app.backendDomain', { infer: true })}/${this.configService.get('app.apiPrefix', { infer: true })}/v1/${
        file.path
      }`,
      s3: (file as Express.MulterS3.File).location,
    };

    return path[
      this.configService.getOrThrow('file.driver', { infer: true })
      ];
  }

  /**
   * Update file in storage and database
   * @returns {Promise<string>} success update of the file
   * @param file
   * @param id
   */
  async updateFile(
    file: Express.Multer.File | Express.MulterS3.File,
    id: string,
  ): Promise<any> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const fileKey = this.extractKeyFromUrl(id);
    this.storage === 'local'
      ? this.deleteFileFromLocal(fileKey)
      : await this.deleteFromS3Bucket(fileKey);

    // Create new path for updated file
    return {
      local: `/${this.configService.get('app.apiPrefix', { infer: true })}/v1/${
        file.path
      }`,
      s3: (file as Express.MulterS3.File).location,
    };
  }

  /**
   * Delete file from storage and database
   * @returns {Promise<boolean>} success deletion of the file
   * @param id
   */
  async deleteFile(id: string): Promise<boolean> {
    const fileKey = this.extractKeyFromUrl(id);
    this.storage === 'local'
      ? this.deleteFileFromLocal(fileKey)
      : await this.deleteFromS3Bucket(fileKey);

    return true;
  }

  /**
   * Extract the file key using its url
   * @returns {string} file key
   * @param url
   */
  extractKeyFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  /**
   * Delete file from aws s3 bucket
   * @returns {Promise<boolean>} success deletion of the file
   * @param {string} key aws s3 file key
   */
  async deleteFromS3Bucket(key: string): Promise<boolean> {
    const input = {
      Bucket: this.bucketName,
      Key: key,
    };
    const command = new DeleteObjectCommand(input);
    const awsResponse = await this.s3Client.send(command);
    if (
      !(
        awsResponse['$metadata'] &&
        awsResponse['$metadata'].httpStatusCode === 204
      )
    ) {
      throw new PreconditionFailedException(`Error file deletion`);
    }
    return true;
  }

  /**
   * Delete file from local files storage
   * @returns {Promise<boolean>} success deletion of the file
   * @param {string} key local file key
   */
  deleteFileFromLocal(key: string): boolean {
    const filePath = path.join(process.cwd(), 'files', key);
    fs.unlink(filePath, (err) => {
      if (err) {
        throw new PreconditionFailedException('Error file deletion');
      }
    });
    return true;
  }
}
