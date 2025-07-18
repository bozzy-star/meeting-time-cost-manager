import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Event,
  Add,
  Edit,
  Delete,
  PlayArrow,
  Stop,
  Visibility,
  AccessTime,
  AttachMoney,
  People,
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
  }>;
  estimatedCost?: number;
  actualCost?: number;
}

interface CreateMeetingForm {
  title: string;
  description: string;
  startTime: string;
  estimatedDuration: number;
  roomId: string;
  participantIds: string[];
}

export default function MeetingsPage() {
  const { apiClient } = useApi();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  
  const [formData, setFormData] = useState<CreateMeetingForm>({
    title: '',
    description: '',
    startTime: '',
    estimatedDuration: 60,
    roomId: '',
    participantIds: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [meetingsRes, roomsRes, usersRes] = await Promise.all([
        apiClient.get('/meetings'),
        apiClient.get('/rooms'),
        apiClient.get('/users'),
      ]);
      
      setMeetings(meetingsRes.data);
      setRooms(roomsRes.data);
      setUsers(usersRes.data);
      setError(null);
    } catch (err: any) {
      console.error('データの読み込みに失敗しました:', err);
      setError('データの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    try {
      await apiClient.post('/meetings', formData);
      setDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        estimatedDuration: 60,
        roomId: '',
        participantIds: [],
      });
      await loadData();
    } catch (err: any) {
      console.error('会議の作成に失敗しました:', err);
      setError('会議の作成に失敗しました。');
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    if (window.confirm('この会議を削除しますか？')) {
      try {
        await apiClient.delete(`/meetings/${id}`);
        await loadData();
      } catch (err: any) {
        console.error('会議の削除に失敗しました:', err);
        setError('会議の削除に失敗しました。');
      }
    }
  };

  const handleStartMeeting = async (id: string) => {
    try {
      await apiClient.post(`/meetings/${id}/start`);
      await loadData();
    } catch (err: any) {
      console.error('会議の開始に失敗しました:', err);
      setError('会議の開始に失敗しました。');
    }
  };

  const handleStopMeeting = async (id: string) => {
    try {
      await apiClient.post(`/meetings/${id}/stop`);
      await loadData();
    } catch (err: any) {
      console.error('会議の終了に失敗しました:', err);
      setError('会議の終了に失敗しました。');
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>読み込み中...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Event color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            会議管理
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          新規会議
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>会議名</TableCell>
                  <TableCell>開始時間</TableCell>
                  <TableCell>ステータス</TableCell>
                  <TableCell>参加者</TableCell>
                  <TableCell>予想コスト</TableCell>
                  <TableCell>実際のコスト</TableCell>
                  <TableCell>アクション</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {meeting.title}
                      </Typography>
                      {meeting.description && (
                        <Typography variant="body2" color="textSecondary">
                          {meeting.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTime sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {formatDateTime(meeting.startTime)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(meeting.status)}
                        color={getStatusColor(meeting.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <People sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {meeting.participants.length}名
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {meeting.estimatedCost && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AttachMoney sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {formatCurrency(meeting.estimatedCost)}
                          </Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell>
                      {meeting.actualCost && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AttachMoney sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {formatCurrency(meeting.actualCost)}
                          </Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {meeting.status === 'scheduled' && (
                          <Tooltip title="会議を開始">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleStartMeeting(meeting.id)}
                            >
                              <PlayArrow />
                            </IconButton>
                          </Tooltip>
                        )}
                        {meeting.status === 'in_progress' && (
                          <Tooltip title="会議を終了">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleStopMeeting(meeting.id)}
                            >
                              <Stop />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="詳細を表示">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setSelectedMeeting(meeting)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="編集">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setSelectedMeeting(meeting);
                              setDialogOpen(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="削除">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteMeeting(meeting.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {meetings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}>
                      <Event sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="textSecondary">
                        会議がありません
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        新規会議ボタンから最初の会議を作成してください。
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 会議作成・編集ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMeeting ? '会議を編集' : '新規会議'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="会議名"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="説明"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="開始時間"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="予想時間（分）"
              type="number"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: Number(e.target.value) })}
              fullWidth
              required
            />
            <TextField
              label="会議室"
              select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              fullWidth
            >
              <MenuItem value="">選択してください</MenuItem>
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name} (定員: {room.capacity}名)
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="参加者"
              select
              SelectProps={{
                multiple: true,
                value: formData.participantIds,
                onChange: (e) => setFormData({ ...formData, participantIds: e.target.value as string[] }),
              }}
              fullWidth
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleCreateMeeting} variant="contained">
            {selectedMeeting ? '更新' : '作成'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}