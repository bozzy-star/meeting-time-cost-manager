// 会議時間コスト管理システム - 型定義

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  hourlyRate: number;
  avatar?: string;
}

export interface Role {
  id: string;
  name: string;
  level: number; // 1:CEO, 2:役員, 3:部長, 4:課長, 5:主任, 6:一般
  defaultHourlyRate: number;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  organizer: User;
  participants: MeetingParticipant[];
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  actualStartAt?: Date;
  actualEndAt?: Date;
  status: MeetingStatus;
  category: string;
  location?: string;
  isOnline: boolean;
  meetingUrl?: string;
  agenda?: string;
  expectedRevenue?: number;
  priority: Priority;
  tags: string[];
}

export interface MeetingParticipant {
  id: string;
  user: User;
  role: ParticipantRole;
  invitationStatus: InvitationStatus;
  attendanceStatus: AttendanceStatus;
  joinedAt?: Date;
  leftAt?: Date;
  hourlyRateOverride?: number;
  isRequired: boolean;
}

export interface MeetingCost {
  id: string;
  meetingId: string;
  totalCost: number;
  directCost: number;
  indirectCost: number;
  opportunityCost: number;
  participantCount: number;
  actualDurationMinutes?: number;
  scheduledDurationMinutes: number;
  averageHourlyRate: number;
  costPerMinute: number;
  efficiencyScore?: number;
  roiPercentage?: number;
  costBreakdown: CostBreakdown;
}

export interface CostBreakdown {
  [participantId: string]: {
    hourlyRate: number;
    duration: number;
    cost: number;
  } | number;
}

export interface MeetingTracker {
  id: string;
  meetingId: string;
  startedAt: Date;
  endedAt?: Date;
  currentCost: number;
  currentParticipants: number;
  status: TrackerStatus;
  realTimeData: {
    participantJoins: Array<{
      userId: string;
      joinedAt: Date;
    }>;
    participantLeaves: Array<{
      userId: string;
      leftAt: Date;
    }>;
    costUpdates: Array<{
      timestamp: Date;
      cost: number;
    }>;
  };
}

export interface Dashboard {
  totalMeetings: number;
  totalCost: number;
  averageMeetingCost: number;
  costPerEmployee: number;
  efficiencyScore: number;
  monthlyCosts: Array<{
    month: string;
    cost: number;
  }>;
  topCostlyMeetings: Meeting[];
  departmentCosts: Array<{
    department: string;
    cost: number;
  }>;
}

// Enums
export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ParticipantRole = 'organizer' | 'presenter' | 'participant' | 'observer';
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'tentative';
export type AttendanceStatus = 'unknown' | 'present' | 'absent' | 'late' | 'left_early';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TrackerStatus = 'active' | 'paused' | 'ended';

// フォーム関連の型
export interface CreateMeetingForm {
  title: string;
  description: string;
  category: string;
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  location: string;
  isOnline: boolean;
  meetingUrl?: string;
  participants: string[]; // User IDs
  agenda: string;
  expectedRevenue?: number;
  priority: Priority;
  tags: string[];
}

export interface MeetingFilters {
  status?: MeetingStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  organizer?: string;
  department?: string;
  category?: string;
  priority?: Priority[];
  tags?: string[];
}

// API レスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}