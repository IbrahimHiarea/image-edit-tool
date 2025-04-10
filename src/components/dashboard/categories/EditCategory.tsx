import { SetStateAction, useEffect } from 'react';
import { useGetById, useUpdate } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ICategoryDto, IEditCategory } from '@/types/categories';
import { FormDialog } from '@/components/sharedComponents/FormDialog';

import { CategoryFormValues, CategorySchema } from './AddCategory';
import { CategoryForm } from './CategoryForm';

interface IEditCategoryProps {
  categoryId: number | null;
  showModal: boolean;
  setShowModal: (value: SetStateAction<boolean>) => void;
}

export function EditCategory({ showModal, setShowModal, categoryId }: IEditCategoryProps) {
  // *@ Component Services
  // * Get Category By id
  const { data: categoryItem, isLoading } = useGetById<ICategoryDto>({
    url: API_URL.categories,
    id: String(categoryId),
  });
  // ** Edit Category
  const mutation = useUpdate<IEditCategory>({
    url: API_URL.categories,
  });

  // *@ Component States
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // *@ Component Effect
  useEffect(() => {
    if (categoryItem) {
      reset({
        name: categoryItem?.name!,
        description: categoryItem?.description!,
      });
    }
  }, [categoryItem, reset]);

  // *@ Component Handlers
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      await mutation.mutateAsync({
        id: String(categoryId),
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
      title="Edit Category"
      open={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleSubmit(onSubmit)}
      maxWidth="md"
      confirmText="Edit"
      isLoading={mutation.isPending || isLoading}
    >
      <CategoryForm control={control} />
    </FormDialog>
  );
}
