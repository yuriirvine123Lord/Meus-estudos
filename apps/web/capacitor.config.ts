import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.opencut.app',
  appName: 'OpenCut',
  webDir: 'dist/client',
  server: {
    androidScheme: 'https',
  },
};

export default config;
