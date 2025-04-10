import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

interface CheckboxInputProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
}

export function CheckBoxInputField<T extends FieldValues>({ name, control, label }: CheckboxInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
            label={label}
          />
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
