//  // authUser로 체크되니깐 검사 패스해도될듯
//       // authUser.userName === nickName 체크하면될듯
//       const userMock = {
//         nickName: 'ss',
//         role: MessageUserRole.Anonymous,
//       };

import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { MessageUserRole } from '../entities/comment.entity';

//       const data: messageType = {
//         CreateTime: new Date(),
//         message: '자식 댓글이예용',
//         userInfo: {
//           role: userMock.role,
//           nickName: userMock.nickName,
//         },
//       };

export class AddMessageByCommentIdInPutDto {
  @ApiProperty({
    description: '코멘트 아이디',
    example: 'id',
  })
  commentId: number;

  @ApiProperty({
    description: '유저 유형',
    enum: [MessageUserRole.User, MessageUserRole.Anonymous],
  })
  role: MessageUserRole;

  @ApiProperty({
    description: '메세지',
  })
  message: string;
}

export class AddMessageByCommentIdOutPutDto extends CoreOutPut {}
