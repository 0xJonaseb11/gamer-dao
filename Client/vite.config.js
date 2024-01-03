import react from '@vitejs/plugin-react';
import path from 'path';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = env.NODE_ENV === 'production';
  const isAnalyze = env.VITE_MODE === 'analyze';

  return {
    plugins: [
      react(),
      !isProduction && checker({ typescript: true }),
      !isProduction && eslint(),
      isAnalyze && visualizer({ open: true }),
    ],
    optimizeDeps: {
      esbuildOptions: {
        define: { global: 'globalThis' },
      },
    },
    resolve: {
      preserveSymlinks: true,
      alias: {
        web3: 'web3/dist/web3.min.js',
        stream: 'stream-browserify',
        process: 'process/browser',
        zlib: 'browserify-zlib',
        util: 'util',
        // HACK: https://github.com/webpack/webpack/issues/12197
        'react-bootstrap-table2-toolkit': 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit',
        assets: path.resolve(__dirname, './src/assets'),
        components: path.resolve(__dirname, './src/components'),
        constants: path.resolve(__dirname, './src/constants'),
        contracts: path.resolve(__dirname, './src/contracts'),
        artifacts: path.resolve(__dirname, './src/artifacts'),
        utils: path.resolve(__dirname, './src/utils'),
        helpers: path.resolve(__dirname, './src/helpers'),
        errors: path.resolve(__dirname, './src/errors'),
        hooks: path.resolve(__dirname, './src/hooks'),
        json: path.resolve(__dirname, './src/json'),
        navigation: path.resolve(__dirname, './src/navigation'),
        pages: path.resolve(__dirname, './src/pages'),
        store: path.resolve(__dirname, './src/store'),
        i18n: path.resolve(__dirname, './src/i18n'),
        connectors: path.resolve(__dirname, './src/connectors'),
        context: path.resolve(__dirname, './src/context'),
        ui: path.resolve(__dirname, './src/ui'),
        styles: path.resolve(__dirname, './src/styles'),
        locales: path.resolve(__dirname, './src/locales'),
      },
    },
    build: {
      target: ['es2020'],
      rollupOptions: {
        output: {
          manualChunks: {
            q_gdk_sdk: ['@q-dev/gdk-sdk'],
            q_ui_kit: ['@q-dev/q-ui-kit'],
          }
        },
        plugins: [
          nodePolyfills()
        ]
      }
    }
  };
});
