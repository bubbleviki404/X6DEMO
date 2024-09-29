import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
import { resolve } from 'path';

const pathResolve = (dir: string): any => {
  return resolve(__dirname, '.', dir);
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '/@': pathResolve('./src/'), // 设置 `@` 指向 `src` 目录
    },
  },
  base: './', // 设置打包路径
  server: {
    host: '192.168.110.72',
    port: 4000, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域

    // 设置代理，根据我们项目实际情况配置
    proxy: {
      '/data': {
        target: 'http://192.168.110.39:8080/',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace('/apc/', '/')
      },
    },
  },
});
