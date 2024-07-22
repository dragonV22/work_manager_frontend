import { useAuth } from "../context/AuthContext";
import { useLocation, Navigate, useNavigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!auth.user.email) {
    auth
      .checkToken()
      .then(res => {
        if(res) {
          return <Outlet />;
        } else {
          navigate('/login', { state: { from: location } });
          return <Navigate to="/login" state={{ from: location }} />;
        }
      });
  } else {
    return <Outlet />;
  }
}