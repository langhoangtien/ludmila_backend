import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { FileEntity } from 'src/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Category } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { Country } from 'src/countries/entities/country.entity';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Cánh ngỗng hun khói là đặc sản của Nga' })
  @IsOptional()
  introduction: string;

  @ApiProperty({ example: 'Cánh ngỗng hun khói là đặc sản của Nga' })
  @IsOptional()
  description: string;

  @ApiProperty({ example: 10.07 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 6.98 })
  @IsOptional()
  priceSale: number;

  @ApiProperty({ example: 10, type: Number })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: '8934673100823', type: Number })
  @IsOptional()
  barCode: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: FileEntity | null;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  photos: FileEntity[];

  @ApiProperty({ type: Category })
  @Validate(IsExist, ['Category', 'id'], {
    message: 'categoryNotExists',
  })
  category: Category;

  @ApiProperty({ type: Brand })
  @IsOptional()
  @Validate(IsExist, ['Brand', 'id'], {
    message: 'brandNotExists',
  })
  brand: Brand;

  @ApiProperty({ type: Country })
  @IsOptional()
  @Validate(IsExist, ['Country', 'id'], {
    message: 'countryNotExists',
  })
  country: Country;
}
