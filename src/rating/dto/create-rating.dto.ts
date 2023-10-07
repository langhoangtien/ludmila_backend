import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class CreateRatingDto {
  @ApiProperty({ example: 'Sản phẩm tốt, hữu ích với người tiêu dùng' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: User })
  @Validate(IsExist, ['User', 'id'], {
    message: 'userNotExists',
  })
  role: User;
}
