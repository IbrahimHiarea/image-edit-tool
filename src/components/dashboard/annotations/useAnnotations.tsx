'use client';

import { useCallback, useState } from 'react';
import { useDelete, useGetAll } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { Pencil, Trash } from '@phosphor-icons/react/dist/ssr';

import { IAnnotationDto } from '@/types/annotations';
import { IImageDto } from '@/types/images';
import { AppDialog } from '@/components/sharedComponents/AppDialog';

import { AddAnnotations } from './AddAnnotations';
import { EditAnnotations } from './EditAnnotations';

export function useAnnotations() {
  // *@ Component States
  const [rowId, setRowId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // *@ Component Handlers
  const handleAdd = useCallback(() => {
    setShowAddModal(true);
  }, []);
  const handleEdit = useCallback((id: number) => {
    setShowEditModal(true);
    setRowId(id);
  }, []);
  const handleDelete = useCallback((id: number) => {
    setShowDeleteModal(true);
    setRowId(id);
  }, []);

  // *@ Component Services
  // * Get the annotations
  const { data: annotations = [], isFetching } = useGetAll<IAnnotationDto>({
    url: API_URL.annotations,
  });

  // ** Get the images for showing the image of the annotation
  const { data: images = [] } = useGetAll<IImageDto>({
    url: API_URL.images,
  });

  // *** Delete Annotation
  const mutation = useDelete({
    url: API_URL.annotations,
  });

  // *@ Component Columns
  const columns: GridColDef<IAnnotationDto>[] = [
    {
      field: 'imageId',
      headerName: 'Image',
      flex: 1,
      type: 'singleSelect',
      valueOptions: images?.map((category: IImageDto) => ({
        value: category.id,
        label: category.name,
      })),
      renderCell: (params) => {
        const category = images?.find((c: IImageDto) => c.id === params.row.imageId);

        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle2">{category?.name}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      type: 'string',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2">{params.row.type}</Typography>
        </Box>
      ),
    },
    {
      field: 'color',
      headerName: 'Color',
      flex: 1,
      sortable: false,
      filterable: false,
      maxWidth: 100,
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: `${params.row.color}`,
            border: '1px solid #ccc',
          }}
        />
      ),
    },
    {
      field: 'width',
      headerName: 'Width',
      flex: 1,
      type: 'number',
      maxWidth: 100,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2">{params.row.coordinates.width}</Typography>
        </Box>
      ),
    },
    {
      field: 'height',
      headerName: 'Height',
      flex: 1,
      type: 'number',
      maxWidth: 100,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2">{params.row.coordinates.height}</Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      minWidth: 200,
      renderCell: (params) => (
        <>
          <IconButton color="secondary" title="Edit" onClick={() => handleEdit(params.row.id)}>
            <Pencil />
          </IconButton>
          <IconButton color="error" title="Delete" onClick={() => handleDelete(params.row.id)}>
            <Trash />
          </IconButton>
        </>
      ),
    },
  ];

  // *@ Component Modals
  const modals = (
    <>
      {showAddModal && <AddAnnotations images={images} showModal={showAddModal} setShowModal={setShowAddModal} />}
      {showEditModal && (
        <EditAnnotations
          annotationId={rowId}
          images={images}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
        />
      )}
      {showDeleteModal && (
        <AppDialog
          title="Delete Annotation"
          description="Are you sure you want to delete this annotation ?"
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await mutation.mutateAsync(String(rowId));
          }}
          maxWidth="sm"
          isLoading={mutation.isPending}
        />
      )}
    </>
  );

  return { annotations, isFetching, columns, modals, handleAdd };
}
