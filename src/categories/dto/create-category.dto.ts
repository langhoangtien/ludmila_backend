import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

export class CreateCategoryDto {
  @ApiProperty()
  id?: number | undefined;

  @ApiProperty({ example: 'TPCN' })
  @IsNotEmpty()
  name: string;

  @Validate(IsNotExist, ['Category'], {
    message: 'slugAlreadyExists',
  })
  @ApiProperty({ example: 'thuc-pham-chuc-nang' })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Món ăn ngon nhất' })
  @IsNotEmpty()
  description: string;
}
