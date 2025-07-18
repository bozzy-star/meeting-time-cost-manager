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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  MeetingRoom,
  Add,
  Edit,
  Delete,
  LocationOn,
  People,
  AttachMoney,
  Wifi,
  Tv,
  Computer,
  VideoCall,
  Refresh,
  Save,
  Cancel,
  Check,
  Clear,
  Info,
} from '@mui/icons-material';
import { useApi } from '../contexts/ApiContext';

interface MeetingRoom {
  id: string;
  name: string;
  location: string;
  capacity: number;
  hourlyCost: number;
  isAvailable: boolean;
  equipment: string[];
  description?: string;
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

interface MeetingRoomFormData {
  name: string;
  location: string;
  capacity: number;
  hourlyCost: number;
  description: string;
  equipment: string[];
  features: string[];
}

const defaultFormData: MeetingRoomFormData = {
  name: '',
  location: '',
  capacity: 1,
  hourlyCost: 0,
  description: '',
  equipment: [],
  features: [],
};

const availableEquipment = [
  'プロジェクター',
  'ホワイトボード',
  'テレビ会議システム',
  'Wi-Fi',
  'モニター',
  'スピーカー',
  'マイク',
  'ケーブル類',
  'フリップチャート',
  'カメラ',
];

const availableFeatures = [
  '防音',
  'エアコン',
  '自然光',
  'ブラインド',
  'コーヒーマシン',
  'テラス',
  'ガラス張り',
  'プライベート',
  'オープン',
  'カジュアル',
];

export default function MeetingRoomsPage() {
  const { apiClient } = useApi();
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<MeetingRoom | null>(null);
  const [formData, setFormData] = useState<MeetingRoomFormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMeetingRooms();
  }, []);

  const loadMeetingRooms = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/meeting-rooms');
      setMeetingRooms(response.data);
      setError(null);
    } catch (err: any) {
      console.error('会議室データの読み込みに失敗しました:', err);
      setError('会議室データの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = () => {
    setEditingRoom(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleEditRoom = (room: MeetingRoom) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      location: room.location,
      capacity: room.capacity,
      hourlyCost: room.hourlyCost,
      description: room.description || '',
      equipment: room.equipment || [],
      features: room.features || [],
    });
    setDialogOpen(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('この会議室を削除しますか？')) return;

    try {
      await apiClient.delete(`/meeting-rooms/${roomId}`);
      await loadMeetingRooms();
    } catch (err: any) {
      console.error('会議室の削除に失敗しました:', err);
      setError('会議室の削除に失敗しました。');
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      if (editingRoom) {
        await apiClient.put(`/meeting-rooms/${editingRoom.id}`, formData);
      } else {
        await apiClient.post('/meeting-rooms', formData);
      }
      
      setDialogOpen(false);
      await loadMeetingRooms();
    } catch (err: any) {
      console.error('会議室の保存に失敗しました:', err);
      setError('会議室の保存に失敗しました。');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEquipmentChange = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const handleFeatureChange = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const getEquipmentIcon = (equipment: string) => {
    switch (equipment) {
      case 'プロジェクター':
      case 'モニター':
        return <Tv />;
      case 'テレビ会議システム':
        return <VideoCall />;
      case 'Wi-Fi':
        return <Wifi />;
      case 'コンピューター':
        return <Computer />;
      default:
        return <Check />;
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
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>読み込み中...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MeetingRoom color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            会議室管理
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadMeetingRooms}
          >
            更新
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateRoom}
          >
            会議室を追加
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* 会議室一覧カード */}
        <Stack spacing={3}>
          {meetingRooms.map((room) => (
            <Card key={room.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {room.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleEditRoom(room)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteRoom(room.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn color="action" fontSize="small" />
                    <Typography variant="body2">{room.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People color="action" fontSize="small" />
                    <Typography variant="body2">{room.capacity}名</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney color="action" fontSize="small" />
                    <Typography variant="body2">{formatCurrency(room.hourlyCost)}/時間</Typography>
                  </Box>
                </Stack>

                {room.description && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {room.description}
                  </Typography>
                )}

                {room.equipment && room.equipment.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>設備</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {room.equipment.map((equipment, index) => (
                        <Chip
                          key={index}
                          icon={getEquipmentIcon(equipment)}
                          label={equipment}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Chip
                    label={room.isAvailable ? '利用可能' : '利用不可'}
                    color={room.isAvailable ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {meetingRooms.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              会議室が登録されていません
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              「会議室を追加」ボタンから最初の会議室を登録してください
            </Typography>
          </Paper>
        )}
      </Stack>

      {/* 会議室追加・編集ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRoom ? '会議室を編集' : '会議室を追加'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="会議室名"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="場所"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="収容人数"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                  required
                  inputProps={{ min: 1 }}
                />
                <TextField
                  fullWidth
                  label="時間当たりコスト (円)"
                  type="number"
                  value={formData.hourlyCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyCost: parseInt(e.target.value) || 0 }))}
                  required
                  inputProps={{ min: 0 }}
                />
              </Stack>
              <TextField
                fullWidth
                label="説明"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Stack>

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>設備</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableEquipment.map((equipment) => (
                  <Chip
                    key={equipment}
                    label={equipment}
                    icon={getEquipmentIcon(equipment)}
                    onClick={() => handleEquipmentChange(equipment)}
                    color={formData.equipment.includes(equipment) ? 'primary' : 'default'}
                    variant={formData.equipment.includes(equipment) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>特徴</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableFeatures.map((feature) => (
                  <Chip
                    key={feature}
                    label={feature}
                    onClick={() => handleFeatureChange(feature)}
                    color={formData.features.includes(feature) ? 'secondary' : 'default'}
                    variant={formData.features.includes(feature) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting || !formData.name || !formData.location}
          >
            {submitting ? '保存中...' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}