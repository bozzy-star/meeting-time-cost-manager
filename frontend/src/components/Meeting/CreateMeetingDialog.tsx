import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Box,
  Typography,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  AccessTime,
  AttachMoney,
  LocationOn,
  VideoCall,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';
import { CreateMeetingForm, Priority, User } from '../../types';

dayjs.locale('ja');

interface CreateMeetingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (meeting: CreateMeetingForm) => void;
}

// モックデータ
const mockUsers: User[] = [
  { id: '1', name: '田中 太郎', email: 'tanaka@company.com', role: { id: '1', name: 'CEO', level: 1, defaultHourlyRate: 50000 }, department: '経営企画部', hourlyRate: 50000 },
  { id: '2', name: '鈴木 花子', email: 'suzuki@company.com', role: { id: '2', name: 'CTO', level: 2, defaultHourlyRate: 30000 }, department: '開発部', hourlyRate: 30000 },
  { id: '3', name: '佐藤 次郎', email: 'sato@company.com', role: { id: '3', name: '部長', level: 3, defaultHourlyRate: 12000 }, department: '開発部', hourlyRate: 12000 },
  { id: '4', name: '高橋 美香', email: 'takahashi@company.com', role: { id: '4', name: '課長', level: 4, defaultHourlyRate: 8000 }, department: '営業部', hourlyRate: 8000 },
];

const categories = [
  '経営会議',
  '開発会議',
  '営業会議',
  '人事会議',
  'プロジェクト会議',
  '定例会議',
  '緊急会議',
];

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: '低', color: '#4caf50' },
  { value: 'medium', label: '中', color: '#ff9800' },
  { value: 'high', label: '高', color: '#f44336' },
  { value: 'critical', label: '緊急', color: '#9c27b0' },
];

export default function CreateMeetingDialog({ open, onClose, onSubmit }: CreateMeetingDialogProps) {
  const [formData, setFormData] = useState<CreateMeetingForm>({
    title: '',
    description: '',
    category: '',
    scheduledStartAt: dayjs().add(1, 'hour').toDate(),
    scheduledEndAt: dayjs().add(2, 'hour').toDate(),
    location: '',
    isOnline: false,
    meetingUrl: '',
    participants: [],
    agenda: '',
    expectedRevenue: undefined,
    priority: 'medium',
    tags: [],
  });

  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: keyof CreateMeetingForm) => (event: any) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: 'scheduledStartAt' | 'scheduledEndAt') => (value: Dayjs | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, [field]: value.toDate() }));
    }
  };

  const handleParticipantsChange = (_event: React.SyntheticEvent, newValue: User[]) => {
    setSelectedParticipants(newValue);
    setFormData(prev => ({ ...prev, participants: newValue.map(user => user.id) }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const calculateEstimatedCost = () => {
    const duration = (formData.scheduledEndAt.getTime() - formData.scheduledStartAt.getTime()) / (1000 * 60 * 60);
    const totalHourlyRate = selectedParticipants.reduce((sum, user) => sum + user.hourlyRate, 0);
    return Math.round(duration * totalHourlyRate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            新しい会議を作成
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* 基本情報 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                基本情報
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 2 }}
                label="会議タイトル"
                value={formData.title}
                onChange={handleInputChange('title')}
                required
                placeholder="例: 四半期業績レビュー会議"
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>カテゴリ</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleInputChange('category')}
                  label="カテゴリ"
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              fullWidth
              label="説明"
              value={formData.description}
              onChange={handleInputChange('description')}
              multiline
              rows={3}
              placeholder="会議の目的や背景について簡潔に記載してください"
            />

            {/* 日時設定 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                日時設定
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DateTimePicker
                label="開始日時"
                value={dayjs(formData.scheduledStartAt)}
                onChange={handleDateChange('scheduledStartAt')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
              <DateTimePicker
                label="終了日時"
                value={dayjs(formData.scheduledEndAt)}
                onChange={handleDateChange('scheduledEndAt')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </Box>

            {/* 場所・オンライン設定 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                場所・形式
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="場所"
                value={formData.location}
                onChange={handleInputChange('location')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
                placeholder="例: 大会議室A, 本社10F"
              />
              <Box sx={{ flex: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isOnline}
                      onChange={handleInputChange('isOnline')}
                    />
                  }
                  label="オンライン会議"
                />
                {formData.isOnline && (
                  <TextField
                    fullWidth
                    label="会議URL"
                    value={formData.meetingUrl}
                    onChange={handleInputChange('meetingUrl')}
                    sx={{ mt: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VideoCall />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="https://zoom.us/j/123456789"
                  />
                )}
              </Box>
            </Box>

            {/* 参加者選択 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                参加者
              </Typography>
            </Box>
            
            <Autocomplete
              multiple
              options={mockUsers}
              getOptionLabel={(option) => `${option.name} (${option.role.name}) - ¥${option.hourlyRate.toLocaleString()}/時`}
              value={selectedParticipants}
              onChange={handleParticipantsChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="参加者を選択"
                  placeholder="参加者を追加してください"
                />
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    label={`${option.name} (¥${option.hourlyRate.toLocaleString()}/時)`}
                    {...getTagProps({ index })}
                    color="primary"
                    variant="outlined"
                    key={option.id}
                  />
                ))
              }
            />

            {/* 推定コスト表示 */}
            {selectedParticipants.length > 0 && (
              <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1, color: 'primary.contrastText' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney />
                  推定会議コスト: ¥{calculateEstimatedCost().toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  参加者{selectedParticipants.length}名 × 会議時間{Math.round(((formData.scheduledEndAt.getTime() - formData.scheduledStartAt.getTime()) / (1000 * 60 * 60)) * 10) / 10}時間
                </Typography>
              </Box>
            )}

            {/* その他設定 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                その他
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>優先度</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={handleInputChange('priority')}
                  label="優先度"
                >
                  {priorities.map(priority => (
                    <MenuItem key={priority.value} value={priority.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: priority.color,
                          }}
                        />
                        {priority.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                sx={{ flex: 1 }}
                label="期待売上"
                type="number"
                value={formData.expectedRevenue || ''}
                onChange={handleInputChange('expectedRevenue')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                }}
                placeholder="0"
              />
            </Box>
            
            <TextField
              fullWidth
              label="アジェンダ"
              value={formData.agenda}
              onChange={handleInputChange('agenda')}
              multiline
              rows={4}
              placeholder="1. 開会挨拶&#10;2. 前回議事録確認&#10;3. 議題について&#10;4. 次回予定"
            />
            
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="タグを追加"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  size="small"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button variant="outlined" onClick={handleAddTag}>
                  追加
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} variant="outlined">
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || selectedParticipants.length === 0}
          >
            会議を作成
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}