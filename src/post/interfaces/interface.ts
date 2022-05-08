export class Post {
  id: number;
  title: string;
  content?: string;
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
