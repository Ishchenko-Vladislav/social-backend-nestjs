import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthenticatedRequest } from 'src/auth/types/user.request';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('by-id/:commentId')
  getCommentById(
    @Req() req: AuthenticatedRequest,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.getCommentById(commentId);
  }
  @Get('all-comments')
  getAllComments(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
  ) {
    return this.commentService.getAllComments();
  }
  @Put(':commentId/like')
  likeToComment(
    @Req() req: AuthenticatedRequest,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.likeToComment(req.user.id, commentId);
  }

  @Post(':postId')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
  ) {
    return this.commentService.create(req.user.id, createCommentDto, postId);
  }

  @Delete(':commentId')
  deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentService.deleteComment(req.user.id, commentId);
  }
}
