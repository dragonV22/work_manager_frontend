import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import AuthProvider from './provider/AuthProvider';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Modal from 'react-modal';
import RequireAdminAuth from './components/RequireAdminAuth';

//admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminHome from './pages/admin/AdminHome';

Modal.setAppElement('#root');

function App() {
  const AdminRoutes = () => (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route 
          element={<RequireAdminAuth />}
        >
        <Route path='/' element={<AdminHome />} />
        {/* ADD ADMIN ROUTERS */}
      </Route>
    </Routes>
  );
  

  return (
    <AuthProvider>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route 
          element={<RequireAuth />}
        >
          <Route path='/' element={<Home />} />
        </Route>
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
