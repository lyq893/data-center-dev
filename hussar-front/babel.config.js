module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ['@babel/plugin-proposal-optional-chaining'], // 解析 可选链式语法
    ...process.env.NODE_ENV === 'production' ? [['transform-remove-console', { exclude: ['info', 'error', 'warn'] }]] : []
  ]
};
