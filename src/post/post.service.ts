import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreatePostRequest,
  CreatePostResponse,
  FindPostByAuthorRequest,
  FindPostByAuthorResponse,
  UpdatePostRequest,
  UpdatePostResponse,
} from './interfaces/interface';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new post
   * @param data
   * @returns {Promise<CreatePostResponse>}
   */
  async create(data: CreatePostRequest): Promise<CreatePostResponse> {
    return await this.prisma.post
      .create({
        data: {
          title: data.title,
          content: data.content,
          published: data.isPublished,
          authorId: data.authorId,
        },
      })
      .then((res) => {
        return {
          id: res.id,
          message: 'ok',
        };
      })
      .catch((_) => {
        return {
          id: null,
          message: 'failed',
        };
      });
  }

  /**
   * Get all posts by specific author
   */
  async findByAuthor(
    data: FindPostByAuthorRequest,
  ): Promise<FindPostByAuthorResponse> {
    return await this.prisma.post
      .findMany({
        where: {
          authorId: data.authorId,
        },
      })
      .then((result) => {
        return { postList: result };
      });
  }

  /**
   * Update a post
   */
  async update(data: UpdatePostRequest): Promise<UpdatePostResponse> {
    const result = await this.prisma.post
      .update({
        data: {
          title: data.title,
          content: data.content,
          published: data.isPublished,
          updatedAt: new Date(),
        },
        where: {
          id: data.id,
        },
      })
      .then((res) => {
        return res ? 'ok' : 'failed';
      })
      .catch((error: Error) => {
        return error.message;
      });
    return { message: result };
  }
}
