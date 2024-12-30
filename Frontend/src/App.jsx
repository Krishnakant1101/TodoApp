import React, { createContext, useState, useEffect } from 'react';
import Header from "./Components/Header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from './Components/Footer/Footer';

// Create AuthContext
export const AuthContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsAuthenticated(!!token); // Set isAuthenticated based on the token's existence
  }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated}}>
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    </AuthContext.Provider>
  );
}

export default App;
