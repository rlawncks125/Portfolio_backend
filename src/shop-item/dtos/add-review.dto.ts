import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';

export class AddReviewInputDto {
  @ApiProperty({
    description: '판매 아이템 id',
    example: '판매 아이템 id',
  })
  soldId: number;

  @ApiProperty({
    description: '별점',
    example: '별점',
  })
  star: number;

  @ApiProperty({
    description: '리뷰 제목',
    example: '리뷰 제목',
  })
  title: string;

  @ApiProperty({
    description: '리뷰 내용',
    example: '리뷰 내용',
  })
  text: string;

  @ApiProperty({
    description: '추가 옵션',
    example: '추가 옵션',
  })
  selectedOptions: string;
}

export class AddReivewOutPutDto extends CoreOutPut {}
