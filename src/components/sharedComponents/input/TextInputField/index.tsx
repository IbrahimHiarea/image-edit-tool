import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

export interface TextInputFieldProps<T extends FieldValues> extends Omit<MuiTextFieldProps, 'name'> {
  name: FieldPath<T>;
  control: Control<T>;
}

export function TextInputField<T extends FieldValues>(props: TextInputFieldProps<T>) {
  const { name, control, ...textFieldProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          sx={{ marginTop: '5px' }}
          {...field}
          {...textFieldProps}
          error={!!error}
          helperText={error?.message}
          fullWidth
        />
      )}
    />
  );
}
