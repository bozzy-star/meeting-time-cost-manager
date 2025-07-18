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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  BusinessCenter,
  AttachMoney,
  Search,
} from '@mui/icons-material';

// 役職データの型定義
interface Position {
  id: string;
  name: string;
  monthlyCost: number;
  hourlyCost: number;
  level: number;
  description: string;
  userCount: number;
  color: string;
}

// モックデータ
const mockPositions: Position[] = [
  {
    id: '1',
    name: '代表取締役',
    monthlyCost: 2500000,
    hourlyCost: 15625,
    level: 1,
    description: '最高経営責任者',
    userCount: 1,
    color: '#d32f2f',
  },
  {
    id: '2',
    name: '取締役',
    monthlyCost: 1800000,
    hourlyCost: 11250,
    level: 2,
    description: '取締役会メンバー',
    userCount: 3,
    color: '#7b1fa2',
  },
  {
    id: '3',
    name: '部長',
    monthlyCost: 1200000,
    hourlyCost: 7500,
    level: 3,
    description: '部署統括責任者',
    userCount: 8,
    color: '#1976d2',
  },
  {
    id: '4',
    name: '課長',
    monthlyCost: 800000,
    hourlyCost: 5000,
    level: 4,
    description: '課統括責任者',
    userCount: 15,
    color: '#388e3c',
  },
  {
    id: '5',
    name: '主任',
    monthlyCost: 600000,
    hourlyCost: 3750,
    level: 5,
    description: 'チームリーダー',
    userCount: 25,
    color: '#f57c00',
  },
  {
    id: '6',
    name: '一般社員',
    monthlyCost: 400000,
    hourlyCost: 2500,
    level: 6,
    description: '一般従業員',
    userCount: 120,
    color: '#546e7a',
  },
];

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    monthlyCost: '',
    description: '',
    level: '',
    color: '#1976d2',
  });

  // フィルタリング
  const filteredPositions = positions.filter(position =>
    position.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    position.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 新規作成/編集ダイアログを開く
  const handleOpenDialog = (position?: Position) => {
    if (position) {
      setEditingPosition(position);
      setFormData({
        name: position.name,
        monthlyCost: position.monthlyCost.toString(),
        description: position.description,
        level: position.level.toString(),
        color: position.color,
      });
    } else {
      setEditingPosition(null);
      setFormData({
        name: '',
        monthlyCost: '',
        description: '',
        level: '',
        color: '#1976d2',
      });
    }
    setOpenDialog(true);
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPosition(null);
  };

  // 役職を保存
  const handleSavePosition = () => {
    const monthlyCost = parseInt(formData.monthlyCost);
    const hourlyCost = Math.round(monthlyCost / 160); // 月160時間として計算

    if (editingPosition) {
      // 編集
      setPositions(positions.map(pos => 
        pos.id === editingPosition.id 
          ? {
              ...pos,
              name: formData.name,
              monthlyCost,
              hourlyCost,
              description: formData.description,
              level: parseInt(formData.level),
              color: formData.color,
            }
          : pos
      ));
    } else {
      // 新規作成
      const newPosition: Position = {
        id: (positions.length + 1).toString(),
        name: formData.name,
        monthlyCost,
        hourlyCost,
        description: formData.description,
        level: parseInt(formData.level),
        color: formData.color,
        userCount: 0,
      };
      setPositions([...positions, newPosition]);
    }
    handleCloseDialog();
  };

  // 役職を削除
  const handleDeletePosition = (id: string) => {
    if (window.confirm('この役職を削除しますか？')) {
      setPositions(positions.filter(pos => pos.id !== id));
    }
  };

  // レベル順でソート
  const sortedPositions = filteredPositions.sort((a, b) => a.level - b.level);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          役職管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => handleOpenDialog()}
        >
          新しい役職
        </Button>
      </Box>

      {/* 統計カード */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  総役職数
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {positions.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <BusinessCenter />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  最高月額コスト
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  ¥{Math.max(...positions.map(p => p.monthlyCost)).toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
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
                  平均月額コスト
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  ¥{Math.round(positions.reduce((sum, p) => sum + p.monthlyCost, 0) / positions.length).toLocaleString()}
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
                  総ユーザー数
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {positions.reduce((sum, p) => sum + p.userCount, 0)}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                <BusinessCenter />
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
            placeholder="役職名または説明で検索..."
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

      {/* 役職一覧テーブル */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            役職一覧
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>役職名</TableCell>
                  <TableCell>レベル</TableCell>
                  <TableCell>説明</TableCell>
                  <TableCell align="right">月額コスト</TableCell>
                  <TableCell align="right">時給</TableCell>
                  <TableCell align="center">ユーザー数</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPositions.map((position) => (
                  <TableRow key={position.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: position.color,
                          }}
                        />
                        <Typography variant="body2" fontWeight="medium">
                          {position.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`Lv.${position.level}`}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: position.color, color: position.color }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {position.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        ¥{position.monthlyCost.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        ¥{position.hourlyCost.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {position.userCount}人
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(position)}
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePosition(position.id)}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPosition ? '役職を編集' : '新しい役職を作成'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="役職名"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="レベル"
                type="number"
                sx={{ flex: 1 }}
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
                inputProps={{ min: 1, max: 10 }}
              />
              <TextField
                label="月額コスト"
                type="number"
                sx={{ flex: 1 }}
                value={formData.monthlyCost}
                onChange={(e) => setFormData({ ...formData, monthlyCost: e.target.value })}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                }}
              />
            </Box>
            <TextField
              label="説明"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label="カラー"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              sx={{ width: 100 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button
            onClick={handleSavePosition}
            variant="contained"
            disabled={!formData.name || !formData.monthlyCost || !formData.level}
          >
            {editingPosition ? '更新' : '作成'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}