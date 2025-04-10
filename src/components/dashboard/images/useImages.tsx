'use client';

import { useCallback, useState } from 'react';
import { useDelete, useGetAll } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { Avatar, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { Pencil, Trash } from '@phosphor-icons/react/dist/ssr';

import { ICategoryDto } from '@/types/categories';
import { IImageDto } from '@/types/images';
import { AppDialog } from '@/components/sharedComponents/AppDialog';

import { AddImage } from './AddImage';
import { EditImage } from './EditImage';

export function useImages() {
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
  // * Get the images
  const { data: images = [], isFetching } = useGetAll<IImageDto>({
    url: API_URL.images,
  });

  // ** Get the categories for showing the category of the image
  const { data: categories = [] } = useGetAll<ICategoryDto>({
    url: API_URL.images,
  });

  // *** Delete Image
  const mutation = useDelete({
    url: API_URL.images,
  });

  // *@ Component Columns
  const columns: GridColDef<IImageDto>[] = [
    {
      field: 'image',
      headerName: 'Image',
      flex: 1,
      sortable: false,
      filterable: false,
      maxWidth: 80,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={params.row.url} />
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      type: 'string',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2">{params.row.name}</Typography>
        </Box>
      ),
    },
    {
      field: 'uploadDate',
      headerName: 'Upload Date',
      flex: 1,
      type: 'string',
      minWidth: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2">{new Date(params.row.uploadDate).toLocaleString()}</Typography>
        </Box>
      ),
    },
    {
      field: 'size',
      headerName: 'Size',
      flex: 1,
      type: 'string',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2">{params.row.metadata.size}</Typography>
        </Box>
      ),
    },
    {
      field: 'resolution',
      headerName: 'Resolution',
      flex: 1,
      type: 'string',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2">{params.row.metadata.resolution}</Typography>
        </Box>
      ),
    },
    {
      field: 'categoryId',
      headerName: 'Category',
      flex: 1,
      type: 'singleSelect',
      valueOptions: categories?.map((category: ICategoryDto) => ({
        value: category.id,
        label: category.name,
      })),
      renderCell: (params) => {
        const category = categories?.find((c: ICategoryDto) => c.id === params.row.categoryId);

        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle2">{category?.name}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 200,
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
      {showAddModal && <AddImage categories={categories} showModal={showAddModal} setShowModal={setShowAddModal} />}
      {showEditModal && (
        <EditImage imageId={rowId} categories={categories} showModal={showEditModal} setShowModal={setShowEditModal} />
      )}
      {showDeleteModal && (
        <AppDialog
          title="Delete Image"
          description="Are you sure you want to delete this image ?"
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

  return { images, isFetching, columns, modals, handleAdd };
}
