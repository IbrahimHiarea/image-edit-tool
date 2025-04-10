export type Metadata = {
  size: string;
  resolution: string;
};

export interface IImageDto {
  id: number;
  name: string;
  url: string;
  uploadDate: string;
  metadata: Metadata;
  categoryId: number;
}

export interface IAddImage {
  name: string;
  image: File | null;
  categoryId: number;
}

export interface IEditImage extends IAddImage {}
