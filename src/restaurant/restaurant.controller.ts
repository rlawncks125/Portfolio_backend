import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService, RestaurantService } from './restaurant.service';

@ApiTags('restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly commentService: CommentService,
  ) {}

  @ApiOperation({ summary: '레스토랑 만들기' })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @Post()
  createRestaurant() {
    return this.restaurantService.createRestaurant();
  }

  @ApiOperation({ summary: '레스토랑 정보 조회' })
  @Get(':id')
  getRestaurantById(@Param() { id }: { id: number }) {
    return this.restaurantService.getRestaurantById(id);
  }

  @ApiOperation({ summary: '레스토랑 댓글 추가' })
  @Post(':id/message')
  addRestaurantComment(@Param() { id }: { id: number }) {
    return this.commentService.addMesaageByRestaurantId(id);
  }

  @ApiOperation({ summary: '레스토랑 댓글에 추가댓글 추가' })
  @Post('message/add/:messageId')
  addChildMessageBymessageId(@Param() { messageId }: { messageId: number }) {
    return this.commentService.addChildMessageByMessageId(messageId);
  }

  @ApiOperation({ summary: '댓글 정보 얻기' })
  @Get('message/:id')
  addmessageById(@Param() { id }: { id: number }) {
    return this.commentService.getMessageById(id);
  }
}

// *** 고민
// 댓글 추가시 유저 테이블에 자기가 쓴댓글로 반영할까?
