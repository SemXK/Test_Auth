import { createContext, FC, useContext, useState } from 'react';
import { authService } from '../services';

interface AuthContext {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  token: string | undefined;
}

export const authContext = createContext<AuthContext>({
  login: async () => {
    return false;
  },
  logout: () => {},
  token: undefined,
});

export const AuthProvider: FC = ({ children }) => {
  const [token, setToken] = useState<string>();
  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    if (res) {
      setToken(authService.token);
    }
    return res;
  };
  const logout = () => setToken(undefined);
  return <authContext.Provider value={{ token, login, logout }}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};
