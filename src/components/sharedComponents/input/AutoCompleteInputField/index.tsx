import { Autocomplete, TextField as MuiTextField } from '@mui/material';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

interface AutoCompleteInputProps<T extends FieldValues, Option> extends UseControllerProps<T> {
  options: Option[];
  getOptionLabel: (option: Option) => string;
  isOptionEqualToValue: (option: Option, value: Option) => boolean;
  label: string;
  multiple?: boolean;
}

export function AutoCompleteInputField<T extends FieldValues, Option extends { id: number }>({
  name,
  control,
  options,
  getOptionLabel,
  isOptionEqualToValue,
  label,
  multiple = false,
}: AutoCompleteInputProps<T, Option>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          multiple={multiple}
          options={options}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          value={
            multiple
              ? options.filter((opt) => (field.value as number[] | null)?.includes(opt.id))
              : options.find((opt) => opt.id === field.value) ?? null
          }
          onChange={(_, data) => {
            if (multiple) {
              field.onChange((data as Option[]).map((opt) => opt.id));
            } else {
              field.onChange((data as Option | null)?.id ?? null);
            }
          }}
          renderInput={(params) => (
            <MuiTextField {...params} label={label} error={!!error} helperText={error?.message} />
          )}
        />
      )}
    />
  );
}
