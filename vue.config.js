module.exports = {
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/payapi': {
        target: 'https://api.nihaopay.com/v1.2',
        changeOrigin: true,
        pathRewrite: {
          '^/payapi': ''
        }
      },
      '/getWeight': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        pathRewrite: {
          '^/getWeight': ''
        }
      },
    }
  }
}
