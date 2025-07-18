import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, usersApi, meetingsApi, healthApi, User, Meeting } from '../services/api';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface ApiContextType {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Data state
  meetings: Meeting[];
  
  // Data methods
  refreshMeetings: () => Promise<void>;
  createMeeting: (meeting: Partial<Meeting>) => Promise<Meeting>;
  updateMeeting: (id: string, meeting: Partial<Meeting>) => Promise<Meeting>;
  deleteMeeting: (id: string) => Promise<void>;
  
  // Health check
  checkHealth: () => Promise<boolean>;
  
  // API client
  apiClient: typeof apiClient;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await authApi.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load meetings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshMeetings();
    }
  }, [isAuthenticated]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login({ email, password });
      
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.register({ email, password, name });
      
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setMeetings([]);
    }
  };

  const refreshMeetings = async () => {
    try {
      const meetingsData = await meetingsApi.list();
      setMeetings(meetingsData);
    } catch (error) {
      console.error('Failed to refresh meetings:', error);
    }
  };

  const createMeeting = async (meeting: Partial<Meeting>) => {
    try {
      const newMeeting = await meetingsApi.create(meeting);
      setMeetings(prev => [...prev, newMeeting]);
      return newMeeting;
    } catch (error) {
      console.error('Failed to create meeting:', error);
      throw error;
    }
  };

  const updateMeeting = async (id: string, meeting: Partial<Meeting>) => {
    try {
      const updatedMeeting = await meetingsApi.update(id, meeting);
      setMeetings(prev => prev.map(m => m.id === id ? updatedMeeting : m));
      return updatedMeeting;
    } catch (error) {
      console.error('Failed to update meeting:', error);
      throw error;
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      await meetingsApi.delete(id);
      setMeetings(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      throw error;
    }
  };

  const checkHealth = async () => {
    try {
      const response = await healthApi.check();
      return response.status === 'OK';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  };

  const value: ApiContextType = {
    // Auth state
    user,
    isAuthenticated,
    isLoading,
    
    // Auth methods
    login,
    register,
    logout,
    
    // Data state
    meetings,
    
    // Data methods
    refreshMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    
    // Health check
    checkHealth,
    
    // API client
    apiClient,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export default ApiProvider;