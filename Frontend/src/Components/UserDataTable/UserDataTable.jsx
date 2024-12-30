import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const UserDataTable = () => {
  // Sample user data
  const initialRows = [
    { id: 1, firstName: 'John', lastName: 'Doe', age: 25, salary: 50000, email: 'john.doe@example.com', department: 'IT', mobile: '1234567890', address: '123 Main St' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', age: 30, salary: 60000, email: 'jane.smith@example.com', department: 'HR', mobile: '2345678901', address: '456 Elm St' },
    { id: 3, firstName: 'Sam', lastName: 'Johnson', age: 22, salary: 45000, email: 'sam.johnson@example.com', department: 'Finance', mobile: '3456789012', address: '789 Pine St' },
  ];

  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Open Edit Dialog
  const handleEditClick = (row) => {
    setSelectedRow({ ...row });
    setOpen(true);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRow({ ...selectedRow, [name]: value });
  };

  // Save Edited Row
  const handleSave = () => {
    setRows(rows.map(row => (row.id === selectedRow.id ? selectedRow : row)));
    setOpen(false);
    setSelectedRow(null);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  // Define Table Columns
  const columns = [
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'age', headerName: 'Age', type: 'number', width: 100 },
    { field: 'salary', headerName: 'Salary ($)', type: 'number', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'mobile', headerName: 'Mobile No', width: 150 },
    { field: 'address', headerName: 'Address', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" size="small" onClick={() => handleEditClick(params.row)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%', marginTop: 4 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />

      {/* Edit Dialog */}
      {selectedRow && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="name"
              name="name"
              value={selectedRow.firstName}
              onChange={handleInputChange}
              fullWidth
            />
          
            <TextField
              margin="dense"
              label="Salary"
              name="salary"
              value={selectedRow.salary}
              onChange={handleInputChange}
              type="number"
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={selectedRow.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Department"
              name="department"
              value={selectedRow.department}
              onChange={handleInputChange}
              fullWidth
            />
          
            <TextField
              margin="dense"
              label="Address"
              name="address"
              value={selectedRow.address}
              onChange={handleInputChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default UserDataTable;
