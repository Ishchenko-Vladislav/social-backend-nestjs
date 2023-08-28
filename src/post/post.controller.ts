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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticatedRequest } from 'src/auth/types/user.request';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('all-posts')
  getAllPosts() {
    return this.postService.getAllPosts();
  }
  @Get('my-posts')
  getAllMyPosts() {}

  @Put(':postId/like')
  likePost(@Req() req: AuthenticatedRequest, @Param('postId') postId: string) {
    return this.postService.likePost(req.user.id, postId);
  }

  @Delete(':postId')
  deletePost(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
  ) {
    return this.postService.deletePost(req.user.id, postId);
  }

  @Post()
  createPost(
    @Req() req: AuthenticatedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(req.user.id, createPostDto);
  }
  @Get(':postId')
  getPostById(@Param('postId') postId: string) {
    return this.postService.getPostById(postId);
  }
}
