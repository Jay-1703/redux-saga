import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from './login/login';
import Dashboard from './dashboard/Dashboard';
import Groups from './dashboard/Groups';
import NotFound from './components/not-found/Notfound';

const router = createBrowserRouter([
  {
    path: '/*',
    element: <NotFound/>,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace={true} />,
  },
  {
    path: '/login',
    element: <Login/>,
  },
  {
    path: '/dashboard',
    element: <Dashboard/>,
    children: [      
      {
        path: 'groups',
        element: <Groups />,
      },
      {
        path: 'groups/:id',
        element: <Groups />,
      },    
    ],
  }
])

function App() {
  return (
    <div className='h-screen w-full'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
