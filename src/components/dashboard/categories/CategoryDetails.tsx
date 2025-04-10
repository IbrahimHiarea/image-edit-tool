import React, { SetStateAction } from 'react';
import { useGetById } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { Avatar, Box, CircularProgress, Grid, Typography } from '@mui/material';

import { ICategoryDto } from '@/types/categories';
import { AppDialog } from '@/components/sharedComponents/AppDialog';

interface ICategoryDetailsProps {
  showModal: boolean;
  setShowModal: (value: SetStateAction<boolean>) => void;
  categoryId: number | null;
}

export function CategoryDetails({ showModal, setShowModal, categoryId }: ICategoryDetailsProps) {
  // *@ Component Services
  // * Get Category By id
  const { data: categoryItem, isLoading } = useGetById<ICategoryDto>({
    url: API_URL.categories,
    id: String(categoryId),
  });

  return (
    <AppDialog
      title="Category Details"
      open={showModal}
      onClose={() => setShowModal(false)}
      maxWidth="md"
      withButtons={false}
    >
      {isLoading ? (
        <Box display={'flex'} justifyContent={'center'}>
          <CircularProgress size={24} color="primary" />
        </Box>
      ) : (
        <Grid container spacing={2} pt={3}>
          <Grid item xs={6}>
            <Avatar
              sx={{
                width: '200px',
                height: '200px',
              }}
              src={categoryItem?.image}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Name
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {categoryItem?.name}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {categoryItem?.description}
            </Typography>
          </Grid>
        </Grid>
      )}
    </AppDialog>
  );
}
