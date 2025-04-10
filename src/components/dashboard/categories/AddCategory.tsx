import { SetStateAction, useCallback } from 'react';
import { useCreate } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { IAddCategory, ICategoryDto } from '@/types/categories';
import { IAddImage } from '@/types/images';
import { FormDialog } from '@/components/sharedComponents/FormDialog';

import { CategoryForm } from './CategoryForm';

interface IAddCategoryProps {
  showModal: boolean;
  setShowModal: (value: SetStateAction<boolean>) => void;
}

export const CategorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

export type CategoryFormValues = z.infer<typeof CategorySchema>;

export function AddCategory({ showModal, setShowModal }: IAddCategoryProps) {
  // *@ Component States
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // *@ Component Services
  const mutation = useCreate<IAddCategory>({
    url: API_URL.categories,
  });

  // *@ Component Handlers
  const onSubmit = async (data: CategoryFormValues) => {
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
        title="Add Category"
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit(onSubmit)}
        maxWidth="md"
        isLoading={mutation.isPending}
        confirmText="Add"
      >
        <CategoryForm control={control} />
      </FormDialog>
    </>
  );
}
