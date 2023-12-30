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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticatedRequest } from 'src/auth/types/user.request';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get('bookmarks')
  getBookmarks(
    @Req() req: AuthenticatedRequest,
    @Query('pageParam') pageParam: string,
  ) {
    return this.postService.getBookmarks(req.user.id, pageParam);
    // return 'ssssssss';
  }
  @Get('all-posts')
  getAllPosts() {
    return this.postService.getAllPosts();
  }
  @Get('all-hashtags')
  getAllHashtags() {
    return this.postService.getAllHashtags();
  }

  @Get('profile/posts/:userName')
  getAllProfilePosts(
    @Req() req: AuthenticatedRequest,
    @Param('userName') userName: string,
    @Query('pageParam') pageParam: string,
  ) {
    return this.postService.getProfilePosts(req.user.id, userName, pageParam);
  }
  @Get('profile/posts/likes/:userName')
  getAllProfilePostsWithLikes(
    @Req() req: AuthenticatedRequest,
    @Param('userName') userName: string,
    @Query('pageParam') pageParam: string,
  ) {
    return this.postService.getProfilePostsWithLikes(
      req.user.id,
      userName,
      pageParam,
    );
  }

  @Get('my/following/posts')
  getFollowingPosts(
    @Req() req: AuthenticatedRequest,
    @Query('pageParam') pageParam: string,
  ) {
    return this.postService.getFollowingPosts(req.user.id, pageParam);
  }

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

  @Patch(':postId')
  updatePost(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(req.user.id, postId, updatePostDto);
  }

  @Post('create')
  createPost(
    @Req() req: AuthenticatedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(req.user.id, createPostDto);
  }
  @Get(':postId')
  getPostById(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
  ) {
    return this.postService.getPostById(req.user.id, postId);
  }

  @Put('bookmark/:postId')
  bookmarkHandle(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
  ) {
    return this.postService.bookmarkHandle(req.user.id, postId);
  }
}
