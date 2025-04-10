import React, { SetStateAction } from 'react';
import { useGetById } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { Avatar, Box, CircularProgress, Grid, Typography } from '@mui/material';

import { IImageDto } from '@/types/images';
import { AppDialog } from '@/components/sharedComponents/AppDialog';

interface IImageDetailsProps {
  showModal: boolean;
  setShowModal: (value: SetStateAction<boolean>) => void;
  imageId: number | null;
}

export function ImageDetails({ showModal, setShowModal, imageId }: IImageDetailsProps) {
  // *@ Component Services
  // * Get Image By id
  const { data: imageItem, isLoading } = useGetById<IImageDto>({
    url: API_URL.images,
    id: String(imageId),
  });

  return (
    <AppDialog
      title="Image Details"
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
              src={imageItem?.url}
            />
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" mb={1}>
                  Name
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {imageItem?.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" mb={1}>
                  Upload Date
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(imageItem?.uploadDate ?? '').toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" mb={1}>
                  Resolution
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {imageItem?.metadata.resolution}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" mb={1}>
                  Size
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {imageItem?.metadata.size}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </AppDialog>
  );
}
