import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Alert,
  Paper,
  Divider,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Container,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
} from '@mui/material';
import {
  Analytics,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  AccessTime,
  People,
  Event,
  CheckCircle,
  Warning,
  Error,
  Info,
  DateRange,
  FilterList,
  Download,
  Refresh,
  PieChart,
  BarChart,
  Schedule,
  BusinessCenter,
  Score,
  Speed,
  Insights,
} from '@mui/icons-material';
import { useApi } from '../contexts/ApiContext';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

interface AnalyticsData {
  summary: {
    totalMeetings: number;
    totalCost: number;
    totalHours: number;
    averageCost: number;
    averageDuration: number;
    participantCount: number;
  };
  trends: {
    period: string;
    cost: number;
    meetings: number;
    hours: number;
    efficiency: number;
  }[];
  topCostCategories: {
    category: string;
    cost: number;
    percentage: number;
  }[];
  departmentAnalysis: {
    department: string;
    totalCost: number;
    meetingCount: number;
    averageCost: number;
    efficiency: number;
  }[];
  meetingEfficiency: {
    meetingId: string;
    title: string;
    efficiency: number;
    cost: number;
    duration: number;
    participants: number;
    status: 'excellent' | 'good' | 'average' | 'poor';
  }[];
  recommendations: {
    type: 'cost' | 'time' | 'efficiency' | 'participation';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    suggestion: string;
  }[];
}

export default function AnalyticsPage() {
  const { apiClient } = useApi();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30d');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [departments, setDepartments] = useState<any[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState('JPY');

  useEffect(() => {
    loadAnalyticsData();
    loadDepartments();
  }, [dateRange, filterDepartment]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // ダミーデータ - より現実的で詳細なデータセット
      const dummyData: AnalyticsData = {
        summary: {
          totalMeetings: 312,
          totalCost: 28500000,
          totalHours: 468.5,
          averageCost: 91346,
          averageDuration: 90,
          participantCount: 1247,
        },
        trends: [
          { period: '1月', cost: 4200000, meetings: 52, hours: 78, efficiency: 73 },
          { period: '2月', cost: 3800000, meetings: 48, hours: 72, efficiency: 78 },
          { period: '3月', cost: 4600000, meetings: 58, hours: 87, efficiency: 75 },
          { period: '4月', cost: 4500000, meetings: 55, hours: 82.5, efficiency: 77 },
          { period: '5月', cost: 3900000, meetings: 49, hours: 73.5, efficiency: 82 },
          { period: '6月', cost: 4300000, meetings: 54, hours: 81, efficiency: 79 },
          { period: '7月', cost: 3700000, meetings: 46, hours: 69, efficiency: 85 },
        ],
        topCostCategories: [
          { category: '戦略会議', cost: 8500000, percentage: 29.8 },
          { category: '技術レビュー', cost: 6200000, percentage: 21.8 },
          { category: '営業会議', cost: 5800000, percentage: 20.4 },
          { category: 'プロジェクト会議', cost: 4200000, percentage: 14.7 },
          { category: '人事会議', cost: 2800000, percentage: 9.8 },
          { category: 'その他', cost: 1000000, percentage: 3.5 },
        ],
        departmentAnalysis: [
          { department: '経営企画部', totalCost: 8500000, meetingCount: 35, averageCost: 242857, efficiency: 78 },
          { department: '開発部', totalCost: 6200000, meetingCount: 68, averageCost: 91176, efficiency: 85 },
          { department: '営業部', totalCost: 5800000, meetingCount: 52, averageCost: 111538, efficiency: 82 },
          { department: 'マーケティング部', totalCost: 4200000, meetingCount: 38, averageCost: 110526, efficiency: 77 },
          { department: '人事部', totalCost: 2800000, meetingCount: 28, averageCost: 100000, efficiency: 80 },
          { department: 'デザイン部', totalCost: 2900000, meetingCount: 31, averageCost: 93548, efficiency: 88 },
        ],
        meetingEfficiency: [
          { meetingId: '1', title: '四半期戦略会議', efficiency: 95, cost: 425000, duration: 135, participants: 6, status: 'excellent' },
          { meetingId: '2', title: 'スプリントレビュー', efficiency: 92, cost: 180000, duration: 60, participants: 8, status: 'excellent' },
          { meetingId: '3', title: 'デザインレビュー', efficiency: 88, cost: 135000, duration: 90, participants: 5, status: 'excellent' },
          { meetingId: '4', title: '月次営業会議', efficiency: 82, cost: 240000, duration: 120, participants: 7, status: 'good' },
          { meetingId: '5', title: 'キャンペーン企画', efficiency: 77, cost: 165000, duration: 75, participants: 6, status: 'good' },
          { meetingId: '6', title: '採用面接フィードバック', efficiency: 80, cost: 95000, duration: 45, participants: 4, status: 'good' },
          { meetingId: '7', title: '技術勉強会', efficiency: 65, cost: 120000, duration: 90, participants: 12, status: 'average' },
          { meetingId: '8', title: '予算会議', efficiency: 45, cost: 380000, duration: 180, participants: 8, status: 'poor' },
        ],
        recommendations: [
          {
            type: 'cost',
            title: '長時間会議の最適化',
            description: '180分以上の会議が全体コストの25%を占めています',
            impact: 'high',
            suggestion: '会議時間を90分以内に制限し、事前準備を徹底しましょう'
          },
          {
            type: 'efficiency',
            title: '参加者数の最適化',
            description: '8名以上の会議で効率が20%低下しています',
            impact: 'medium',
            suggestion: '必要最小限の参加者に絞り、意思決定者を明確にしましょう'
          },
          {
            type: 'time',
            title: '会議準備時間の改善',
            description: '準備不足により会議時間が平均15%延長されています',
            impact: 'medium',
            suggestion: 'アジェンダの事前共有と資料準備を徹底しましょう'
          },
          {
            type: 'participation',
            title: '会議の目的明確化',
            description: '40%の会議で明確な成果物が設定されていません',
            impact: 'high',
            suggestion: '会議の目的と期待する成果を事前に明文化しましょう'
          }
        ]
      };

      setAnalyticsData(dummyData);
      setError(null);
    } catch (err: any) {
      console.error('分析データの読み込みに失敗しました:', err);
      setError('分析データの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      // ダミー部署データ
      const dummyDepartments = [
        { id: '1', name: '経営企画部', code: 'EXEC' },
        { id: '2', name: '開発部', code: 'DEV' },
        { id: '3', name: '営業部', code: 'SALES' },
        { id: '4', name: 'マーケティング部', code: 'MKT' },
        { id: '5', name: '人事部', code: 'HR' },
        { id: '6', name: 'デザイン部', code: 'DESIGN' },
      ];
      
      setDepartments(dummyDepartments);
    } catch (err: any) {
      console.error('部署データの読み込みに失敗しました:', err);
    }
  };

  const formatCurrencyLocal = (amount: number) => {
    return formatCurrency(amount, currentCurrency);
  };

  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}時間`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'success';
    if (efficiency >= 60) return 'warning';
    return 'error';
  };

  const getEfficiencyLabel = (efficiency: number) => {
    if (efficiency >= 80) return '優秀';
    if (efficiency >= 60) return '良好';
    if (efficiency >= 40) return '普通';
    return '改善必要';
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'cost':
        return <AttachMoney color="warning" />;
      case 'time':
        return <AccessTime color="primary" />;
      case 'efficiency':
        return <Speed color="success" />;
      case 'participation':
        return <People color="info" />;
      default:
        return <Info />;
    }
  };

  const getRecommendationSeverity = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  };

  const handleExportReport = async () => {
    try {
      const response = await apiClient.get('/analytics/export', {
        params: { dateRange, department: filterDepartment !== 'all' ? filterDepartment : undefined },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `meeting-analytics-${dateRange}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error('レポートエクスポートに失敗しました:', err);
      setError('レポートエクスポートに失敗しました。');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>読み込み中...</Typography>
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Alert severity="error">分析データが取得できませんでした。</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Analytics color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            分析・レポート
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>期間</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="期間"
            >
              <MenuItem value="7d">過去7日</MenuItem>
              <MenuItem value="30d">過去30日</MenuItem>
              <MenuItem value="90d">過去90日</MenuItem>
              <MenuItem value="1y">過去1年</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>部署</InputLabel>
            <Select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              label="部署"
            >
              <MenuItem value="all">すべて</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadAnalyticsData}
          >
            更新
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExportReport}
          >
            レポート出力
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* サマリーカード */}
        <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">総会議数</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {analyticsData.summary.totalMeetings}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                件
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">総コスト</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {formatCurrency(analyticsData.summary.totalCost)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                平均: {formatCurrency(analyticsData.summary.averageCost)}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">総時間</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {formatHours(analyticsData.summary.totalHours)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                平均: {formatHours(analyticsData.summary.averageDuration)}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">参加者数</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {analyticsData.summary.participantCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                名
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* トレンド分析と部署別分析 */}
        <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
          <Card sx={{ flex: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                トレンド分析
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  チャート表示機能は次回のアップデートで実装予定です
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                部署別分析
              </Typography>
              <List>
                {analyticsData.departmentAnalysis.map((dept, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <BusinessCenter />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={dept.department}
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2">
                            コスト: {formatCurrency(dept.totalCost)}
                          </Typography>
                          <Typography variant="body2">
                            会議数: {dept.meetingCount}件
                          </Typography>
                          <Typography variant="body2">
                            効率: {formatPercentage(dept.efficiency)}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Stack>

        {/* 会議効率ランキングと改善提案 */}
        <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                会議効率ランキング
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>会議名</TableCell>
                      <TableCell>効率</TableCell>
                      <TableCell>コスト</TableCell>
                      <TableCell>参加者</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.meetingEfficiency.map((meeting, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {meeting.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${meeting.efficiency}%`}
                            color={getEfficiencyColor(meeting.efficiency)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatCurrency(meeting.cost)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {meeting.participants}名
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                改善提案
              </Typography>
              <Stack spacing={2}>
                {analyticsData.recommendations.map((rec, index) => (
                  <Alert
                    key={index}
                    severity={getRecommendationSeverity(rec.impact)}
                    icon={getRecommendationIcon(rec.type)}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {rec.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {rec.description}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      提案: {rec.suggestion}
                    </Typography>
                  </Alert>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* コストカテゴリ */}
        <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                コストカテゴリ
              </Typography>
              <Stack spacing={2}>
                {analyticsData.topCostCategories.map((category, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{category.category}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(category.cost)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={category.percentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {formatPercentage(category.percentage)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
}