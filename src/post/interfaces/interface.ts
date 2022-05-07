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
