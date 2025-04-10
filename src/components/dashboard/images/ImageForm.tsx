import { Grid } from '@mui/material';
import { Control } from 'react-hook-form';

import { ICategoryDto } from '@/types/categories';
import { AutoCompleteInputField } from '@/components/sharedComponents/input/AutoCompleteInputField';
import { TextInputField } from '@/components/sharedComponents/input/TextInputField';
import { UploadFileInputField } from '@/components/sharedComponents/input/UploadFileInputField';

import { ImageFormValues } from './AddImage';

interface ImageFormProps {
  control: Control<ImageFormValues>;
  categories: ICategoryDto[];
}

export function ImageForm({ control, categories }: ImageFormProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextInputField name="name" control={control} label="Name" />
      </Grid>
      <Grid item xs={12}>
        <AutoCompleteInputField
          name="categoryId"
          control={control}
          options={categories}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          label="Category"
        />
      </Grid>
      <Grid item xs={12}>
        <UploadFileInputField name="image" control={control} />
      </Grid>
    </Grid>
  );
}
