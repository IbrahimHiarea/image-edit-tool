export enum AnnotationType {
  rectangle = 'rectangle',
  circle = 'circle',
  square = 'square',
}

export type AnnotationCoordinates = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface IAnnotationDto {
  id: number;
  imageId: number; // id
  type: AnnotationType;
  coordinates: AnnotationCoordinates;
  color: string;
}

export interface IAddAnnotation {
  imageId: number; // id
  type: AnnotationType;
  coordinates: AnnotationCoordinates;
  color: string;
}

export interface IEditAnnotation extends IAddAnnotation {}
