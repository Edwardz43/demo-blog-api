import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PostService } from './post.service';
import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
  FindPostByAuthorRequest,
  FindPostByAuthorResponse,
  Post,
  UpdatePostRequest,
  UpdatePostResponse,
} from './interfaces/interface';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @GrpcMethod('PostService')
  async create(data: CreatePostRequest): Promise<CreatePostResponse> {
    return this.postService.create(data);
  }

  @GrpcMethod('PostService', 'FindByAuthor')
  async findByAuthor(
    data: FindPostByAuthorRequest,
  ): Promise<FindPostByAuthorResponse> {
    return await this.postService.findByAuthor(data);
  }

  @GrpcMethod('PostService')
  async findById(data: { id: number }): Promise<Post> {
    return await this.postService.findById(data.id);
  }

  @GrpcMethod('PostService')
  async update(data: UpdatePostRequest): Promise<UpdatePostResponse> {
    return this.postService.update(data);
  }

  @GrpcMethod('PostService')
  async delete(data: DeletePostRequest): Promise<DeletePostResponse> {
    return this.postService.delete(data);
  }
}
