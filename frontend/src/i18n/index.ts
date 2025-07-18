import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻訳リソース
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.meetings': 'Meetings',
      'nav.analytics': 'Analytics',
      'nav.users': 'Users',
      'nav.settings': 'Settings',
      'nav.logout': 'Logout',

      // Common
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.create': 'Create',
      'common.loading': 'Loading...',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.export': 'Export',
      'common.import': 'Import',

      // Authentication
      'auth.login': 'Login',
      'auth.logout': 'Logout',
      'auth.register': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.firstName': 'First Name',
      'auth.lastName': 'Last Name',
      'auth.loginSuccess': 'Login successful',
      'auth.loginError': 'Login failed. Please check your email and password.',
      'auth.emailRequired': 'Email is required',
      'auth.passwordRequired': 'Password is required',
      'auth.passwordMinLength': 'Password must be at least 6 characters',
      'auth.demoCredentials': 'Demo Credentials',
      'auth.autoFillCeo': 'Auto-fill CEO Account',

      // Meeting TimeValue Pro
      'app.title': 'Meeting TimeValue Pro',
      'app.subtitle': 'Maximize Meeting Time Value',
      'app.description': 'Real-time meeting cost calculation and management system',

      // Meetings
      'meetings.title': 'Meetings',
      'meetings.create': 'Create Meeting',
      'meetings.list': 'Meeting List',
      'meetings.scheduled': 'Scheduled',
      'meetings.inProgress': 'In Progress',
      'meetings.completed': 'Completed',
      'meetings.cancelled': 'Cancelled',
      'meetings.startMeeting': 'Start Meeting',
      'meetings.endMeeting': 'End Meeting',
      'meetings.joinMeeting': 'Join Meeting',
      'meetings.leaveMeeting': 'Leave Meeting',
      'meetings.estimatedCost': 'Estimated Cost',
      'meetings.actualCost': 'Actual Cost',
      'meetings.duration': 'Duration',
      'meetings.participants': 'Participants',
      'meetings.organizer': 'Organizer',
      'meetings.meetingRoom': 'Meeting Room',
      'meetings.agenda': 'Agenda',
      'meetings.notes': 'Notes',

      // Meeting Tracker
      'tracker.title': 'Meeting Tracker',
      'tracker.elapsedTime': 'Elapsed Time',
      'tracker.currentCost': 'Current Cost',
      'tracker.participantCount': 'Participants',
      'tracker.costPerMinute': 'Cost per Minute',
      'tracker.hourlyRate': 'Hourly Rate',
      'tracker.totalCost': 'Total Cost',
      'tracker.addParticipant': 'Add Participant',
      'tracker.removeParticipant': 'Remove Participant',
      'tracker.costBreakdown': 'Cost Breakdown',
      'tracker.participantCosts': 'Participant Costs',
      'tracker.realTimeStats': 'Real-time Statistics',
      'tracker.meetingInfo': 'Meeting Information',

      // Analytics
      'analytics.title': 'Analytics',
      'analytics.overview': 'Overview',
      'analytics.costTrends': 'Cost Trends',
      'analytics.efficiency': 'Efficiency',
      'analytics.departmentAnalysis': 'Department Analysis',
      'analytics.meetingTypes': 'Meeting Types',
      'analytics.timeDistribution': 'Time Distribution',
      'analytics.costSavings': 'Cost Savings',
      'analytics.recommendations': 'Recommendations',

      // Users
      'users.title': 'Users',
      'users.profile': 'Profile',
      'users.role': 'Role',
      'users.department': 'Department',
      'users.hourlyRate': 'Hourly Rate',
      'users.status': 'Status',
      'users.lastLogin': 'Last Login',
      'users.createUser': 'Create User',
      'users.editUser': 'Edit User',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.todayMeetings': "Today's Meetings",
      'dashboard.totalCost': 'Total Cost',
      'dashboard.averageCost': 'Average Cost',
      'dashboard.efficiency': 'Efficiency',
      'dashboard.upcomingMeetings': 'Upcoming Meetings',
      'dashboard.recentActivity': 'Recent Activity',
      'dashboard.costTrends': 'Cost Trends',

      // Settings
      'settings.title': 'Settings',
      'settings.language': 'Language',
      'settings.currency': 'Currency',
      'settings.timezone': 'Timezone',
      'settings.notifications': 'Notifications',
      'settings.profile': 'Profile Settings',
      'settings.organization': 'Organization Settings',

      // Error Messages
      'error.general': 'An error occurred. Please try again.',
      'error.networkError': 'Network error. Please check your connection.',
      'error.unauthorized': 'You are not authorized to perform this action.',
      'error.notFound': 'The requested resource was not found.',
      'error.serverError': 'Server error. Please try again later.',

      // Success Messages
      'success.saved': 'Successfully saved',
      'success.deleted': 'Successfully deleted',
      'success.created': 'Successfully created',
      'success.updated': 'Successfully updated',
    }
  },
  ja: {
    translation: {
      // ナビゲーション
      'nav.dashboard': 'ダッシュボード',
      'nav.meetings': '会議',
      'nav.analytics': '分析',
      'nav.users': 'ユーザー',
      'nav.settings': '設定',
      'nav.logout': 'ログアウト',

      // 共通
      'common.save': '保存',
      'common.cancel': 'キャンセル',
      'common.delete': '削除',
      'common.edit': '編集',
      'common.create': '作成',
      'common.loading': '読み込み中...',
      'common.search': '検索',
      'common.filter': 'フィルター',
      'common.export': 'エクスポート',
      'common.import': 'インポート',

      // 認証
      'auth.login': 'ログイン',
      'auth.logout': 'ログアウト',
      'auth.register': '新規登録',
      'auth.email': 'メールアドレス',
      'auth.password': 'パスワード',
      'auth.confirmPassword': 'パスワード確認',
      'auth.firstName': '名',
      'auth.lastName': '姓',
      'auth.loginSuccess': 'ログインしました',
      'auth.loginError': 'ログインに失敗しました。メールアドレスとパスワードを確認してください。',
      'auth.emailRequired': 'メールアドレスは必須です',
      'auth.passwordRequired': 'パスワードは必須です',
      'auth.passwordMinLength': 'パスワードは6文字以上で入力してください',
      'auth.demoCredentials': 'デモ用アカウント',
      'auth.autoFillCeo': 'CEOアカウントで自動入力',

      // Meeting TimeValue Pro
      'app.title': 'Meeting TimeValue Pro',
      'app.subtitle': '会議の時間価値を最大化する',
      'app.description': 'リアルタイム会議コスト計算・管理システム',

      // 会議
      'meetings.title': '会議',
      'meetings.create': '会議作成',
      'meetings.list': '会議一覧',
      'meetings.scheduled': '予定',
      'meetings.inProgress': '進行中',
      'meetings.completed': '完了',
      'meetings.cancelled': 'キャンセル',
      'meetings.startMeeting': '会議開始',
      'meetings.endMeeting': '会議終了',
      'meetings.joinMeeting': '会議参加',
      'meetings.leaveMeeting': '会議退出',
      'meetings.estimatedCost': '予想コスト',
      'meetings.actualCost': '実際のコスト',
      'meetings.duration': '時間',
      'meetings.participants': '参加者',
      'meetings.organizer': '主催者',
      'meetings.meetingRoom': '会議室',
      'meetings.agenda': 'アジェンダ',
      'meetings.notes': 'メモ',

      // 会議トラッカー
      'tracker.title': '会議トラッカー',
      'tracker.elapsedTime': '経過時間',
      'tracker.currentCost': '現在のコスト',
      'tracker.participantCount': '参加者数',
      'tracker.costPerMinute': '1分あたりコスト',
      'tracker.hourlyRate': '時給',
      'tracker.totalCost': '総コスト',
      'tracker.addParticipant': '参加者追加',
      'tracker.removeParticipant': '参加者削除',
      'tracker.costBreakdown': 'コスト詳細',
      'tracker.participantCosts': '参加者別コスト',
      'tracker.realTimeStats': 'リアルタイム統計',
      'tracker.meetingInfo': '会議情報',

      // 分析
      'analytics.title': '分析',
      'analytics.overview': '概要',
      'analytics.costTrends': 'コストトレンド',
      'analytics.efficiency': '効率性',
      'analytics.departmentAnalysis': '部署別分析',
      'analytics.meetingTypes': '会議種別',
      'analytics.timeDistribution': '時間分布',
      'analytics.costSavings': 'コスト削減',
      'analytics.recommendations': '推奨事項',

      // ユーザー
      'users.title': 'ユーザー',
      'users.profile': 'プロフィール',
      'users.role': '役職',
      'users.department': '部署',
      'users.hourlyRate': '時給',
      'users.status': 'ステータス',
      'users.lastLogin': '最終ログイン',
      'users.createUser': 'ユーザー作成',
      'users.editUser': 'ユーザー編集',

      // ダッシュボード
      'dashboard.title': 'ダッシュボード',
      'dashboard.todayMeetings': '今日の会議',
      'dashboard.totalCost': '総コスト',
      'dashboard.averageCost': '平均コスト',
      'dashboard.efficiency': '効率性',
      'dashboard.upcomingMeetings': '予定されている会議',
      'dashboard.recentActivity': '最近の活動',
      'dashboard.costTrends': 'コストトレンド',

      // 設定
      'settings.title': '設定',
      'settings.language': '言語',
      'settings.currency': '通貨',
      'settings.timezone': 'タイムゾーン',
      'settings.notifications': '通知',
      'settings.profile': 'プロフィール設定',
      'settings.organization': '組織設定',

      // エラーメッセージ
      'error.general': 'エラーが発生しました。もう一度お試しください。',
      'error.networkError': 'ネットワークエラーです。接続を確認してください。',
      'error.unauthorized': 'この操作を実行する権限がありません。',
      'error.notFound': '要求されたリソースが見つかりません。',
      'error.serverError': 'サーバーエラーです。しばらくしてからお試しください。',

      // 成功メッセージ
      'success.saved': '保存しました',
      'success.deleted': '削除しました',
      'success.created': '作成しました',
      'success.updated': '更新しました',
    }
  },
  zh: {
    translation: {
      // 导航
      'nav.dashboard': '仪表板',
      'nav.meetings': '会议',
      'nav.analytics': '分析',
      'nav.users': '用户',
      'nav.settings': '设置',
      'nav.logout': '退出',

      // 通用
      'common.save': '保存',
      'common.cancel': '取消',
      'common.delete': '删除',
      'common.edit': '编辑',
      'common.create': '创建',
      'common.loading': '加载中...',
      'common.search': '搜索',
      'common.filter': '筛选',
      'common.export': '导出',
      'common.import': '导入',

      // 身份验证
      'auth.login': '登录',
      'auth.logout': '退出',
      'auth.register': '注册',
      'auth.email': '邮箱',
      'auth.password': '密码',
      'auth.confirmPassword': '确认密码',
      'auth.firstName': '名字',
      'auth.lastName': '姓氏',
      'auth.loginSuccess': '登录成功',
      'auth.loginError': '登录失败。请检查您的邮箱和密码。',
      'auth.emailRequired': '邮箱是必填项',
      'auth.passwordRequired': '密码是必填项',
      'auth.passwordMinLength': '密码至少需要6个字符',
      'auth.demoCredentials': '演示账户',
      'auth.autoFillCeo': '自动填充CEO账户',

      // Meeting TimeValue Pro
      'app.title': 'Meeting TimeValue Pro',
      'app.subtitle': '最大化会议时间价值',
      'app.description': '实时会议成本计算和管理系统',

      // 会议
      'meetings.title': '会议',
      'meetings.create': '创建会议',
      'meetings.list': '会议列表',
      'meetings.scheduled': '已安排',
      'meetings.inProgress': '进行中',
      'meetings.completed': '已完成',
      'meetings.cancelled': '已取消',
      'meetings.startMeeting': '开始会议',
      'meetings.endMeeting': '结束会议',
      'meetings.joinMeeting': '加入会议',
      'meetings.leaveMeeting': '离开会议',
      'meetings.estimatedCost': '预估成本',
      'meetings.actualCost': '实际成本',
      'meetings.duration': '时长',
      'meetings.participants': '参与者',
      'meetings.organizer': '组织者',
      'meetings.meetingRoom': '会议室',
      'meetings.agenda': '议程',
      'meetings.notes': '备注',

      // 会议跟踪器
      'tracker.title': '会议跟踪器',
      'tracker.elapsedTime': '已用时间',
      'tracker.currentCost': '当前成本',
      'tracker.participantCount': '参与者数量',
      'tracker.costPerMinute': '每分钟成本',
      'tracker.hourlyRate': '时薪',
      'tracker.totalCost': '总成本',
      'tracker.addParticipant': '添加参与者',
      'tracker.removeParticipant': '移除参与者',
      'tracker.costBreakdown': '成本明细',
      'tracker.participantCosts': '参与者成本',
      'tracker.realTimeStats': '实时统计',
      'tracker.meetingInfo': '会议信息',

      // 分析
      'analytics.title': '分析',
      'analytics.overview': '概览',
      'analytics.costTrends': '成本趋势',
      'analytics.efficiency': '效率',
      'analytics.departmentAnalysis': '部门分析',
      'analytics.meetingTypes': '会议类型',
      'analytics.timeDistribution': '时间分布',
      'analytics.costSavings': '成本节约',
      'analytics.recommendations': '建议',

      // 用户
      'users.title': '用户',
      'users.profile': '个人资料',
      'users.role': '角色',
      'users.department': '部门',
      'users.hourlyRate': '时薪',
      'users.status': '状态',
      'users.lastLogin': '最后登录',
      'users.createUser': '创建用户',
      'users.editUser': '编辑用户',

      // 仪表板
      'dashboard.title': '仪表板',
      'dashboard.todayMeetings': '今日会议',
      'dashboard.totalCost': '总成本',
      'dashboard.averageCost': '平均成本',
      'dashboard.efficiency': '效率',
      'dashboard.upcomingMeetings': '即将到来的会议',
      'dashboard.recentActivity': '最近活动',
      'dashboard.costTrends': '成本趋势',

      // 设置
      'settings.title': '设置',
      'settings.language': '语言',
      'settings.currency': '货币',
      'settings.timezone': '时区',
      'settings.notifications': '通知',
      'settings.profile': '个人资料设置',
      'settings.organization': '组织设置',

      // 错误消息
      'error.general': '发生错误。请重试。',
      'error.networkError': '网络错误。请检查您的连接。',
      'error.unauthorized': '您无权执行此操作。',
      'error.notFound': '未找到请求的资源。',
      'error.serverError': '服务器错误。请稍后重试。',

      // 成功消息
      'success.saved': '保存成功',
      'success.deleted': '删除成功',
      'success.created': '创建成功',
      'success.updated': '更新成功',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

export default i18n;