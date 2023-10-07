import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRatingDto } from './create-rating.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateRatingDto extends PartialType(CreateRatingDto) {
  @ApiProperty({ example: 'Sản phẩm 5 sao' })
  @IsNotEmpty()
  content?: string;
}
