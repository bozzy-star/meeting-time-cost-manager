// API Types and Interfaces

export interface ApiResponse<T = any> {
  message: string;
  status: 'success' | 'error';
  data?: T;
  error?: ApiError;
  count?: number;
}

export interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: any;
}

export interface CreateMeetingRequest {
  title: string;
  description?: string;
  meetingType?: string;
  category?: string;
  location?: string;
  roomId?: string;
  isOnline?: boolean;
  meetingUrl?: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  agenda?: string[];
  objectives?: string[];
  expectedOutcomes?: string;
  expectedRevenue?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string;
  participants?: ParticipantRequest[];
}

export interface ParticipantRequest {
  userId: string;
  role?: string;
  isRequired?: boolean;
  hourlyRateOverride?: number;
  notes?: string;
}

export interface UpdateMeetingRequest {
  title?: string;
  description?: string;
  meetingType?: string;
  category?: string;
  location?: string;
  roomId?: string;
  isOnline?: boolean;
  meetingUrl?: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  agenda?: string[];
  objectives?: string[];
  expectedOutcomes?: string;
  expectedRevenue?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string;
  status?: string;
}

export interface MeetingResponse {
  id: string;
  title: string;
  description?: string;
  meetingType: string;
  category?: string;
  location?: string;
  isOnline: boolean;
  meetingUrl?: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  actualStartAt?: string;
  actualEndAt?: string;
  status: string;
  priority: string;
  tags: string;
  organizer: UserSummary;
  participants: ParticipantResponse[];
  room?: RoomSummary;
  cost?: CostSummary;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantResponse {
  id: string;
  role: string;
  invitationStatus: string;
  attendanceStatus: string;
  joinedAt?: string;
  leftAt?: string;
  isRequired: boolean;
  hourlyRateOverride?: number;
  notes?: string;
  user: UserSummary;
}

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
}

export interface RoomSummary {
  id: string;
  name: string;
  location?: string;
  capacity?: number;
  hourlyCost?: number;
}

export interface CostSummary {
  totalCost: number;
  directCost: number;
  indirectCost: number;
  participantCount: number;
  actualDurationMinutes?: number;
  scheduledDurationMinutes?: number;
  averageHourlyRate?: number;
  costPerMinute?: number;
  efficiencyScore?: number;
  roiPercentage?: number;
}