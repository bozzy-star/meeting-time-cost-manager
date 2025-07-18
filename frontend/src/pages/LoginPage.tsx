import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Visibility,
  VisibilityOff,
  BusinessCenter,
  TrendingUp,
} from '@mui/icons-material';
import { useApi } from '../contexts/ApiContext';
import LanguageSelector from '../components/LanguageSelector';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useApi();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  
  const [showPassword, setShowPassword] = useState(false);

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
    
    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.emailRequired');
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordMinLength');
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
      await login(formData.email, formData.password);
      navigate('/'); // ログイン成功後はダッシュボードへリダイレクト
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({
        general: error?.response?.data?.message || t('auth.loginError'),
      });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      {/* Language Selector */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
        <LanguageSelector variant="compact" showLabel={false} />
      </Box>
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
            {t('app.title')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            {t('app.subtitle')}
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

        {/* Right side - Login Form */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                {t('auth.login')}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 4, textAlign: 'center' }}>
                Please login to your account
              </Typography>

              {errors.general && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.general}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label={t('auth.email')}
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
                    label={t('auth.password')}
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
                    {isLoading ? t('common.loading') : t('auth.login')}
                  </Button>
                </Stack>
              </form>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: '#667eea', textDecoration: 'none' }}>
                    {t('auth.register')}
                  </Link>
                </Typography>
              </Box>

              {/* Demo credentials */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>
                  {t('auth.demoCredentials')}:
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  <strong>CEO:</strong> ceo@demo.com
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  <strong>Tech Manager:</strong> tech-manager@demo.com
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  <strong>Sales Manager:</strong> sales-manager@demo.com
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  <strong>Password:</strong> password123
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setFormData({
                      email: 'ceo@demo.com',
                      password: 'password123'
                    });
                  }}
                  sx={{ mt: 1, fontSize: '0.7rem' }}
                >
                  {t('auth.autoFillCeo')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}