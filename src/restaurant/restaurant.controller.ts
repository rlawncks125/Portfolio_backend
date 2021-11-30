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

  @Get(':id')
  getRestaurantById(@Param() { id }: { id: number }) {
    return this.restaurantService.getRestaurantById(id);
  }

  @Post(':id/message')
  addRestaurantComment(@Param() { id }: { id: number }) {
    return this.commentService.addMesaageByRestaurantId(id);
  }

  @Post('message/add/:messageId')
  addChildMessageBymessageId(@Param() { messageId }: { messageId: number }) {
    return this.commentService.addChildMessageByMessageId(messageId);
  }
  @Get('message/:id')
  addmessageById(@Param() { id }: { id: number }) {
    return this.commentService.getMessageById(id);
  }
}
