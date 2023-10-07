import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { CreateBrandDto } from './create-brand.dto';
import { FileEntity } from 'src/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiProperty({ example: 'Glavproduct' })
  name?: string;

  @Validate(IsNotExist, ['Brand'], {
    message: 'brandAlreadyExists',
  })
  @ApiProperty({ example: 'glavproduct' })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: FileEntity | null;

  @ApiProperty({ example: 'test1@example.com' })
  description?: string | undefined;
}
