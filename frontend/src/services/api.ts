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

// API Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  actualStartAt?: string;
  actualEndAt?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string;
  participants: MeetingParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface MeetingParticipant {
  id: string;
  userId: string;
  meetingId: string;
  role: 'organizer' | 'presenter' | 'participant';
  joinedAt?: string;
  leftAt?: string;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('authToken');
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    return response.data;
  },
};

// Meetings API
export const meetingsApi = {
  list: async (): Promise<Meeting[]> => {
    const response = await apiClient.get<Meeting[]>('/meetings');
    return response.data;
  },

  create: async (meeting: Partial<Meeting>): Promise<Meeting> => {
    const response = await apiClient.post<Meeting>('/meetings', meeting);
    return response.data;
  },

  get: async (id: string): Promise<Meeting> => {
    const response = await apiClient.get<Meeting>(`/meetings/${id}`);
    return response.data;
  },

  update: async (id: string, meeting: Partial<Meeting>): Promise<Meeting> => {
    const response = await apiClient.put<Meeting>(`/meetings/${id}`, meeting);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/meetings/${id}`);
  },

  start: async (id: string): Promise<Meeting> => {
    const response = await apiClient.post<Meeting>(`/meetings/${id}/start`);
    return response.data;
  },

  end: async (id: string): Promise<Meeting> => {
    const response = await apiClient.post<Meeting>(`/meetings/${id}/end`);
    return response.data;
  },

  // Participants
  getParticipants: async (meetingId: string): Promise<MeetingParticipant[]> => {
    const response = await apiClient.get<MeetingParticipant[]>(`/meetings/${meetingId}/participants`);
    return response.data;
  },

  addParticipant: async (meetingId: string, userId: string, role: string): Promise<MeetingParticipant> => {
    const response = await apiClient.post<MeetingParticipant>(`/meetings/${meetingId}/participants`, {
      userId,
      role,
    });
    return response.data;
  },

  removeParticipant: async (meetingId: string, participantId: string): Promise<void> => {
    await apiClient.delete(`/meetings/${meetingId}/participants/${participantId}`);
  },

  joinMeeting: async (meetingId: string, participantId: string): Promise<MeetingParticipant> => {
    const response = await apiClient.post<MeetingParticipant>(`/meetings/${meetingId}/participants/${participantId}/join`);
    return response.data;
  },

  leaveMeeting: async (meetingId: string, participantId: string): Promise<MeetingParticipant> => {
    const response = await apiClient.post<MeetingParticipant>(`/meetings/${meetingId}/participants/${participantId}/leave`);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  },

  updateProfile: async (profile: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/users/profile', profile);
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.get<{ status: string; message: string }>('/health');
    return response.data;
  },
};

export default apiClient;