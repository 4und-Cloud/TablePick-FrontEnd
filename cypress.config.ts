// cypress.config.js
import { defineConfig } from "cypress";
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const path = require('path'); // path 모듈 추가

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const options = {
        webpackOptions: {
          resolve: {
            extensions: ['.ts', '.js', '.jsx', '.tsx'],
            alias: {
              // 🚨 이 부분에 alias 설정 추가 🚨
              '@': path.resolve(__dirname, './src'), // @가 src 폴더를 가리키도록 설정
              // 만약 @shared가 직접적인 별칭이라면:
              // '@shared': path.resolve(__dirname, './src/@shared'),
              // 또는 더 일반적인 @ 설정이 맞을 가능성이 높습니다.
            },
          },
          module: {
            rules: [
              {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                  },
                },
              },
              {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: 'asset/resource',
              },
              {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
              },
            ],
          },
        },
      };
      on('file:preprocessor', webpackPreprocessor(options));

      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:5173', // 여러분의 프론트엔드 서버 주소
  },
});