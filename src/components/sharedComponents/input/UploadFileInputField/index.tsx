import { useRef, useState } from 'react';
import { Button, FormHelperText, Stack, styled, Typography, useTheme } from '@mui/material';
import { Cloud } from '@phosphor-icons/react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

interface FileUploadInputProps<T extends FieldValues> extends UseControllerProps<T> {
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function UploadFileInputField<T extends FieldValues>({
  name,
  control,
  multiple = false,
  accept,
  maxSizeMB,
}: FileUploadInputProps<T>) {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    setFiles(files);
    return files;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack spacing={1}>
          <Button
            component="label"
            variant="outlined"
            color={error ? 'error' : 'primary'}
            startIcon={<Cloud size={32} />}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const files = e.dataTransfer.files;
              handleFileChange(files);
              field.onChange(files?.[0] ?? null);
            }}
            sx={{
              borderStyle: isDragOver ? 'dashed' : 'solid',
              backgroundColor: isDragOver ? theme.palette.action.hover : 'inherit',
              height: 120,
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography variant="body1">
              {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {accept ? `Supported formats: ${accept}` : 'Any file type'}
              {maxSizeMB && ` • Max size: ${maxSizeMB}MB`}
            </Typography>

            <VisuallyHiddenInput
              type="file"
              multiple={multiple}
              accept={accept}
              ref={inputRef}
              onChange={(e) => {
                const files = e.target.files;
                handleFileChange(files);
                field.onChange(files?.[0] ?? null);
              }}
              onBlur={field.onBlur}
            />
          </Button>

          {files && (
            <Stack spacing={0.5}>
              {Array.from(files).map((file, index) => (
                <Typography key={index} variant="caption" color="text.secondary">
                  • {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </Typography>
              ))}
            </Stack>
          )}

          <FormHelperText error={!!error}>{error?.message || ' '}</FormHelperText>
        </Stack>
      )}
    />
  );
}
