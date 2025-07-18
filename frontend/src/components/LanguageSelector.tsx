import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import {
  Language as LanguageIcon,
} from '@mui/icons-material';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

interface LanguageSelectorProps {
  variant?: 'full' | 'compact';
  showLabel?: boolean;
}

export default function LanguageSelector({ 
  variant = 'full', 
  showLabel = true 
}: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: any) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage);
  };

  if (variant === 'compact') {
    return (
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        variant="outlined"
        size="small"
        sx={{
          minWidth: 120,
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </Box>
          </MenuItem>
        ))}
      </Select>
    );
  }

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
      {showLabel && (
        <InputLabel id="language-select-label">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon fontSize="small" />
            Language
          </Box>
        </InputLabel>
      )}
      <Select
        labelId="language-select-label"
        value={i18n.language}
        onChange={handleLanguageChange}
        label={showLabel ? "Language" : undefined}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{lang.flag}</span>
              <Typography variant="body2">{lang.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}