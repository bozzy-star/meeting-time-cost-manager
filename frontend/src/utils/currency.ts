// 通貨関連のユーティリティ関数

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  JPY: { code: 'JPY', symbol: '¥', name: '日本円', flag: '🇯🇵', locale: 'ja-JP' },
  USD: { code: 'USD', symbol: '$', name: '米ドル', flag: '🇺🇸', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'ユーロ', flag: '🇪🇺', locale: 'en-EU' },
  GBP: { code: 'GBP', symbol: '£', name: '英ポンド', flag: '🇬🇧', locale: 'en-GB' },
  CNY: { code: 'CNY', symbol: '¥', name: '人民元', flag: '🇨🇳', locale: 'zh-CN' },
  KRW: { code: 'KRW', symbol: '₩', name: '韓国ウォン', flag: '🇰🇷', locale: 'ko-KR' },
  THB: { code: 'THB', symbol: '฿', name: 'タイバーツ', flag: '🇹🇭', locale: 'th-TH' },
  VND: { code: 'VND', symbol: '₫', name: 'ベトナムドン', flag: '🇻🇳', locale: 'vi-VN' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'シンガポールドル', flag: '🇸🇬', locale: 'en-SG' },
  MYR: { code: 'MYR', symbol: 'RM', name: 'マレーシアリンギット', flag: '🇲🇾', locale: 'ms-MY' },
  INR: { code: 'INR', symbol: '₹', name: 'インドルピー', flag: '🇮🇳', locale: 'hi-IN' },
  AUD: { code: 'AUD', symbol: 'A$', name: '豪ドル', flag: '🇦🇺', locale: 'en-AU' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'カナダドル', flag: '🇨🇦', locale: 'en-CA' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'スイスフラン', flag: '🇨🇭', locale: 'de-CH' },
  HKD: { code: 'HKD', symbol: 'HK$', name: '香港ドル', flag: '🇭🇰', locale: 'zh-HK' },
  TWD: { code: 'TWD', symbol: 'NT$', name: '台湾ドル', flag: '🇹🇼', locale: 'zh-TW' },
};

/**
 * 通貨記号を取得
 */
export function getCurrencySymbol(currencyCode: string): string {
  return SUPPORTED_CURRENCIES[currencyCode]?.symbol || currencyCode;
}

/**
 * 通貨設定を取得
 */
export function getCurrencyConfig(currencyCode: string): CurrencyConfig | null {
  return SUPPORTED_CURRENCIES[currencyCode] || null;
}

/**
 * 金額を指定通貨でフォーマット
 */
export function formatCurrency(amount: number, currencyCode: string = 'JPY'): string {
  const config = getCurrencyConfig(currencyCode);
  
  if (!config) {
    return `${amount} ${currencyCode}`;
  }

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'JPY' || currencyCode === 'KRW' || currencyCode === 'VND' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'JPY' || currencyCode === 'KRW' || currencyCode === 'VND' ? 0 : 2,
    }).format(amount);
  } catch (error) {
    // フォールバック：記号 + 数値
    return `${config.symbol}${amount.toLocaleString()}`;
  }
}

/**
 * 金額を簡潔にフォーマット（記号のみ）
 */
export function formatCurrencyCompact(amount: number, currencyCode: string = 'JPY'): string {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toLocaleString()}`;
}

/**
 * サポートされている通貨のリストを取得
 */
export function getSupportedCurrencies(): CurrencyConfig[] {
  return Object.values(SUPPORTED_CURRENCIES);
}

/**
 * 通貨コードが有効かチェック
 */
export function isValidCurrency(currencyCode: string): boolean {
  return currencyCode in SUPPORTED_CURRENCIES;
}