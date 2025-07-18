import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Person,
  TrendingUp,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { Meeting, User } from '../../types';

interface MeetingTrackerProps {
  meeting: Meeting;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
}

// モックデータ
const mockParticipants: User[] = [
  { id: '1', name: '田中 太郎', email: 'tanaka@company.com', role: { id: '1', name: 'CEO', level: 1, defaultHourlyRate: 50000 }, department: '経営企画部', hourlyRate: 50000, avatar: '/avatars/tanaka.jpg' },
  { id: '2', name: '鈴木 花子', email: 'suzuki@company.com', role: { id: '2', name: 'CTO', level: 2, defaultHourlyRate: 30000 }, department: '開発部', hourlyRate: 30000, avatar: '/avatars/suzuki.jpg' },
  { id: '3', name: '佐藤 次郎', email: 'sato@company.com', role: { id: '3', name: '部長', level: 3, defaultHourlyRate: 12000 }, department: '開発部', hourlyRate: 12000, avatar: '/avatars/sato.jpg' },
  { id: '4', name: '高橋 美香', email: 'takahashi@company.com', role: { id: '4', name: '課長', level: 4, defaultHourlyRate: 8000 }, department: '営業部', hourlyRate: 8000, avatar: '/avatars/takahashi.jpg' },
];

export default function MeetingTracker({ meeting, onStart, onPause, onEnd }: MeetingTrackerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentCost, setCurrentCost] = useState(0);
  const [joinedParticipants, setJoinedParticipants] = useState<User[]>([]);

  // 参加者の時給合計を計算
  const totalHourlyRate = mockParticipants.reduce((sum, participant) => sum + participant.hourlyRate, 0);

  // リアルタイムでコストを更新
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setCurrentCost(prev => prev + (totalHourlyRate / 3600)); // 1秒あたりのコスト
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, totalHourlyRate]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    setJoinedParticipants(mockParticipants);
    onStart();
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    onPause();
  };

  const handleEnd = () => {
    setIsRunning(false);
    setIsPaused(false);
    onEnd();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return `¥${Math.round(amount).toLocaleString()}`;
  };

  const getEfficiencyColor = () => {
    if (elapsedTime === 0) return 'info';
    const scheduledMinutes = (meeting.scheduledEndAt.getTime() - meeting.scheduledStartAt.getTime()) / (1000 * 60);
    const actualMinutes = elapsedTime / 60;
    const efficiency = scheduledMinutes / actualMinutes;
    
    if (efficiency > 1.1) return 'success';
    if (efficiency > 0.9) return 'warning';
    return 'error';
  };

  const scheduledDuration = Math.floor((meeting.scheduledEndAt.getTime() - meeting.scheduledStartAt.getTime()) / (1000 * 60));
  const actualMinutes = Math.floor(elapsedTime / 60);
  const progress = scheduledDuration > 0 ? Math.min((actualMinutes / scheduledDuration) * 100, 100) : 0;
  const isOvertime = actualMinutes > scheduledDuration;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* メイン画面 */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: 'center' }}>
            <Box sx={{ flex: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {meeting.title}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                {meeting.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={meeting.category} variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
                <Chip 
                  label={meeting.priority === 'high' ? '高優先度' : meeting.priority === 'medium' ? '中優先度' : '低優先度'} 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'white' }} 
                />
              </Box>
            </Box>
            
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {formatTime(elapsedTime)}
              </Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {formatCurrency(currentCost)}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                {!isRunning ? (
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={handleStart}
                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                    size="large"
                  >
                    開始
                  </Button>
                ) : (
                  <>
                    <IconButton
                      onClick={handlePause}
                      sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                      size="large"
                    >
                      {isPaused ? <PlayArrow /> : <Pause />}
                    </IconButton>
                    <IconButton
                      onClick={handleEnd}
                      sx={{ bgcolor: 'white', color: 'error.main', '&:hover': { bgcolor: 'grey.100' } }}
                      size="large"
                    >
                      <Stop />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
          </Stack>

          {/* 進捗バー */}
          {isRunning && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  予定時間: {scheduledDuration}分
                </Typography>
                <Typography variant="body2">
                  経過時間: {Math.floor(elapsedTime / 60)}分
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(progress, 100)}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: isOvertime ? '#ff5722' : '#4caf50'
                  }
                }}
              />
              {isOvertime && (
                <Alert 
                  severity="warning" 
                  sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                >
                  会議が予定時間を超過しています！
                </Alert>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Stack spacing={3}>
        {/* 上段 */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* リアルタイム統計 */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="primary" />
                リアルタイム統計
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="textSecondary">参加者数</Typography>
                <Typography variant="h6">{joinedParticipants.length}名</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="textSecondary">1分あたりコスト</Typography>
                <Typography variant="h6" color="error.main">
                  {formatCurrency(totalHourlyRate / 60)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="textSecondary">効率スコア</Typography>
                <Chip 
                  label={isRunning ? (isOvertime ? '低効率' : '効率的') : '未開始'} 
                  color={getEfficiencyColor()}
                  size="small"
                />
              </Box>

              {meeting.expectedRevenue && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">予想ROI</Typography>
                  <Typography variant="h6" color="success.main">
                    {currentCost > 0 ? `${Math.round(((meeting.expectedRevenue - currentCost) / currentCost) * 100)}%` : 'N/A'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* 参加者リスト */}
          <Card sx={{ flex: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                参加者 ({joinedParticipants.length}名)
              </Typography>
              
              <List>
                {mockParticipants.map((participant, index) => (
                  <React.Fragment key={participant.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {participant.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {participant.name}
                            {joinedParticipants.find(p => p.id === participant.id) ? (
                              <CheckCircle color="success" fontSize="small" />
                            ) : (
                              <Warning color="warning" fontSize="small" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {participant.role.name} - {participant.department}
                            </Typography>
                            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                              時給: {formatCurrency(participant.hourlyRate)} 
                              {isRunning && (
                                <span style={{ marginLeft: 8 }}>
                                  累計: {formatCurrency((participant.hourlyRate / 3600) * elapsedTime)}
                                </span>
                              )}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < mockParticipants.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Stack>

        {/* アジェンダ */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              アジェンダ
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {meeting.agenda || '1. 開会挨拶\n2. 前回議事録確認\n3. 本日の議題\n4. 次回予定'}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}