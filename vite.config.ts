import { defineConfig } from 'vite';
import RubyPlugin from 'vite-plugin-ruby';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@views': path.resolve(__dirname, 'app/views'),
      '@javascript': path.resolve(__dirname, 'app/javascript'),
      '@images': path.resolve(__dirname, 'app/assets/images'),
      '@stylesheets': path.resolve(__dirname, 'app/assets/stylesheets'),
    },
  },
  plugins: [RubyPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
  },
});
