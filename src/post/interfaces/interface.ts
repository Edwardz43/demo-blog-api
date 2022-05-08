export class Post {
  id: number;
  title: string;
  content?: string;
  published?: boolean;
  author?: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreatePostRequest {
  title: string;
  content: string;
  authorId: number;
  isPublished?: boolean;
}

export class CreatePostResponse {
  id: number;
  message: string;
}

export class FindPostByAuthorRequest {
  authorId: number;
}

export class FindPostByAuthorResponse {
  postList: Post[];
}

export interface UpdatePostRequest {
  id: number;
  title?: string;
  content?: string;
  isPublished?: boolean;
}

export interface UpdatePostResponse {
  message: string;
}

export type DeletePostRequest = {
  token: string;
  email: string;
  id: number;
};

export type DeletePostResponse = { message: string };
