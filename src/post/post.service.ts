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
      .catch(() => {
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
    userId: number;
    email: string;
    id: number;
  }): Promise<{ message: string }> {
    const posts = await this.prisma.user.findFirst({
      where: {
        id: data.userId,
        email: data.email,
      },
      include: {
        posts: true,
      },
    });
    const post = posts.posts.find((p) => p.id === data.id);
    if (!post) {
      return { message: 'post not found' };
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
