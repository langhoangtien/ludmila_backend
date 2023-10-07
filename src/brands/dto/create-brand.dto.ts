import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { FileEntity } from 'src/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Glavproduct' })
  @IsNotEmpty()
  name: string;

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

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: '8-го Марта 4-я ул., 6-а, строение 1, Moscow, Nga, 125167',
    required: false,
  })
  @IsOptional()
  address: string;

  @ApiProperty({
    example: 'info@glavproduct.ru',
    required: false,
  })
  @IsOptional()
  mail: string;

  @ApiProperty({
    example: '+7 (495) 937-7544',
    required: false,
  })
  @IsOptional()
  fax: string;

  @ApiProperty({ example: '+7 495 937-75-77', required: true })
  @IsOptional()
  phone: string;

  @ApiProperty({ example: 'glavproduct.ru' })
  @IsOptional()
  site: string;

  @ApiProperty()
  id?: number | undefined;
}
