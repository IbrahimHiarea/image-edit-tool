import { SetStateAction, useCallback } from 'react';
import { useCreate } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ICategoryDto } from '@/types/categories';
import { IAddImage } from '@/types/images';
import { FormDialog } from '@/components/sharedComponents/FormDialog';

import { ImageForm } from './ImageForm';

interface IAddImageProps {
  showModal: boolean;
  setShowModal: (value: SetStateAction<boolean>) => void;
  categories: ICategoryDto[];
}

export const ImageSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  categoryId: z.number().gt(0, { message: 'Category is required' }),
  image: z.instanceof(File, { message: 'Image file is required' }).nullable(),
});

export type ImageFormValues = z.infer<typeof ImageSchema>;

export function AddImage({ showModal, setShowModal, categories }: IAddImageProps) {
  // *@ Component States
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<ImageFormValues>({
    resolver: zodResolver(ImageSchema),
    defaultValues: {
      name: '',
      categoryId: 0,
      image: null,
    },
  });

  // *@ Component Services
  const mutation = useCreate<IAddImage>({
    url: API_URL.images,
    asFormData: true,
  });

  // *@ Component Handlers
  const onSubmit = async (data: ImageFormValues) => {
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
        title="Add Image"
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit(onSubmit)}
        maxWidth="md"
        isLoading={mutation.isPending}
        confirmText="Add"
      >
        <ImageForm categories={categories} control={control} />
      </FormDialog>
    </>
  );
}
