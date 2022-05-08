import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreatePostRequest,
  CreatePostResponse,
  FindPostByAuthorRequest,
  FindPostByAuthorResponse,
  Post,
  UpdatePostRequest,
  UpdatePostResponse,
} from './interfaces/interface';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

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
    const result = await this.prisma.post
      .findMany({
        include: {
          author: true,
        },
        where: {
          authorId: data.authorId,
        },
      })
      .then((result) => {
        return { postList: result };
      });
    const postList = result.postList.map((post) => {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
        author: post.author.name,
        authorId: post.author.id,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
    return { postList };
  }

  /**
   * Get post by id
   */
  async findById(id: number): Promise<Post> {
    const post = await this.prisma.post.findFirst({
      include: {
        author: true,
      },
      where: { id },
    });
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      published: post.published,
      author: post.author.name,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
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

  /**
   * Delete a post
   */
  async delete(data: {
    email: string;
    token: string;
    id: number;
  }): Promise<{ message: string }> {
    const isValid = await this.authService.validateToken(
      data.email,
      data.token,
    );
    if (!isValid) {
      return { message: 'invalid input info' };
    }
    const result = await this.prisma.post
      .delete({
        where: {
          id: data.id,
        },
      })
      .then((res) => (res ? 'ok' : 'failed'))
      .catch((error: Error) => error.message);
    return { message: result };
  }
}
