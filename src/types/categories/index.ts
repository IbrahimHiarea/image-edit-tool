export interface ICategoryDto {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface IAddCategory {
  name: string;
  description: string;
}

export interface IEditCategory extends IAddCategory {}
