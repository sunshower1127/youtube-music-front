export interface Music {
  title: string;
  author: string;
  thumbnail?: string;
  thumbnailColorcode?: string;
  thumbnailHue?: number;
  musicValue: { emotion: number; energy: number };
}
