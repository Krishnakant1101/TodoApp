import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App, { AuthContext } from './App.jsx';
import { Store } from './Components/Store/Store.jsx';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CounterApp from './Components/CounterApp/CounterApp.jsx';
import TodoApp from './Components/TodoApp/TodoApp.jsx';
import UserDataTable from './Components/UserDataTable/UserDataTable.jsx';
import LoginPage from './Components/LoginPage/LoginPage.jsx';
import SignupPage from './Components/SignupPage/SignupPage.jsx';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.jsx';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
        <TodoApp />
        </ProtectedRoute>),
      },
      {
        path: '/CounterApp',
        element: 
        (
        <ProtectedRoute>
        <CounterApp />
        </ProtectedRoute>),
      },
      {
        path: '/UserDataTable',
        element: (
          <ProtectedRoute>
            <UserDataTable />
          </ProtectedRoute>
        ),
      },
      {
        path: '/Login',
        element: <LoginPage />,
      },
      {
        path: '/CreateNewUser',
        element: <SignupPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <AuthContext.Provider value={{}}>
        <RouterProvider router={Router} />
      </AuthContext.Provider>
    </Provider>
  </StrictMode>
);
