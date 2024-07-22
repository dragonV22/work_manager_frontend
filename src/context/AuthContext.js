import { createContext, useContext } from 'react';

const AuthContext = createContext(null);
const useAuth = () => {
  return useContext(AuthContext);
}

export { useAuth };
export default AuthContext;

