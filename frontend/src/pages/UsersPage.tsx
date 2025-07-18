import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  InputAdornment,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  People,
  AttachMoney,
  AdminPanelSettings,
  Search,
  Email,
  Phone,
} from '@mui/icons-material';

// ユーザーデータの型定義
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  positionId: string;
  positionName: string;
  role: 'admin' | 'meeting_editor' | 'meeting_creator' | 'viewer';
  monthlyCost: number;
  hourlyCost: number;
  isActive: boolean;
  joinedDate: string;
  avatar?: string;
}

// 権限の型定義
type UserRole = 'admin' | 'meeting_editor' | 'meeting_creator' | 'viewer';

// 権限の表示名とカラー
const roleConfig: Record<UserRole, { label: string; color: string }> = {
  admin: { label: '管理者', color: '#d32f2f' },
  meeting_editor: { label: '会議編集者', color: '#7b1fa2' },
  meeting_creator: { label: '会議作成者', color: '#1976d2' },
  viewer: { label: '閲覧者', color: '#388e3c' },
};

// モック役職データ
const mockPositions = [
  { id: '1', name: '代表取締役', monthlyCost: 2500000 },
  { id: '2', name: '取締役', monthlyCost: 1800000 },
  { id: '3', name: '部長', monthlyCost: 1200000 },
  { id: '4', name: '課長', monthlyCost: 800000 },
  { id: '5', name: '主任', monthlyCost: 600000 },
  { id: '6', name: '一般社員', monthlyCost: 400000 },
];

// モックユーザーデータ
const mockUsers: User[] = [
  {
    id: '1',
    name: '田中 太郎',
    email: 'tanaka@company.com',
    phone: '090-1234-5678',
    positionId: '1',
    positionName: '代表取締役',
    role: 'admin',
    monthlyCost: 2500000,
    hourlyCost: 15625,
    isActive: true,
    joinedDate: '2020-01-15',
  },
  {
    id: '2',
    name: '佐藤 花子',
    email: 'sato@company.com',
    phone: '090-2345-6789',
    positionId: '2',
    positionName: '取締役',
    role: 'admin',
    monthlyCost: 1800000,
    hourlyCost: 11250,
    isActive: true,
    joinedDate: '2020-03-01',
  },
  {
    id: '3',
    name: '鈴木 一郎',
    email: 'suzuki@company.com',
    phone: '090-3456-7890',
    positionId: '3',
    positionName: '部長',
    role: 'meeting_editor',
    monthlyCost: 1200000,
    hourlyCost: 7500,
    isActive: true,
    joinedDate: '2021-04-01',
  },
  {
    id: '4',
    name: '高橋 美咲',
    email: 'takahashi@company.com',
    phone: '090-4567-8901',
    positionId: '4',
    positionName: '課長',
    role: 'meeting_creator',
    monthlyCost: 800000,
    hourlyCost: 5000,
    isActive: true,
    joinedDate: '2021-07-15',
  },
  {
    id: '5',
    name: '山田 健太',
    email: 'yamada@company.com',
    phone: '090-5678-9012',
    positionId: '5',
    positionName: '主任',
    role: 'meeting_creator',
    monthlyCost: 600000,
    hourlyCost: 3750,
    isActive: true,
    joinedDate: '2022-01-10',
  },
  {
    id: '6',
    name: '中村 恵美',
    email: 'nakamura@company.com',
    phone: '090-6789-0123',
    positionId: '6',
    positionName: '一般社員',
    role: 'viewer',
    monthlyCost: 400000,
    hourlyCost: 2500,
    isActive: false,
    joinedDate: '2022-06-01',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    positionId: '',
    role: 'viewer' as UserRole,
    isActive: true,
  });

  // フィルタリング
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.positionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 新規作成/編集ダイアログを開く
  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        positionId: user.positionId,
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        positionId: '',
        role: 'viewer',
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  // ユーザーを保存
  const handleSaveUser = () => {
    const selectedPosition = mockPositions.find(p => p.id === formData.positionId);
    const monthlyCost = selectedPosition?.monthlyCost || 0;
    const hourlyCost = Math.round(monthlyCost / 160);

    if (editingUser) {
      // 編集
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              positionId: formData.positionId,
              positionName: selectedPosition?.name || '',
              role: formData.role,
              monthlyCost,
              hourlyCost,
              isActive: formData.isActive,
            }
          : user
      ));
    } else {
      // 新規作成
      const newUser: User = {
        id: (users.length + 1).toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        positionId: formData.positionId,
        positionName: selectedPosition?.name || '',
        role: formData.role,
        monthlyCost,
        hourlyCost,
        isActive: formData.isActive,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
    }
    handleCloseDialog();
  };

  // ユーザーを削除
  const handleDeleteUser = (id: string) => {
    if (window.confirm('このユーザーを削除しますか？')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  // アクティブユーザー数
  const activeUsers = users.filter(user => user.isActive);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          ユーザー管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => handleOpenDialog()}
        >
          新しいユーザー
        </Button>
      </Box>

      {/* 統計カード */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  総ユーザー数
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {users.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <People />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  アクティブユーザー
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {activeUsers.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <AdminPanelSettings />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  総月額コスト
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  ¥{activeUsers.reduce((sum, user) => sum + user.monthlyCost, 0).toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <AttachMoney />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  管理者数
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {users.filter(user => user.role === 'admin').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                <AdminPanelSettings />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* 検索バー */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="ユーザー名、メール、役職で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* ユーザー一覧テーブル */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            ユーザー一覧
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ユーザー</TableCell>
                  <TableCell>役職</TableCell>
                  <TableCell>権限</TableCell>
                  <TableCell>連絡先</TableCell>
                  <TableCell align="right">月額コスト</TableCell>
                  <TableCell align="center">ステータス</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            入社: {user.joinedDate}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {user.positionName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={roleConfig[user.role].label}
                        size="small"
                        sx={{ 
                          bgcolor: roleConfig[user.role].color,
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {user.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {user.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        ¥{user.monthlyCost.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        (¥{user.hourlyCost.toLocaleString()}/時)
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.isActive ? 'アクティブ' : '無効'}
                        size="small"
                        color={user.isActive ? 'success' : 'default'}
                        variant={user.isActive ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(user)}
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 新規作成/編集ダイアログ */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? 'ユーザーを編集' : '新しいユーザーを作成'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="氏名"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="メールアドレス"
                type="email"
                sx={{ flex: 1 }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="電話番号"
                sx={{ flex: 1 }}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }} required>
                <InputLabel>役職</InputLabel>
                <Select
                  value={formData.positionId}
                  label="役職"
                  onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                >
                  {mockPositions.map((position) => (
                    <MenuItem key={position.id} value={position.id}>
                      {position.name} (¥{position.monthlyCost.toLocaleString()}/月)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={{ flex: 1 }} required>
                <InputLabel>権限</InputLabel>
                <Select
                  value={formData.role}
                  label="権限"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  {Object.entries(roleConfig).map(([role, config]) => (
                    <MenuItem key={role} value={role}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: config.color,
                          }}
                        />
                        {config.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="アクティブユーザー"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            disabled={!formData.name || !formData.email || !formData.positionId}
          >
            {editingUser ? '更新' : '作成'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}