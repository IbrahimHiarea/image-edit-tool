import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';

import { TextInputFieldProps } from '../TextInputField';

interface SelectInputProps<T extends FieldValues> extends TextInputFieldProps<T> {
  options: { value: string | number; label: string }[];
}

export function SelectInputField<T extends FieldValues>({ options, ...props }: SelectInputProps<T>) {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel>{props.label}</InputLabel>
          <Select {...field} label={props.label}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
