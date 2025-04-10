'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import { DataGrid, GridColDef, GridPaginationModel, GridRowsProp, GridToolbar } from '@mui/x-data-grid';

interface AppDataGridProps<T> {
  columns: GridColDef[];
  rows: T[];
  pageSize?: number;
  isLoading?: boolean;
}

export function AppDataGrid<T>({
  columns,
  rows,
  pageSize = 5,
  isLoading = false,
}: AppDataGridProps<T>): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [filteredRows, setFilteredRows] = React.useState<T[]>(rows);

  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize,
  });

  React.useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  // Use useCallback to memoize the search handler function
  const handleSearch = React.useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (query === '') {
        setFilteredRows(rows);
      } else {
        setFilteredRows(
          rows.filter((row) =>
            columns.some((column) => {
              const fieldValue = (row as any)[column.field];
              return fieldValue && fieldValue.toString().toLowerCase().includes(query.toLowerCase());
            })
          )
        );
      }
    },
    [columns, rows]
  );

  // Use useCallback to memoize the pagination handler function
  const handlePaginationChange = React.useCallback((model: GridPaginationModel) => {
    setPaginationModel(model);
  }, []);

  return (
    <Card sx={{ p: 2, boxShadow: 3, width: '100%', overflowX: 'auto' }}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      <DataGrid
        rows={filteredRows as GridRowsProp}
        columns={columns}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        loading={isLoading}
        slots={{
          toolbar: GridToolbar,
        }}
        sx={{
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f0f0f0',
            color: '#333',
            fontWeight: 'bold',
            fontSize: '14px',
            textAlign: 'center',
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            textAlign: 'center',
            verticalAlign: 'middle',
            padding: '8px 12px', // Add padding for a more spacious feel
          },
          '& .MuiDataGrid-row': {
            backgroundColor: '#ffffff',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#f9f9f9',
            borderTop: '1px solid #ccc',
          },
        }}
      />
    </Card>
  );
}
