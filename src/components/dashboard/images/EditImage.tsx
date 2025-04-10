import { SetStateAction, useEffect } from 'react';
import { useGetById, useUpdate } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ICategoryDto } from '@/types/categories';
import { IEditImage, IImageDto } from '@/types/images';
import { FormDialog } from '@/components/sharedComponents/FormDialog';

import { ImageFormValues, ImageSchema } from './AddImage';
import { ImageForm } from './ImageForm';

interface IEditImageProps {
  imageId: number | null;
  showModal: boolean;
  setShowModal: (value: SetStateAction<boolean>) => void;
  categories: ICategoryDto[];
}

export function EditImage({ showModal, setShowModal, imageId, categories }: IEditImageProps) {
  // *@ Component Services
  // * Get Image By id
  const { data: imageItem, isLoading } = useGetById<IImageDto>({
    url: API_URL.images,
    id: String(imageId),
  });
  // ** Edit Image
  const mutation = useUpdate<IEditImage>({
    url: API_URL.images,
    asFormData: true,
  });

  // *@ Component States
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ImageFormValues>({
    resolver: zodResolver(ImageSchema),
    defaultValues: {
      name: '',
      categoryId: 0,
      image: null,
    },
  });

  // *@ Component Effect
  useEffect(() => {
    if (imageItem) {
      reset({
        name: imageItem?.name!,
        categoryId: imageItem?.categoryId!,
        image: null,
      });
    }
  }, [imageItem, reset]);

  // *@ Component Handlers
  const onSubmit = async (data: ImageFormValues) => {
    try {
      await mutation.mutateAsync({
        id: String(imageId),
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
      title="Edit Image"
      open={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleSubmit(onSubmit)}
      maxWidth="md"
      confirmText="Edit"
      isLoading={mutation.isPending || isLoading}
    >
      <ImageForm categories={categories} control={control} />
    </FormDialog>
  );
}
