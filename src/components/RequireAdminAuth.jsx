import { useAuth } from "../context/AuthContext";
import { useLocation, Navigate, useNavigate, Outlet } from "react-router-dom";

export default function RequireAdminAuth() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (auth.user && auth.user.isAdmin) {
    return <Outlet />;
  } else {
    auth
      .checkAdminToken()
      .then(res => {
        if(res) {
          return <Outlet />
        } else {
          if(auth.user) {
            navigate('/', { state: { from: location } });
            return <Navigate to="/" state={{ from: location }} />;  
          } else {
            navigate('/admin/login', { state: { from: location } });
            return <Navigate to="/admin/login" state={{ from: location }} />;
          }
        }
      });
  }
}