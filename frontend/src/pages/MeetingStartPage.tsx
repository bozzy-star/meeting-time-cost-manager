import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Alert,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow,
  Add,
  AccessTime,
  AttachMoney,
  People,
  LocationOn,
  Schedule,
  Timer,
  Cancel,
} from '@mui/icons-material';
import { useApi } from '../contexts/ApiContext';

// ダミーデータ - 確実に表示されるように定数として定義
const DUMMY_MEETINGS = [
  {
    id: '1',
    title: '週次技術レビュー',
    status: 'completed',
    scheduledStartAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    actualDuration: 65,
    estimatedCost: 26000,
    participants: ['佐藤花子', '田中次郎'],
    room: '大会議室A',
    category: 'review'
  },
  {
    id: '2', 
    title: '月次営業会議',
    status: 'scheduled',
    scheduledStartAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 90,
    estimatedCost: 35000,
    participants: ['鈴木三郎', '山田太郎'],
    room: '中会議室B',
    category: 'planning'
  },
  {
    id: '3',
    title: '四半期経営会議', 
    status: 'scheduled',
    scheduledStartAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 180,
    estimatedCost: 85000,
    participants: ['山田太郎', '佐藤花子', '鈴木三郎', '高橋美香'],
    room: '大会議室A',
    category: 'decision'
  },
  {
    id: '4',
    title: 'プロジェクト進捗確認',
    status: 'in_progress', 
    scheduledStartAt: new Date().toISOString(),
    estimatedDuration: 45,
    estimatedCost: 18000,
    participants: ['田中次郎', '高橋美香'],
    room: '小会議室C',
    category: 'status'
  }
];

const CATEGORY_LABELS = {
  'planning': '計画・企画',
  'review': 'レビュー・確認',
  'brainstorming': 'ブレインストーミング',
  'status': '状況報告',
  'decision': '意思決定',
  'training': '研修・教育',
  'other': 'その他'
};

export default function MeetingStartPage() {
  const { user } = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentMeetings, setRecentMeetings] = useState<any[]>([]);
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);

  useEffect(() => {
    // コンポーネントマウント時に即座にダミーデータを設定
    console.log('MeetingStartPage mounted - setting dummy data');
    setRecentMeetings(DUMMY_MEETINGS);
    setLoading(false);
  }, []);

  const handleStartExistingMeeting = (meetingId: string) => {
    console.log(`Starting meeting ${meetingId}`);
    navigate(`/meetings/${meetingId}/tracker`);
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'in_progress':
        return 'success';
      case 'completed':
        return 'default';
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

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, maxWidth: 1200, mx: 'auto' }}>
        <LinearProgress sx={{ mb: 3 }} />
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          データを読み込み中...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PlayArrow color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            会議を開始
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowNewMeetingForm(true)}
          sx={{ display: showNewMeetingForm ? 'none' : 'flex' }}
        >
          新しい会議を作成
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!showNewMeetingForm && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              直近の会議 ({recentMeetings.length}件)
            </Typography>
            
            {recentMeetings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  会議データがありません
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  新しい会議を作成してください
                </Typography>
              </Box>
            ) : (
              <Stack spacing={3}>
                {recentMeetings.map((meeting) => (
                  <Card 
                    key={meeting.id}
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        boxShadow: 4,
                        transform: 'translateY(-4px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                    onClick={() => handleStartExistingMeeting(meeting.id)}
                  >
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem', flex: 1 }}>
                            {meeting.title}
                          </Typography>
                          <Chip
                            label={getStatusText(meeting.status)}
                            color={getStatusColor(meeting.status)}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        
                        <Stack spacing={1.5} sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule fontSize="small" color="action" />
                            <Typography variant="body2">
                              {new Date(meeting.scheduledStartAt).toLocaleDateString('ja-JP', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Timer fontSize="small" color="action" />
                            <Typography variant="body2">
                              {meeting.actualDuration || meeting.estimatedDuration}分
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachMoney fontSize="small" color="action" />
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              {formatCurrency(meeting.estimatedCost)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2">
                              {meeting.room}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <People fontSize="small" color="action" />
                            <Typography variant="body2" sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {meeting.participants.join(', ')}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Chip 
                              label={getCategoryLabel(meeting.category)}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </Box>
                        </Stack>
                        
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                          <Button
                            variant="contained"
                            startIcon={<PlayArrow />}
                            size="medium"
                            fullWidth
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartExistingMeeting(meeting.id);
                            }}
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 'bold'
                            }}
                          >
                            {meeting.status === 'scheduled' ? '会議を開始' : 
                             meeting.status === 'in_progress' ? '会議に参加' : '詳細を見る'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      )}

      {showNewMeetingForm && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">新しい会議を作成</Typography>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => setShowNewMeetingForm(false)}
              >
                戻る
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="textSecondary">
                会議作成フォーム
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                ここに会議作成フォームが表示されます
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 3 }}
                onClick={() => setShowNewMeetingForm(false)}
              >
                戻る
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}