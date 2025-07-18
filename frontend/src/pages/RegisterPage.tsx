import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  BusinessCenter,
  TrendingUp,
} from '@mui/icons-material';
import { useApi } from '../contexts/ApiContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useApi();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    
    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name) {
      newErrors.name = '名前は必須です';
    } else if (formData.name.length < 2) {
      newErrors.name = '名前は2文字以上で入力してください';
    }
    
    if (!formData.email) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.password) {
      newErrors.password = 'パスワードは必須です';
    } else if (formData.password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワード確認は必須です';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/'); // 登録成功後はダッシュボードへリダイレクト
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({
        general: error?.response?.data?.message || '登録に失敗しました。入力内容を確認してください。',
      });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', maxWidth: 1200, width: '100%', gap: 4 }}>
        {/* Left side - Branding */}
        <Paper
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <BusinessCenter sx={{ fontSize: 80, mb: 3 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Meeting TimeValue Pro
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            会議の時間価値を最大化する
          </Typography>
          
          <Stack spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUp />
              <Typography variant="body1">
                リアルタイム会議コスト計算
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessCenter />
              <Typography variant="body1">
                効率的な会議管理システム
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUp />
              <Typography variant="body1">
                詳細な分析レポート
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Right side - Registration Form */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                新規登録
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 4, textAlign: 'center' }}>
                アカウントを作成してください
              </Typography>

              {errors.general && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.general}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="名前"
                    type="text"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="メールアドレス"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="パスワード"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="パスワード確認"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      },
                    }}
                  >
                    {isLoading ? '登録中...' : '登録'}
                  </Button>
                </Stack>
              </form>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  すでにアカウントをお持ちの場合は{' '}
                  <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>
                    ログイン
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}