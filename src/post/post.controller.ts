import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { PostService } from "./post.service";
import {
  CreatePostRequest,
  CreatePostResponse,
  FindPostByAuthorRequest,
  FindPostByAuthorResponse
} from "./interfaces/interface";

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
}
