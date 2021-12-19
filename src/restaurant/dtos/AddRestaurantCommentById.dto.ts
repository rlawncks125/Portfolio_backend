// const data = {
//     user: {
//       nickName: 'ss',
//       role: MessageUserRole.User,
//     },
//     message: {
//       message: '추가 댓글이예용22',
//       userName: 'userNa',
//     },
//     star: 5,
//   };

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max } from 'class-validator';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { MessageUserRole } from '../entities/comment.entity';

export class AddRestaurantCommentByIdIdInputDto {
  @ApiProperty({
    description: '레스토랑 아이디',
    example: 'id',
  })
  restaurantId: number;

  @ApiProperty({
    description: '유저 유형',
    enum: [MessageUserRole.User, MessageUserRole.Anonymous],
  })
  role: MessageUserRole;

  @ApiProperty({
    description: '메세지',
  })
  message: string;

  @ApiProperty({
    description: '별점',
    example: '>=5',
    maximum: 5,
  })
  @IsNumber()
  @Max(5)
  star: number;
}

export class AddRestaurantCommentByIdIdOutPutDto extends CoreOutPut {}
