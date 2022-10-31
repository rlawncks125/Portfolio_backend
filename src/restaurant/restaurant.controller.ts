import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { authUser } from 'src/auth/authUser.decorator';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { RoomService } from 'src/room/room.service';
import { User } from 'src/user/entities/user.entity';
import {
  AddMessageByCommentIdInPutDto,
  AddMessageByCommentIdOutPutDto,
} from './dtos/AddMessageByCommentId.dto';
import {
  AddRestaurantCommentByIdIdInputDto,
  AddRestaurantCommentByIdIdOutPutDto,
} from './dtos/AddRestaurantCommentById.dto';
import {
  CreateRestaurantInputDto,
  CreateRestaurantOutPutDto,
} from './dtos/CreateRestaurant.dto';
import {
  EditCommentChildMessageInPutDto,
  EditCommentChildMessageOutPutDto,
} from './dtos/EditCommentChildMessage.dto';
import {
  EditCommentMessageInPutDto,
  EditCommentMessageOutPutDto,
} from './dtos/EditCommentMessage.dto';
import {
  GetRestaurantByIdOutPutDto,
  GetRestaurantByIdParmsDto,
} from './dtos/GetRestaurantById.dto';
import {
  RemoveChildMessageInputDto,
  RemoveChildMessageOutPutDto,
  RemoveMessageByIdOutPutDto,
  RemoveMessageByParamsDto,
} from './dtos/RemoveMessageById.dto';
import {
  RemoveRestaurantOutPutDto,
  RemoveRestaurantPramsDto,
} from './dtos/RemoveRestaurant.dto';
import { CommentService, RestaurantService } from './restaurant.service';

@ApiHeader({
  name: 'acces-token',
})
@ApiTags('restaurant')
@UseGuards(AuthGuard)
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly commentService: CommentService,
  ) {}

  @ApiOperation({ summary: '레스토랑 정보 조회 ( getRestaurantById )' })
  @ApiResponse({
    type: GetRestaurantByIdOutPutDto,
    status: 200,
  })
  @Get(':id')
  getRestaurantById(
    @Param() { id }: GetRestaurantByIdParmsDto,
  ): Promise<GetRestaurantByIdOutPutDto> {
    return this.restaurantService.getRestaurantById(id);
  }

  @ApiOperation({ summary: '레스토랑 만들기 ( createRestaurant )' })
  @ApiResponse({
    type: CreateRestaurantOutPutDto,
    status: 200,
  })
  @Post()
  createRestaurant(
    @authUser() user: User,
    @Body() createRestaurantInput: CreateRestaurantInputDto,
  ): Promise<CreateRestaurantOutPutDto> {
    return this.restaurantService.createRestaurant(user, createRestaurantInput);
  }

  @ApiOperation({ summary: '레스토랑 삭제 ( removeRestaurant )' })
  @Delete(':id')
  removeRestaurant(
    @authUser() user: User,
    @Param() { id }: RemoveRestaurantPramsDto,
  ): Promise<RemoveRestaurantOutPutDto> {
    return this.restaurantService.removeRestaurant(user, id);
  }

  @ApiOperation({ summary: '레스토랑 댓글 추가 ( addRestaurantCommentById )' })
  @ApiResponse({
    type: AddRestaurantCommentByIdIdOutPutDto,
    status: 200,
  })
  @Post('comment')
  addRestaurantCommentById(
    @authUser() user: User,
    @Body() inputData: AddRestaurantCommentByIdIdInputDto,
  ): Promise<AddRestaurantCommentByIdIdOutPutDto> {
    return this.commentService.addRestaurantCommentById(user, inputData);
  }

  @ApiOperation({ summary: '레스토랑 댓글 변경 ( editCommentMessage )' })
  @ApiResponse({
    status: 200,
    type: EditCommentMessageOutPutDto,
  })
  @Patch('comment')
  editCommentMessage(
    @authUser() user: User,
    @Body() bodyData: EditCommentMessageInPutDto,
  ): Promise<EditCommentMessageOutPutDto> {
    return this.commentService.editCommentMessage(user, bodyData);
  }

  @ApiOperation({
    summary: '레스토랑 댓글에 추가댓글 추가 ( addMessageByCommentId )',
  })
  @ApiResponse({
    type: AddMessageByCommentIdOutPutDto,
    status: 200,
  })
  @Post('comment/addMessage')
  addMessageByCommentId(
    @authUser() user: User,
    @Body() inputData: AddMessageByCommentIdInPutDto,
  ): Promise<AddMessageByCommentIdOutPutDto> {
    return this.commentService.addMessageByCommentId(user, inputData);
  }

  @ApiOperation({
    summary: '레스토랑 댓글에 추가댓글 삭제 ( removeCommentChildMessage )',
  })
  @ApiResponse({
    type: RemoveChildMessageOutPutDto,
    status: 200,
  })
  @Patch('comment/removeMessage')
  removeCommentChildMessage(
    @authUser() user: User,
    @Body() input: RemoveChildMessageInputDto,
  ): Promise<AddMessageByCommentIdOutPutDto> {
    return this.commentService.removeCommentChildMessage(user, input);
  }

  @ApiOperation({ summary: '레스토랑 대댓글 변경 ( editCommentChildMessage )' })
  @ApiResponse({
    type: EditCommentChildMessageOutPutDto,
    status: 200,
  })
  @Patch('comment/addMessage')
  editCommentChildMessage(
    @authUser() user: User,
    @Body()
    bodyData: EditCommentChildMessageInPutDto,
  ): Promise<EditCommentChildMessageOutPutDto> {
    return this.commentService.editCommentChildMessage(user, bodyData);
  }

  @ApiOperation({ summary: '댓글 정보 얻기 ( addMessageById 없어도 될듯? )' })
  @Get('comment/:id')
  addMessageById(@Param() { id }: RemoveMessageByParamsDto) {
    return this.commentService.getMessageById(id);
  }

  @ApiOperation({ summary: '댓글 삭제 ( removeMessageById ) ' })
  @ApiResponse({
    type: RemoveMessageByIdOutPutDto,
    status: 200,
  })
  @Delete('comment/:id')
  removeMessageById(
    @authUser() user: User,
    @Param() { id }: RemoveMessageByParamsDto,
  ): Promise<RemoveMessageByIdOutPutDto> {
    return this.commentService.removeMessageById(user, +id);
  }
}

// *** 고민
// 댓글 추가시 유저 테이블에 자기가 쓴댓글로 반영할까?
