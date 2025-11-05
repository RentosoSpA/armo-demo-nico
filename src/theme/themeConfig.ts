import type { ThemeConfig } from 'antd';

export const customTheme: ThemeConfig = {
  token: {
    // Primary colors
    colorPrimary: '#33F491',
    colorPrimaryHover: '#4d8a92',
    colorPrimaryActive: '#3d6f75',

    // Background colors
    colorBgContainer: '#1b2a3a',
    colorBgElevated: '#0f133d',

    // Text colors
    colorText: '#ffffff',
    colorTextSecondary: '#6b7280',

    // Border colors
    colorBorder: '#e0e0e0',

    // Success, Warning, Error colors
    colorSuccess: '#22C55E',
    colorWarning: '#EAB308',
    colorError: '#F43F5E',

    // Font family
    fontFamily: "'Poppins', sans-serif",
  },
  components: {
    Menu: {
      itemSelectedBg: '#E8FEF1',
      itemSelectedColor: '#22f477',
    },
    Button: {
      colorPrimary: '#33F491',
      colorPrimaryHover: '#89f5be',
      defaultHoverColor: '#FFFFFF',
      defaultHoverBorderColor: '#E0E0E0',
      defaultHoverBg: '#D68EED',
      textHoverBg: '#D68EED',
      textTextHoverColor: '#FFFFFF',
    },
    Progress: {
      defaultColor: '#33F491',
    },
    Radio: {
      colorPrimary: '#33F491',
      colorPrimaryHover: '#33F491CC',
    },
    Table: {
      colorTextPlaceholder: '#9CA3AF',
    },
    Empty: {
      colorTextDescription: '#9CA3AF',
    },
  },
};
