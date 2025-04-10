import { FieldValues } from 'react-hook-form';

import { TextInputField, TextInputFieldProps } from '../TextInputField';

export function TextAreaInputField<T extends FieldValues>(props: TextInputFieldProps<T>) {
  return <TextInputField {...props} multiline minRows={3} />;
}
