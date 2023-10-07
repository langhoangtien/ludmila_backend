import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async uploadFile(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileEntity> {
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
      local: `/${this.configService.get('app.apiPrefix', { infer: true })}/v1/${
        file.path
      }`,
      // local: file.path,
      s3: (file as Express.MulterS3.File).location,
    };

    return this.fileRepository.save(
      this.fileRepository.create({
        path: path[
          this.configService.getOrThrow('file.driver', { infer: true })
        ],
      }),
    );
  }

  async uploadFiles(
    files: Express.Multer.File[] | Express.MulterS3.File[],
  ): Promise<FileEntity[]> {
    if (!files.length) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            files: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const paths = files.map((file) => {
      const path = {
        local: `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/${file.path}`,
        // local: file.path,
        s3: (file as Express.MulterS3.File).location,
      };

      return path[
        this.configService.getOrThrow('file.driver', { infer: true })
      ];
    });

    return Promise.all(paths.map((e) => this.getListFile(e)));
  }

  async getListFile(item) {
    return await this.fileRepository.save(
      this.fileRepository.create({ path: item }),
    );
  }
}
