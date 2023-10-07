import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { FileEntity } from 'src/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

export class CreateCountryDto {
  @ApiProperty({ example: 'Nga' })
  @IsNotEmpty()
  name: string;

  @Validate(IsNotExist, ['Country'], {
    message: 'countryAlreadyExists',
  })
  @ApiProperty({ example: 'glavproduct' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: FileEntity | null;
}
