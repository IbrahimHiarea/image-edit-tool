import { FieldValues } from 'react-hook-form';

import { TextInputField, TextInputFieldProps } from '../TextInputField';

interface NumberInputProps<T extends FieldValues> extends TextInputFieldProps<T> {
  min?: number;
  max?: number;
}

export function NumberInputField<T extends FieldValues>({ min, max, ...props }: NumberInputProps<T>) {
  return (
    <TextInputField
      {...props}
      type="number"
      inputProps={{
        min,
        max,
        step: props.inputProps?.step || 'any',
        ...props.inputProps,
      }}
    />
  );
}
