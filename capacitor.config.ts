import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sagunika.cosmetics',
  appName: 'Sagunika Cosmetic',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
