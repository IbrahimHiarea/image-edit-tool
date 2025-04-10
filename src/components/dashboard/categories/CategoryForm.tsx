import { Grid } from '@mui/material';
import { Control } from 'react-hook-form';

import { TextAreaInputField } from '@/components/sharedComponents/input/TextAreaInputField';
import { TextInputField } from '@/components/sharedComponents/input/TextInputField';

import { CategoryFormValues } from './AddCategory';

interface CategoryFormProps {
  control: Control<CategoryFormValues>;
}

export function CategoryForm({ control }: CategoryFormProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextInputField name="name" control={control} label="Name" />
      </Grid>
      <Grid item xs={12}>
        <TextAreaInputField name="description" control={control} label="Description" />
      </Grid>
    </Grid>
  );
}
