import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  company_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, name: string, company_name?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('atlas_token');
      const storedUser = localStorage.getItem('atlas_user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Login failed' };

      setUser(data.user);
      localStorage.setItem('atlas_token', data.token);
      localStorage.setItem('atlas_user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const signup = async (email: string, password: string, name: string, company_name?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company_name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Signup failed' };

      setUser(data.user);
      localStorage.setItem('atlas_token', data.token);
      localStorage.setItem('atlas_user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('atlas_token');
    localStorage.removeItem('atlas_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
