import {
  Controller,
  Delete,
  Get,
  HttpCode, HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller({
  version: '1',
  path: 'files',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

/*  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))*/
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
  ) {
    try {
      return this.filesService.uploadFile(file);
    } catch (error) {
      throw new HttpException(error, 422);
    }
  }

  @Get(':path')
  download(
    @Param('path') path:string, @Response() response
  ) {
    try {
      return response.sendFile(path, { root: './files' });
    } catch (error) {
      throw new HttpException(error, 422);
    }
  }

  /**
   * Update a file in storage and database
   * @returns {Promise<FileEntity>} updated file
   * @param file {Express.Multer.File | Express.MulterS3.File} file to update
   * @param id file id
   */
  @ApiOperation({
    summary: 'Update a file in storage and database',
    description: 'This endpoint update a file in storage.',
  })
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      return this.filesService.updateFile(file, id);
    } catch (error) {
      throw new HttpException(error, 422);
    }
  }

  /**
   * Delete a file in storage and database
   * @returns {Promise<boolean>} deleted file
   * @param id file id
   */
  @ApiOperation({
    summary: 'Delete a file in storage and database',
    description: 'This endpoint delete a file from storage.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Param('id') id: string): Promise<boolean> {
    try {
      return await this.filesService.deleteFile(id);
    } catch (error) {
      throw new HttpException(error, 422);
    }
  }
}
