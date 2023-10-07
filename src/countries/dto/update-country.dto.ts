import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { FileEntity } from 'src/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { CreateCountryDto } from './create-country.dto';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @ApiProperty()
  id?: string;

  @ApiProperty({ example: 'Nga' })
  name?: string;

  @Validate(IsNotExist, ['Country'], {
    message: 'countryAlreadyExists',
  })
  @ApiProperty({ example: 'nga' })
  @IsOptional()
  code?: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: FileEntity | null;
}
