import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  Stack,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
} from '@mui/material';
import {
  Settings,
  Business,
  AttachMoney,
  Notifications,
  Link,
  Save,
  Add,
  Delete,
  VideoCall,
  Email,
  Phone,
  Webhook,
} from '@mui/icons-material';
import { getCurrencySymbol, getSupportedCurrencies } from '../utils/currency';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}


export default function SettingsPage() {
  const [currentTab, setCurrentTab] = useState(0);
  
  // 組織設定
  const [organizationSettings, setOrganizationSettings] = useState({
    name: 'Meeting TimeValue Pro株式会社',
    address: '東京都渋谷区神南1-1-1',
    phone: '03-1234-5678',
    email: 'contact@meetingtimevalue.com',
    website: 'https://meetingtimevalue.com',
    timezone: 'Asia/Tokyo',
    currency: 'JPY',
    fiscalYearStart: '04-01',
  });

  // コスト設定
  const [costSettings, setCostSettings] = useState({
    currency: 'JPY',
    defaultWorkingHours: 160,
    overtimeMultiplier: 1.25,
    holidayMultiplier: 1.5,
    taxRate: 0.1,
    socialInsuranceRate: 0.15,
    facilityHourlyCost: 500,
    utilityHourlyCost: 200,
  });

  // 通知設定
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    slackNotifications: false,
    webPushNotifications: true,
    meetingStartAlert: true,
    costThresholdAlert: true,
    dailyReport: true,
    weeklyReport: true,
    monthlyReport: false,
    costThreshold: 100000,
    slackWebhookUrl: '',
  });

  // 連携設定
  const [integrationSettings, setIntegrationSettings] = useState({
    googleMeetEnabled: false,
    zoomEnabled: false,
    teamsEnabled: false,
    slackEnabled: false,
    googleCalendarEnabled: false,
    outlookEnabled: false,
    // API設定
    googleMeetApiKey: '',
    zoomApiKey: '',
    zoomApiSecret: '',
    slackBotToken: '',
    googleCalendarClientId: '',
    outlookClientId: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSaveSettings = () => {
    // 設定保存のロジック（APIコール等）
    alert('設定を保存しました！');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          設定
        </Typography>
        <Button
          variant="contained"
          startIcon={<Save />}
          size="large"
          onClick={handleSaveSettings}
        >
          設定を保存
        </Button>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="設定タブ">
            <Tab icon={<Business />} label="組織設定" {...a11yProps(0)} />
            <Tab icon={<AttachMoney />} label="コスト設定" {...a11yProps(1)} />
            <Tab icon={<Notifications />} label="通知設定" {...a11yProps(2)} />
            <Tab icon={<Link />} label="連携設定" {...a11yProps(3)} />
          </Tabs>
        </Box>

        {/* 組織設定タブ */}
        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            組織情報
          </Typography>
          
          <Stack spacing={3}>
            <TextField
              label="組織名"
              fullWidth
              value={organizationSettings.name}
              onChange={(e) => setOrganizationSettings({ ...organizationSettings, name: e.target.value })}
            />
            
            <TextField
              label="住所"
              fullWidth
              multiline
              rows={2}
              value={organizationSettings.address}
              onChange={(e) => setOrganizationSettings({ ...organizationSettings, address: e.target.value })}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="電話番号"
                sx={{ flex: 1 }}
                value={organizationSettings.phone}
                onChange={(e) => setOrganizationSettings({ ...organizationSettings, phone: e.target.value })}
              />
              <TextField
                label="メールアドレス"
                type="email"
                sx={{ flex: 1 }}
                value={organizationSettings.email}
                onChange={(e) => setOrganizationSettings({ ...organizationSettings, email: e.target.value })}
              />
            </Box>
            
            <TextField
              label="ウェブサイト"
              fullWidth
              value={organizationSettings.website}
              onChange={(e) => setOrganizationSettings({ ...organizationSettings, website: e.target.value })}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>タイムゾーン</InputLabel>
                <Select
                  value={organizationSettings.timezone}
                  label="タイムゾーン"
                  onChange={(e) => setOrganizationSettings({ ...organizationSettings, timezone: e.target.value })}
                >
                  <MenuItem value="Asia/Tokyo">Asia/Tokyo (JST)</MenuItem>
                  <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                  <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                  <MenuItem value="Asia/Shanghai">Asia/Shanghai (CST)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>通貨</InputLabel>
                <Select
                  value={organizationSettings.currency}
                  label="通貨"
                  onChange={(e) => setOrganizationSettings({ ...organizationSettings, currency: e.target.value })}
                >
                  <MenuItem value="JPY">日本円 (JPY)</MenuItem>
                  <MenuItem value="USD">米ドル (USD)</MenuItem>
                  <MenuItem value="EUR">ユーロ (EUR)</MenuItem>
                  <MenuItem value="CNY">人民元 (CNY)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label="会計年度開始月日"
              type="date"
              value={organizationSettings.fiscalYearStart}
              onChange={(e) => setOrganizationSettings({ ...organizationSettings, fiscalYearStart: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </TabPanel>

        {/* コスト設定タブ */}
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            コスト計算設定
          </Typography>
          
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  基本設定
                </Typography>
                
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>通貨単位</InputLabel>
                    <Select
                      value={costSettings.currency}
                      label="通貨単位"
                      onChange={(e) => setCostSettings({ ...costSettings, currency: e.target.value })}
                    >
                      {getSupportedCurrencies().map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                          {currency.flag} {currency.name} ({currency.code}) - {currency.symbol}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    label="月間標準労働時間（時間）"
                    type="number"
                    value={costSettings.defaultWorkingHours}
                    onChange={(e) => setCostSettings({ ...costSettings, defaultWorkingHours: parseInt(e.target.value) })}
                    helperText="月給から時給を計算する際の基準時間"
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="残業割増率"
                      type="number"
                      sx={{ flex: 1 }}
                      value={costSettings.overtimeMultiplier}
                      onChange={(e) => setCostSettings({ ...costSettings, overtimeMultiplier: parseFloat(e.target.value) })}
                      inputProps={{ step: 0.01, min: 1 }}
                    />
                    <TextField
                      label="休日割増率"
                      type="number"
                      sx={{ flex: 1 }}
                      value={costSettings.holidayMultiplier}
                      onChange={(e) => setCostSettings({ ...costSettings, holidayMultiplier: parseFloat(e.target.value) })}
                      inputProps={{ step: 0.01, min: 1 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  税金・社会保険
                </Typography>
                
                <Stack spacing={2}>
                  <TextField
                    label="税率"
                    type="number"
                    value={costSettings.taxRate}
                    onChange={(e) => setCostSettings({ ...costSettings, taxRate: parseFloat(e.target.value) })}
                    inputProps={{ step: 0.01, min: 0, max: 1 }}
                    helperText="0.1 = 10%"
                  />
                  
                  <TextField
                    label="社会保険料率"
                    type="number"
                    value={costSettings.socialInsuranceRate}
                    onChange={(e) => setCostSettings({ ...costSettings, socialInsuranceRate: parseFloat(e.target.value) })}
                    inputProps={{ step: 0.01, min: 0, max: 1 }}
                    helperText="0.15 = 15%"
                  />
                </Stack>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  施設・設備コスト
                </Typography>
                
                <Stack spacing={2}>
                  <TextField
                    label={`施設利用料（時間あたり・${costSettings.currency}）`}
                    type="number"
                    value={costSettings.facilityHourlyCost}
                    onChange={(e) => setCostSettings({ ...costSettings, facilityHourlyCost: parseInt(e.target.value) })}
                    helperText={`会議室、設備の利用コスト（${getCurrencySymbol(costSettings.currency)}）`}
                  />
                  
                  <TextField
                    label={`光熱費（時間あたり・${costSettings.currency}）`}
                    type="number"
                    value={costSettings.utilityHourlyCost}
                    onChange={(e) => setCostSettings({ ...costSettings, utilityHourlyCost: parseInt(e.target.value) })}
                    helperText={`電気、冷暖房、インターネット等（${getCurrencySymbol(costSettings.currency)}）`}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </TabPanel>

        {/* 通知設定タブ */}
        <TabPanel value={currentTab} index={2}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            通知設定
          </Typography>
          
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  通知方法
                </Typography>
                
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                      />
                    }
                    label="メール通知"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.webPushNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, webPushNotifications: e.target.checked })}
                      />
                    }
                    label="ブラウザプッシュ通知"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.slackNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, slackNotifications: e.target.checked })}
                      />
                    }
                    label="Slack通知"
                  />
                  
                  {notificationSettings.slackNotifications && (
                    <TextField
                      label="Slack Webhook URL"
                      fullWidth
                      value={notificationSettings.slackWebhookUrl}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, slackWebhookUrl: e.target.value })}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  通知タイミング
                </Typography>
                
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.meetingStartAlert}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, meetingStartAlert: e.target.checked })}
                      />
                    }
                    label="会議開始アラート"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.costThresholdAlert}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, costThresholdAlert: e.target.checked })}
                      />
                    }
                    label="コスト閾値アラート"
                  />
                  
                  {notificationSettings.costThresholdAlert && (
                    <TextField
                      label={`アラート閾値（${costSettings.currency}）`}
                      type="number"
                      value={notificationSettings.costThreshold}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, costThreshold: parseInt(e.target.value) })}
                      helperText={`この金額（${getCurrencySymbol(costSettings.currency)}）を超えたらアラートを送信`}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  定期レポート
                </Typography>
                
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.dailyReport}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, dailyReport: e.target.checked })}
                      />
                    }
                    label="日次レポート"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.weeklyReport}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReport: e.target.checked })}
                      />
                    }
                    label="週次レポート"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.monthlyReport}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, monthlyReport: e.target.checked })}
                      />
                    }
                    label="月次レポート"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </TabPanel>

        {/* 連携設定タブ */}
        <TabPanel value={currentTab} index={3}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            外部サービス連携
          </Typography>
          
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  ビデオ会議システム
                </Typography>
                
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <VideoCall color="primary" />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">Google Meet</Typography>
                        <Typography variant="caption" color="textSecondary">
                          会議の自動作成・参加者管理
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={integrationSettings.googleMeetEnabled}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, googleMeetEnabled: e.target.checked })}
                    />
                  </Box>
                  
                  {integrationSettings.googleMeetEnabled && (
                    <TextField
                      label="Google Meet API Key"
                      fullWidth
                      value={integrationSettings.googleMeetApiKey}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, googleMeetApiKey: e.target.value })}
                      type="password"
                    />
                  )}
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <VideoCall color="info" />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">Zoom</Typography>
                        <Typography variant="caption" color="textSecondary">
                          会議の自動作成・録画管理
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={integrationSettings.zoomEnabled}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, zoomEnabled: e.target.checked })}
                    />
                  </Box>
                  
                  {integrationSettings.zoomEnabled && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Zoom API Key"
                        sx={{ flex: 1 }}
                        value={integrationSettings.zoomApiKey}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, zoomApiKey: e.target.value })}
                        type="password"
                      />
                      <TextField
                        label="Zoom API Secret"
                        sx={{ flex: 1 }}
                        value={integrationSettings.zoomApiSecret}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, zoomApiSecret: e.target.value })}
                        type="password"
                      />
                    </Box>
                  )}
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <VideoCall color="secondary" />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">Microsoft Teams</Typography>
                        <Typography variant="caption" color="textSecondary">
                          会議の自動作成・チャット連携
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={integrationSettings.teamsEnabled}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, teamsEnabled: e.target.checked })}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  カレンダー連携
                </Typography>
                
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Business color="primary" />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">Google Calendar</Typography>
                        <Typography variant="caption" color="textSecondary">
                          カレンダーからの会議情報取得
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={integrationSettings.googleCalendarEnabled}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, googleCalendarEnabled: e.target.checked })}
                    />
                  </Box>
                  
                  {integrationSettings.googleCalendarEnabled && (
                    <TextField
                      label="Google Calendar Client ID"
                      fullWidth
                      value={integrationSettings.googleCalendarClientId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, googleCalendarClientId: e.target.value })}
                    />
                  )}
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Email color="info" />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">Outlook Calendar</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Outlookカレンダーとの同期
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={integrationSettings.outlookEnabled}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, outlookEnabled: e.target.checked })}
                    />
                  </Box>
                  
                  {integrationSettings.outlookEnabled && (
                    <TextField
                      label="Outlook Client ID"
                      fullWidth
                      value={integrationSettings.outlookClientId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, outlookClientId: e.target.value })}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
            
            <Alert severity="info">
              <Typography variant="body2">
                外部サービスとの連携には、各サービスでのAPI設定が必要です。詳細はドキュメントをご確認ください。
              </Typography>
            </Alert>
          </Stack>
        </TabPanel>
      </Card>
    </Box>
  );
}