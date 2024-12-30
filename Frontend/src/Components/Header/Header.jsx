import React, { useState,useContext } from 'react';
import Box from '@mui/material/Box';
import { AppBar, Toolbar, Typography, Button, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { AuthContext } from '../../App';


function Header() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false); // State to handle the modal open/close
    // Checking if the user is authenticated and getting the first name from localStorage
    const firstName = localStorage.getItem('firstName') || ''; // Fetch first name from localStorage
    const { setIsAuthenticated } = useContext(AuthContext);
    const { isAuthenticated } = useContext(AuthContext);
    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('userToken'); // Remove the token
        localStorage.removeItem('firstName'); // Remove the user name
        setIsAuthenticated(false); // Update auth state
        navigate('/Login'); // Redirect to login page
      };

    // Modal open handler
    const handleOpenModal = () => setOpen(true);

    // Modal close handler
    const handleCloseModal = () => setOpen(false);

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#6e7565', height: "80px" }}>
                <Toolbar>
                    {/* Logo */}
                    <img
                        src="https://cdn-icons-png.flaticon.com/256/6782/6782237.png"
                        alt="Logo"
                        height="130px"
                        style={{
                            marginRight: '20px',
                            filter: 'sepia(50%) brightness(1.2) hue-rotate(40deg)',
                        }}
                    />

                    {/* Navigation Links */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: "200px",
                            fontSize: "20px",
                            justifyContent: "space-between",
                            width: "100%"
                        }}
                    >
                        <NavLink
                            to="/"
                            className={({ isActive }) => (isActive ? ' active' : 'navlink')}
                        >
                            TodoApp
                        </NavLink>
                        <NavLink
                            to="/CounterApp"
                            className={({ isActive }) => (isActive ? ' active' : 'navlink')}
                        >
                            CounterApp
                        </NavLink>
                        <NavLink
                            to="/UserDataTable"
                            className={({ isActive }) => (isActive ? ' active' : 'navlink')}
                        >
                            UserTable
                        </NavLink>
                        {isAuthenticated && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {/* Avatar with Modal trigger */}
                                <Avatar
                                    sx={{ bgcolor: '#5e090e', fontWeight: 'bold', cursor: 'pointer' }}
                                    onClick={handleOpenModal}
                                >
                                    {firstName.charAt(0).toUpperCase()}
                                </Avatar>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Logout Confirmation Modal */}
            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleLogout();
                            handleCloseModal();
                        }}
                        color="error"
                        variant="contained"
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Header;
