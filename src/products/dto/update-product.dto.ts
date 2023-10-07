import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { FileEntity } from 'src/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Category } from 'src/categories/entities/category.entity';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 'Cánh ngỗng hun khói Nga' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'canh-ngong-hun-khoi' })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Đặc sản của Nga' })
  description: string;

  @ApiProperty({ example: 0 })
  price: number;

  @ApiProperty({ example: 0 })
  priceSale: number;

  @ApiProperty({ example: 5, type: Number })
  quantity: number;

  @ApiProperty({ example: '8934673100823', type: Number })
  barCode: string;

  @ApiProperty({ type: FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: FileEntity | null;

  @ApiProperty({ type: [FileEntity] })
  photos?: FileEntity[];

  @ApiProperty({ type: Category })
  @IsOptional()
  @Validate(IsExist, ['Category', 'id'], {
    message: 'categoryNotExists',
  })
  category: Category;
}
