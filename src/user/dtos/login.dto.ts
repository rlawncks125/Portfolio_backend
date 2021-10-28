import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

// 방법 1 .pickType class로 만들어서 type값으로 할당
// Object구조로 만들고 싶을때 좋을거 같음

class UserOutPut extends PartialType(PickType(User, ['username', 'dsc'])) {}

export class LoginOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '토큰 입니다.',
    example: '토큰',
    required: false,
  })
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty({
    type: UserOutPut,
  })
  @IsOptional()
  user?: UserOutPut;
  //  !! 주의 return값 넘길떄 { username, dsc } 로념겨야함
  //  user로 넘기면 모든 데이터 넘어옴
}

// 방법 2 . IntersectionType을 사용하여 할당
// Swagger 두개 class 상속 할떄 IntersectionType(class1,class2)

// export class LoginOutPutDto extends IntersectionType(
//   CoreOutPut,
//   PartialType(PickType(User, ['username', 'dsc'])),
// ) {
//   @ApiProperty({
//     description: '토큰 입니다.',
//     example: '토큰',
//     required: false,
//   })
//   @IsString()
//   @IsOptional()
//   token?: string;

//   @ApiProperty({
//     type: UserOutPut,
//   })

// }
