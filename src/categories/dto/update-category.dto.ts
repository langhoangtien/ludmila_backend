import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({ example: 'TPCN' })
  id?: number | undefined;
  @ApiProperty({ example: 'TPCN' })
  name?: string;

  @Validate(IsNotExist, ['Category'], {
    message: 'slugAlreadyExists',
  })
  @ApiProperty({ example: 'thuc-pham-chuc-nang' })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'test1@example.com' })
  description?: string | undefined;
}
