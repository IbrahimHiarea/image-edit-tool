import { SetStateAction } from 'react';
import { useCreate } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AnnotationType, IAddAnnotation } from '@/types/annotations';
import { IImageDto } from '@/types/images';
import { FormDialog } from '@/components/sharedComponents/FormDialog';

import { AnnotationsForm } from './AnnotationsForm';

interface IAddAnnotationsProps {
  showModal: boolean;
  setShowModal: (value: SetStateAction<boolean>) => void;
  images: IImageDto[];
}

export const AnnotationSchema = z.object({
  imageId: z.number().int().gt(0, { message: 'Image is Required' }),
  type: z.nativeEnum(AnnotationType),
  coordinates: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  color: z.string().min(1, { message: 'Color is required' }),
});

export type AnnotationFormValues = z.infer<typeof AnnotationSchema>;

export function AddAnnotations({ showModal, setShowModal, images }: IAddAnnotationsProps) {
  // *@ Component States
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
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

  // *@ Component Services
  const mutation = useCreate<IAddAnnotation>({
    url: API_URL.annotations,
  });

  // *@ Component Handlers
  const onSubmit = async (data: AnnotationFormValues) => {
    try {
      await mutation.mutateAsync(data);

      reset();
      setShowModal(false);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <>
      <FormDialog
        title="Add Annotation"
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit(onSubmit)}
        maxWidth="lg"
        isLoading={mutation.isPending}
        confirmText="Add"
      >
        <AnnotationsForm images={images} control={control} setValue={setValue} />
      </FormDialog>
    </>
  );
}
