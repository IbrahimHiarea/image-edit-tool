import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

export interface ColorPickerFieldProps<T extends FieldValues> extends Omit<MuiTextFieldProps, 'name'> {
  name: FieldPath<T>;
  control: Control<T>;
}

export function ColorPickerInputField<T extends FieldValues>(props: ColorPickerFieldProps<T>) {
  const { name, control, ...textFieldProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          {...textFieldProps}
          type="color"
          error={!!error}
          helperText={error?.message}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            marginTop: '5px',
            '& input[type="color"]': {
              height: '40px',
              padding: '3px',
              cursor: 'pointer',
            },
            ...textFieldProps.sx,
          }}
        />
      )}
    />
  );
}
