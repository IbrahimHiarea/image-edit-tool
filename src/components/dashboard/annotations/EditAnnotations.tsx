import { SetStateAction, useEffect } from 'react';
import { useGetById, useUpdate } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { AnnotationType, IAnnotationDto, IEditAnnotation } from '@/types/annotations';
import { IImageDto } from '@/types/images';
import { FormDialog } from '@/components/sharedComponents/FormDialog';

import { AnnotationFormValues, AnnotationSchema } from './AddAnnotations';
import { AnnotationsForm } from './AnnotationsForm';

interface IEditAnnotationsProps {
  annotationId: number | null;
  showModal: boolean;
  setShowModal: (value: SetStateAction<boolean>) => void;
  images: IImageDto[];
}

export function EditAnnotations({ showModal, setShowModal, annotationId, images }: IEditAnnotationsProps) {
  // *@ Component Services
  // * Get Annotation By id
  const { data: annotationItem, isLoading } = useGetById<IAnnotationDto>({
    url: API_URL.annotations,
    id: String(annotationId),
  });
  // ** Edit Annotation
  const mutation = useUpdate<IEditAnnotation>({
    url: API_URL.annotations,
  });

  // *@ Component States
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<AnnotationFormValues>({
    resolver: zodResolver(AnnotationSchema),
    defaultValues: {
      color: '#000000',
      coordinates: {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
      },
      imageId: 0,
      type: AnnotationType.rectangle,
    },
  });

  // *@ Component Effect
  useEffect(() => {
    if (annotationItem) {
      const { color, coordinates, imageId, type } = annotationItem;
      reset({
        color,
        coordinates,
        imageId,
        type,
      });
      // Force redraw the canvas
      setTimeout(() => {
        setValue('coordinates', coordinates);
      }, 100);
    }
  }, [annotationItem, reset, control]);

  // *@ Component Handlers
  const onSubmit = async (data: AnnotationFormValues) => {
    try {
      await mutation.mutateAsync({
        id: String(annotationId),
        data,
      });

      reset();
      setShowModal(false);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <FormDialog
      title="Edit Annotation"
      open={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleSubmit(onSubmit)}
      maxWidth="lg"
      confirmText="Edit"
      isLoading={mutation.isPending || isLoading}
    >
      <AnnotationsForm images={images} control={control} setValue={setValue} />
    </FormDialog>
  );
}
