'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { IAnnotationDto } from '@/types/annotations';
import { useAnnotations } from '@/components/dashboard/annotations/useAnnotations';
import { AppDataGrid } from '@/components/sharedComponents/AppDataGrid';

export default function Page(): React.JSX.Element {
  // *@ Component Hooks
  const { annotations, columns, isFetching, modals, handleAdd } = useAnnotations();

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Annotations</Typography>
          </Stack>
          <div>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </Stack>
        <AppDataGrid<IAnnotationDto> rows={annotations} columns={columns} isLoading={isFetching} />
      </Stack>
      {modals}
    </>
  );
}
