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
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthenticatedRequest } from 'src/auth/types/user.request';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

  @Get(':postId')
  getCommentsByPostId(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
    @Query('pageParam') pageParam: string,
  ) {
    return this.commentService.getCommentsByPostId(
      postId,
      req.user.id,
      pageParam,
    );
  }

  @Post(':postId')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
  ) {
    // cloudinaryService.
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
