import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Plugin to copy CSS file after build
const copyCssPlugin = () => ({
  name: 'copy-css',
  closeBundle() {
    if (!existsSync('dist')) {
      mkdirSync('dist', { recursive: true });
    }
    copyFileSync('src/styles.css', 'dist/styles.css');
  },
});

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib';

  return {
    plugins: [
      react(),
      isLib &&
        dts({
          include: ['src'],
          exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
          rollupTypes: true,
        }),
      isLib && copyCssPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: isLib
      ? {
          lib: {
            entry: resolve(__dirname, 'src/index.tsx'),
            name: 'PHBComponents',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
                'react/jsx-runtime': 'jsxRuntime',
              },
            },
          },
          cssCodeSplit: false,
        }
      : {},
  };
});
