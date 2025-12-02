export default {
  expo: {
    name: 'fitpass-app',
    slug: 'fitpass-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      }
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      EXPO_PUBLIC_API: process.env.EXPO_PUBLIC_API || 'http://192.168.1.13:3001/api',
      EXPO_PUBLIC_WS: process.env.EXPO_PUBLIC_WS || 'ws://192.168.1.13:3001/ws'
    },
    plugins: ['expo-build-properties']
  }
};