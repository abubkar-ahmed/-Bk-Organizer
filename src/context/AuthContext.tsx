import { createContext, useState, ReactNode } from 'react';
import axios from '../api/axios';

type User = {
  id: string;
  userName: string;
  email: string;
  accessToken:string
};

type AuthContextType = {
  isLoggedIn: boolean;
  loadingRefresh:boolean;
  loadingAuth : boolean ;
  user: User;
  login: (email: string, pwd: string) => Promise<{ status: boolean; message: string }>;
  register: (email: string, userName: string, pwd: string, rPwd: string) => Promise<{ status: boolean; message: string }>;
  logout: () => Promise<boolean>;
  refreshToken: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loadingRefresh , setLoadingRefresh] = useState<boolean>(false);
  const [loadingAuth , setLoadingAuth] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ 
    userName: '', 
    email: '' ,
    id : '',
    accessToken : ''
  });

  const login = async (email: string, pwd: string) => {
    setLoadingAuth(true)
    try {
      const response = await axios.post('/auth/login', { email, pwd });
      setUser(response.data);
      setIsLoggedIn(true);
      setLoadingAuth(false);
      return { status: true , message : `Welcome Back ${response.data.userName}`};
    } catch (err : any) {
      setLoadingAuth(false)
      return {
        status: false,
        message: err?.response?.data?.message,
      };
    }
  };

  const register = async (email: string, userName: string, pwd: string, rPwd: string) => {
    setLoadingAuth(true)
    try {
      const response = await axios.post('/auth/register', {
        email,
        userName,
        pwd,
        rPwd
      })
      setLoadingAuth(false)
      return {
        status: true,
        message: response.data.success
      }
    } catch (err: any) {
      setLoadingAuth(false)
      if(err.response.data.message){
        return {
          status: false,
          message: err.response.data.message 
        }
      }
      return {
        status: false,
        message: 'Something Went Wrong Please Try Again Later.'
      }
    }
  }

  const logout = async () => {
    setLoadingAuth(true)
    try {
      const response = await axios.get('/auth/logout');
      setUser({
        userName: '', 
        email: '' ,
        id : '',
        accessToken : ''
      });
      setIsLoggedIn(false);
      setLoadingAuth(false)
      return true;
    } catch (err) {
      setLoadingAuth(false)
      console.log(err);
      return false;
    }
  };

  const refreshToken = async () => {
    setLoadingRefresh(true);
    try {
      const response = await axios.get('/auth/refresh');
      setUser(response.data);
      setIsLoggedIn(true);
      setLoadingRefresh(false);
    } catch (err) {
      setLoadingRefresh(false);
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn,
      loadingRefresh,
      loadingAuth,
      user, 
      login, 
      register, 
      logout, 
      refreshToken 
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

