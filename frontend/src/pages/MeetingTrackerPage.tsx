import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Alert,
  Paper,
  Avatar,
  AvatarGroup,
  Divider,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Container,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Pause,
  AttachMoney,
  AccessTime,
  People,
  Add,
  Edit,
  Delete,
  PersonAdd,
  PersonRemove,
  Warning,
  CheckCircle,
  Schedule,
  Timer,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useApi } from '../contexts/ApiContext';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  roomId?: string;
  organizerId: string;
  participants: Array<{
    id: string;
    name: string;
    email: string;
    role?: string;
    hourlyRate?: number;
  }>;
  estimatedCost?: number;
  actualCost?: number;
  estimatedDuration?: number;
  actualDuration?: number;
}

interface CostBreakdown {
  totalCost: number;
  hourlyRate: number;
  participantCosts: Array<{
    participant: string;
    cost: number;
    hourlyRate: number;
  }>;
}

export default function MeetingTrackerPage() {
  const { id } = useParams<{ id: string }>();
  const { apiClient } = useApi();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentCost, setCurrentCost] = useState(0);
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      loadMeetingData();
      loadAvailableUsers();
    }
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (meeting?.status === 'in_progress') {
      interval = setInterval(() => {
        updateElapsedTime();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [meeting]);

  const loadMeetingData = async () => {
    try {
      setLoading(true);
      
      // ダミーデータを用意
      const dummyMeetings = {
        '1': {
          id: '1',
          title: '週次技術レビュー',
          description: '技術チームの週次進捗確認とレビュー。プロジェクトの進捗状況を共有し、技術的な課題を議論します。',
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 65 * 60 * 1000).toISOString(),
          status: 'completed' as const,
          roomId: 'room-1',
          organizerId: '2',
          participants: [
            { id: '2', name: '佐藤花子', email: 'tech-manager@demo.com', role: '技術部長', hourlyRate: 8000 },
            { id: '3', name: '田中次郎', email: 'senior-dev@demo.com', role: 'シニアエンジニア', hourlyRate: 5000 }
          ],
          estimatedCost: 26000,
          actualCost: 26000,
          estimatedDuration: 60,
          actualDuration: 65
        },
        '2': {
          id: '2',
          title: '月次営業会議',
          description: '月次売上実績と来月の営業戦略検討。顧客案件の進捗確認と新規開拓の方針を決定します。',
          startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: undefined,
          status: 'scheduled' as const,
          roomId: 'room-2',
          organizerId: '4',
          participants: [
            { id: '4', name: '鈴木三郎', email: 'sales-manager@demo.com', role: '営業部長', hourlyRate: 7000 },
            { id: '1', name: '山田太郎', email: 'ceo@demo.com', role: 'CEO', hourlyRate: 15000 }
          ],
          estimatedCost: 35000,
          actualCost: undefined,
          estimatedDuration: 90,
          actualDuration: undefined
        },
        '3': {
          id: '3',
          title: '四半期経営会議',
          description: '四半期業績レビューと次期戦略決定。各部門の成果報告と来期の計画策定を行います。',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: undefined,
          status: 'scheduled' as const,
          roomId: 'room-1',
          organizerId: '1',
          participants: [
            { id: '1', name: '山田太郎', email: 'ceo@demo.com', role: 'CEO', hourlyRate: 15000 },
            { id: '2', name: '佐藤花子', email: 'tech-manager@demo.com', role: '技術部長', hourlyRate: 8000 },
            { id: '4', name: '鈴木三郎', email: 'sales-manager@demo.com', role: '営業部長', hourlyRate: 7000 },
            { id: '5', name: '高橋美香', email: 'hr-manager@demo.com', role: '人事部課長', hourlyRate: 6000 }
          ],
          estimatedCost: 85000,
          actualCost: undefined,
          estimatedDuration: 180,
          actualDuration: undefined
        },
        '4': {
          id: '4',
          title: 'プロジェクト進捗確認',
          description: '現在進行中のプロジェクトの進捗状況を確認し、課題の解決策を検討します。',
          startTime: new Date().toISOString(),
          endTime: undefined,
          status: 'in_progress' as const,
          roomId: 'room-3',
          organizerId: '3',
          participants: [
            { id: '3', name: '田中次郎', email: 'senior-dev@demo.com', role: 'シニアエンジニア', hourlyRate: 5000 },
            { id: '5', name: '高橋美香', email: 'hr-manager@demo.com', role: '人事部課長', hourlyRate: 6000 }
          ],
          estimatedCost: 18000,
          actualCost: undefined,
          estimatedDuration: 45,
          actualDuration: undefined
        }
      };

      const dummyCostBreakdown = {
        '1': {
          totalCost: 26000,
          hourlyRate: 6500,
          participantCosts: [
            { participant: '佐藤花子', cost: 8667, hourlyRate: 8000 },
            { participant: '田中次郎', cost: 5417, hourlyRate: 5000 }
          ]
        },
        '2': {
          totalCost: 35000,
          hourlyRate: 11000,
          participantCosts: [
            { participant: '鈴木三郎', cost: 10500, hourlyRate: 7000 },
            { participant: '山田太郎', cost: 22500, hourlyRate: 15000 }
          ]
        },
        '3': {
          totalCost: 85000,
          hourlyRate: 12000,
          participantCosts: [
            { participant: '山田太郎', cost: 45000, hourlyRate: 15000 },
            { participant: '佐藤花子', cost: 24000, hourlyRate: 8000 },
            { participant: '鈴木三郎', cost: 21000, hourlyRate: 7000 },
            { participant: '高橋美香', cost: 18000, hourlyRate: 6000 }
          ]
        },
        '4': {
          totalCost: 18000,
          hourlyRate: 5500,
          participantCosts: [
            { participant: '田中次郎', cost: 3750, hourlyRate: 5000 },
            { participant: '高橋美香', cost: 4500, hourlyRate: 6000 }
          ]
        }
      };

      // ダミーデータから該当する会議を取得
      const meetingData = dummyMeetings[id as keyof typeof dummyMeetings];
      const costData = dummyCostBreakdown[id as keyof typeof dummyCostBreakdown];

      if (meetingData) {
        setMeeting(meetingData);
        setCostBreakdown(costData);
        setError(null);
      } else {
        // APIからデータを取得を試行
        try {
          const response = await apiClient.get(`/meetings/${id}`);
          setMeeting(response.data);
          
          const costResponse = await apiClient.get(`/meetings/${id}/cost`);
          setCostBreakdown(costResponse.data);
          
          setError(null);
        } catch (apiError) {
          setError('会議が見つかりません。');
        }
      }
    } catch (err: any) {
      console.error('会議データの読み込みに失敗しました:', err);
      setError('会議データの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      // ダミーユーザーデータ
      const dummyUsers = [
        { id: '1', name: '山田太郎', email: 'ceo@demo.com', role: 'CEO', department: '経営企画部' },
        { id: '2', name: '佐藤花子', email: 'tech-manager@demo.com', role: '技術部長', department: '技術部' },
        { id: '3', name: '田中次郎', email: 'senior-dev@demo.com', role: 'シニアエンジニア', department: '技術部' },
        { id: '4', name: '鈴木三郎', email: 'sales-manager@demo.com', role: '営業部長', department: '営業部' },
        { id: '5', name: '高橋美香', email: 'hr-manager@demo.com', role: '人事部課長', department: '人事部' }
      ];

      try {
        const response = await apiClient.get('/users');
        setAvailableUsers(response.data.length > 0 ? response.data : dummyUsers);
      } catch (apiError) {
        console.log('API未接続のためダミーユーザーデータを使用します');
        setAvailableUsers(dummyUsers);
      }
    } catch (err: any) {
      console.error('ユーザーデータの読み込みに失敗しました:', err);
    }
  };

  const updateElapsedTime = () => {
    if (meeting?.startTime && meeting?.status === 'in_progress') {
      const startTime = new Date(meeting.startTime);
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
      
      // リアルタイムコスト計算
      if (costBreakdown) {
        const elapsedHours = elapsed / 3600;
        const cost = costBreakdown.hourlyRate * elapsedHours;
        setCurrentCost(cost);
      }
    }
  };

  const handleStartMeeting = async () => {
    try {
      await apiClient.post(`/meetings/${id}/start`);
      await loadMeetingData();
    } catch (err: any) {
      console.error('会議の開始に失敗しました:', err);
      setError('会議の開始に失敗しました。');
    }
  };

  const handleStopMeeting = async () => {
    try {
      await apiClient.post(`/meetings/${id}/stop`);
      await loadMeetingData();
    } catch (err: any) {
      console.error('会議の終了に失敗しました:', err);
      setError('会議の終了に失敗しました。');
    }
  };

  const handleAddParticipant = async () => {
    try {
      await apiClient.post(`/meetings/${id}/participants`, {
        userId: selectedParticipant,
      });
      setParticipantDialogOpen(false);
      setSelectedParticipant('');
      await loadMeetingData();
    } catch (err: any) {
      console.error('参加者の追加に失敗しました:', err);
      setError('参加者の追加に失敗しました。');
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      await apiClient.delete(`/meetings/${id}/participants/${participantId}`);
      await loadMeetingData();
    } catch (err: any) {
      console.error('参加者の削除に失敗しました:', err);
      setError('参加者の削除に失敗しました。');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'in_progress':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '予定';
      case 'in_progress':
        return '進行中';
      case 'completed':
        return '完了';
      case 'cancelled':
        return 'キャンセル';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>読み込み中...</Typography>
      </Box>
    );
  }

  if (!meeting) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Alert severity="error">会議が見つかりません。</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PlayArrow color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {meeting.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              会議ID: {meeting.id}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            label={getStatusText(meeting.status)}
            color={getStatusColor(meeting.status)}
            size="medium"
          />
          {meeting.status === 'scheduled' && (
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handleStartMeeting}
              color="success"
            >
              会議開始
            </Button>
          )}
          {meeting.status === 'in_progress' && (
            <Button
              variant="contained"
              startIcon={<Stop />}
              onClick={handleStopMeeting}
              color="error"
            >
              会議終了
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* 会議情報とリアルタイム統計 */}
        <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
          <Card sx={{ flex: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                会議情報
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    説明
                  </Typography>
                  <Typography variant="body1">
                    {meeting.description || '説明なし'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    開始時間
                  </Typography>
                  <Typography variant="body1">
                    {new Date(meeting.startTime).toLocaleString('ja-JP')}
                  </Typography>
                </Box>
                {meeting.endTime && (
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      終了時間
                    </Typography>
                    <Typography variant="body1">
                      {new Date(meeting.endTime).toLocaleString('ja-JP')}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                リアルタイム統計
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatTime(elapsedTime)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    経過時間
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {formatCurrency(currentCost)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    現在のコスト
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {meeting.participants.length}名
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    参加者数
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* 参加者管理とコスト詳細 */}
        <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  参加者管理
                </Typography>
                <Button
                  startIcon={<PersonAdd />}
                  onClick={() => setParticipantDialogOpen(true)}
                  disabled={meeting.status !== 'in_progress'}
                >
                  参加者追加
                </Button>
              </Box>
              <List>
                {meeting.participants.map((participant) => (
                  <ListItem key={participant.id}>
                    <ListItemAvatar>
                      <Avatar>{participant.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={participant.name}
                      secondary={participant.email}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleRemoveParticipant(participant.id)}
                        disabled={meeting.status !== 'in_progress'}
                      >
                        <PersonRemove />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                コスト詳細
              </Typography>
              {costBreakdown && (
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">予想コスト</Typography>
                    <Typography variant="body1">
                      {formatCurrency(meeting.estimatedCost || 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">現在のコスト</Typography>
                    <Typography variant="body1" color="success.main">
                      {formatCurrency(currentCost)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">時間当たりコスト</Typography>
                    <Typography variant="body1">
                      {formatCurrency(costBreakdown.hourlyRate)}/時間
                    </Typography>
                  </Box>
                  <Divider />
                  <Typography variant="subtitle2">参加者別コスト</Typography>
                  {costBreakdown.participantCosts.map((cost, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{cost.participant}</Typography>
                      <Typography variant="body2">
                        {formatCurrency(cost.cost)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Stack>

      {/* 参加者追加ダイアログ */}
      <Dialog open={participantDialogOpen} onClose={() => setParticipantDialogOpen(false)}>
        <DialogTitle>参加者を追加</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="ユーザーを選択"
            value={selectedParticipant}
            onChange={(e) => setSelectedParticipant(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">選択してください</option>
            {availableUsers
              .filter(user => !meeting.participants.some(p => p.id === user.id))
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setParticipantDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleAddParticipant} variant="contained">
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}