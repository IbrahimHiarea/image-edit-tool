'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { ICategoryDto } from '@/types/categories';
import { useCategories } from '@/components/dashboard/categories/useCategories';
import { AppDataGrid } from '@/components/sharedComponents/AppDataGrid';

export default function Page(): React.JSX.Element {
  // *@ Component Hooks
  const { categories, columns, isFetching, modals, handleAdd } = useCategories();

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Categories</Typography>
          </Stack>
          <div>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </Stack>
        <AppDataGrid<ICategoryDto> rows={categories} columns={columns} isLoading={isFetching} />
      </Stack>
      {modals}
    </>
  );
}
