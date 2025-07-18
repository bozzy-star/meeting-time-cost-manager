import React, { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Schedule,
  People,
  BusinessCenter,
  Warning,
  CheckCircle,
  MoreVert,
  Add,
  CloudDone,
  CloudOff,
} from '@mui/icons-material';
import { BarChart, LineChart, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line } from 'recharts';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

// モックデータ - より現実的で豊富なデータセット
const monthlyData = [
  { month: '1月', cost: 4200000, meetings: 52, efficiency: 0.73, participants: 168, avgDuration: 85 },
  { month: '2月', cost: 3800000, meetings: 48, efficiency: 0.78, participants: 154, avgDuration: 82 },
  { month: '3月', cost: 4600000, meetings: 58, efficiency: 0.75, participants: 186, avgDuration: 88 },
  { month: '4月', cost: 4500000, meetings: 55, efficiency: 0.77, participants: 178, avgDuration: 87 },
  { month: '5月', cost: 3900000, meetings: 49, efficiency: 0.82, participants: 162, avgDuration: 84 },
  { month: '6月', cost: 4300000, meetings: 54, efficiency: 0.79, participants: 174, avgDuration: 86 },
  { month: '7月', cost: 3700000, meetings: 46, efficiency: 0.85, participants: 151, avgDuration: 81 },
];

const departmentData = [
  { name: '経営企画部', cost: 8500000, meetings: 35, color: '#1976d2', avgParticipants: 5.2, efficiency: 0.78 },
  { name: '開発部', cost: 6200000, meetings: 68, color: '#388e3c', avgParticipants: 4.8, efficiency: 0.85 },
  { name: '営業部', cost: 5800000, meetings: 52, color: '#f57c00', avgParticipants: 3.9, efficiency: 0.82 },
  { name: '人事部', cost: 2800000, meetings: 28, color: '#7b1fa2', avgParticipants: 4.2, efficiency: 0.80 },
  { name: 'マーケティング部', cost: 4200000, meetings: 38, color: '#e91e63', avgParticipants: 4.5, efficiency: 0.77 },
  { name: 'デザイン部', cost: 2900000, meetings: 31, color: '#9c27b0', avgParticipants: 3.6, efficiency: 0.88 },
];

const recentMeetings = [
  {
    id: '1',
    title: '四半期業績レビュー会議',
    date: '2024-07-17',
    duration: 135,
    cost: 425000,
    participants: 6,
    status: 'completed',
    efficiency: 0.85,
    department: '経営企画部'
  },
  {
    id: '2',
    title: '週次スプリントレビュー',
    date: '2024-07-17',
    duration: 60,
    cost: 180000,
    participants: 8,
    status: 'in_progress',
    efficiency: 0.92,
    department: '開発部'
  },
  {
    id: '3',
    title: '新機能デザインレビュー',
    date: '2024-07-17',
    duration: 90,
    cost: 135000,
    participants: 5,
    status: 'completed',
    efficiency: 0.88,
    department: 'デザイン部'
  },
  {
    id: '4',
    title: '月次営業戦略会議',
    date: '2024-07-18',
    duration: 120,
    cost: 240000,
    participants: 7,
    status: 'scheduled',
    efficiency: null,
    department: '営業部'
  },
  {
    id: '5',
    title: 'キャンペーン企画会議',
    date: '2024-07-18',
    duration: 75,
    cost: 165000,
    participants: 6,
    status: 'scheduled',
    efficiency: null,
    department: 'マーケティング部'
  },
  {
    id: '6',
    title: '採用面接フィードバック会議',
    date: '2024-07-18',
    duration: 45,
    cost: 95000,
    participants: 4,
    status: 'scheduled',
    efficiency: null,
    department: '人事部'
  },
];

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactElement;
  color: string;
}

const StatCard = ({ title, value, change, icon, color }: StatCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          {change && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {change > 0 ? (
                <TrendingUp color="success" fontSize="small" />
              ) : (
                <TrendingDown color="error" fontSize="small" />
              )}
              <Typography
                variant="body2"
                color={change > 0 ? 'success.main' : 'error.main'}
                sx={{ ml: 0.5 }}
              >
                {Math.abs(change)}% 前月比
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const getStatusChip = (status: string) => {
  switch (status) {
    case 'completed':
      return <Chip label="完了" color="success" size="small" />;
    case 'in_progress':
      return <Chip label="進行中" color="warning" size="small" />;
    case 'scheduled':
      return <Chip label="予定" color="info" size="small" />;
    default:
      return <Chip label="不明" color="default" size="small" />;
  }
};

const getEfficiencyIcon = (efficiency: number | null) => {
  if (efficiency === null) return null;
  return efficiency >= 0.8 ? (
    <CheckCircle color="success" fontSize="small" />
  ) : (
    <Warning color="warning" fontSize="small" />
  );
};

export default function Dashboard() {
  const { checkHealth, meetings, user, isAuthenticated } = useApi();
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [currentCurrency, setCurrentCurrency] = useState('JPY');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const totalCost = 22700000;
  const totalMeetings = 243;
  const averageCost = Math.round(totalCost / totalMeetings);
  const efficiency = 0.82;
  const totalParticipants = 347;
  const averageDuration = 87; // minutes
  const costPerMinute = Math.round(totalCost / (totalMeetings * averageDuration));

  // API接続状態をチェック
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const isHealthy = await checkHealth();
        setApiStatus(isHealthy ? 'connected' : 'disconnected');
      } catch (error) {
        setApiStatus('disconnected');
      }
    };

    checkApiConnection();
    
    // 定期的にデータを更新
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // 30秒ごと

    return () => clearInterval(interval);
  }, [checkHealth]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            ダッシュボード
          </Typography>
          {/* API接続状態 */}
          <Chip
            icon={apiStatus === 'connected' ? <CloudDone /> : <CloudOff />}
            label={
              apiStatus === 'checking' ? 'API接続確認中...' :
              apiStatus === 'connected' ? 'API接続済み' : 'API未接続'
            }
            color={apiStatus === 'connected' ? 'success' : 'error'}
            variant="outlined"
            size="small"
          />
          {/* 認証状態 */}
          {user && (
            <Chip
              label={`${user.name} (${user.role})`}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {/* 最終更新時刻 */}
          <Chip
            label={`更新: ${lastUpdated.toLocaleTimeString('ja-JP')}`}
            variant="outlined"
            size="small"
          />
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => setLastUpdated(new Date())}
            size="large"
          >
            更新
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
          >
            新しい会議
          </Button>
        </Stack>
      </Box>

      {/* サマリーカード */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="総会議コスト"
            value={formatCurrency(totalCost, currentCurrency)}
            change={-12.5}
            icon={<AttachMoney />}
            color="primary.main"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="総会議数"
            value={totalMeetings.toLocaleString()}
            change={-8.2}
            icon={<BusinessCenter />}
            color="secondary.main"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="平均会議コスト"
            value={formatCurrency(averageCost, currentCurrency)}
            change={-5.1}
            icon={<Schedule />}
            color="success.main"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="効率スコア"
            value={`${Math.round(efficiency * 100)}%`}
            change={+4.3}
            icon={<TrendingUp />}
            color="info.main"
          />
        </Box>
      </Stack>

      {/* 追加メトリクス */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="総参加者数"
            value={totalParticipants.toLocaleString()}
            change={+3.2}
            icon={<People />}
            color="warning.main"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="平均会議時間"
            value={`${averageDuration}分`}
            change={-7.8}
            icon={<Schedule />}
            color="info.main"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="分あたりコスト"
            value={formatCurrency(costPerMinute, currentCurrency)}
            change={-4.1}
            icon={<AttachMoney />}
            color="error.main"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="本日の会議"
            value="12"
            change={+25.0}
            icon={<BusinessCenter />}
            color="success.main"
          />
        </Box>
      </Stack>

      <Stack spacing={3}>
        {/* 上段のチャート */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* 月次コスト推移 */}
          <Card sx={{ flex: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                月次コスト推移
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${getCurrencySymbol(currentCurrency)}${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value, currentCurrency), 'コスト']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#1976d2" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    name="会議コスト"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 部署別コスト */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                部署別コスト
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="cost"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCurrency(value, currentCurrency), 'コスト']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Stack>

        {/* 下段のチャート */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* 効率スコアトレンド */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                効率スコア推移
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '効率スコア']} />
                  <Bar dataKey="efficiency" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 部署別詳細 */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                部署別詳細
              </Typography>
              <Box>
                {departmentData.map((dept, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {dept.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatCurrency(dept.cost, currentCurrency)} ({dept.meetings}回)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(dept.cost / departmentData[0].cost) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: dept.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* 最近の会議 */}
        <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  最近の会議
                </Typography>
                <Button variant="outlined" size="small">
                  すべて表示
                </Button>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>会議名</TableCell>
                      <TableCell>部署</TableCell>
                      <TableCell>日付</TableCell>
                      <TableCell align="center">参加者</TableCell>
                      <TableCell align="center">時間</TableCell>
                      <TableCell align="right">コスト</TableCell>
                      <TableCell align="center">効率</TableCell>
                      <TableCell align="center">ステータス</TableCell>
                      <TableCell align="center">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentMeetings.map((meeting) => (
                      <TableRow key={meeting.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {meeting.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={meeting.department}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(meeting.date).toLocaleDateString('ja-JP')}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <People fontSize="small" color="action" />
                            {meeting.participants}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {Math.floor(meeting.duration / 60)}h {meeting.duration % 60}m
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(meeting.cost, currentCurrency)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            {meeting.efficiency && getEfficiencyIcon(meeting.efficiency)}
                            <Typography variant="body2">
                              {meeting.efficiency ? `${Math.round(meeting.efficiency * 100)}%` : '-'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {getStatusChip(meeting.status)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
      </Stack>
    </Box>
  );
}