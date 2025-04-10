import React, { SetStateAction } from 'react';
import { useGetById } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { Avatar, Box, CircularProgress, Grid, Typography } from '@mui/material';

import { IAnnotationDto } from '@/types/annotations';
import { AppDialog } from '@/components/sharedComponents/AppDialog';

interface IAnnotationDetailsProps {
  showModal: boolean;
  setShowModal: (value: SetStateAction<boolean>) => void;
  annotationId: number | null;
}

export function AnnotationDetails({ showModal, setShowModal, annotationId }: IAnnotationDetailsProps) {
  // *@ Component Services
  // * Get annotation By id
  const { data: annotationItem, isLoading } = useGetById<IAnnotationDto>({
    url: API_URL.annotations,
    id: String(annotationId),
  });

  return (
    <AppDialog
      title="Annotation Details"
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
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Image Id
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {annotationItem?.imageId}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Type
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {annotationItem?.type}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Color
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {annotationItem?.color}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              X
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {annotationItem?.coordinates.x}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Y
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {annotationItem?.coordinates.y}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Width
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {annotationItem?.coordinates.width}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Height
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {annotationItem?.coordinates.height}
            </Typography>
          </Grid>
        </Grid>
      )}
    </AppDialog>
  );
}
