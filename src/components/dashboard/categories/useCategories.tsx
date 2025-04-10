'use client';

import { useCallback, useState } from 'react';
import { useDelete, useGetAll } from '@/services/apiHooks';
import { API_URL } from '@/services/apiUrl';
import { Avatar, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { Pencil, Trash } from '@phosphor-icons/react';

import { ICategoryDto } from '@/types/categories';
import { AppDialog } from '@/components/sharedComponents/AppDialog';

import { AddCategory } from './AddCategory';
import { EditCategory } from './EditCategory';

export function useCategories() {
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
  const { data: categories = [], isFetching } = useGetAll<ICategoryDto>({
    url: API_URL.categories,
  });
  // *** Delete category
  const mutation = useDelete({
    url: API_URL.categories,
  });

  // *@ Component States
  const columns: GridColDef<ICategoryDto>[] = [
    {
      field: 'image',
      headerName: 'Image',
      flex: 1,
      sortable: false,
      filterable: false,
      maxWidth: 80,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={params.row.image} />
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
      field: 'description',
      headerName: 'Description',
      flex: 1,
      type: 'string',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2">{params.row.description}</Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 300,
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
      {showAddModal && <AddCategory showModal={showAddModal} setShowModal={setShowAddModal} />}
      {showEditModal && <EditCategory categoryId={rowId} showModal={showEditModal} setShowModal={setShowEditModal} />}
      {showDeleteModal && (
        <AppDialog
          title="Delete Category"
          description="Are you sure you want to delete this Category ?"
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

  return { categories, isFetching, columns, modals, handleAdd };
}
