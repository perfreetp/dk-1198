export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/record/index',
    'pages/analysis/index',
    'pages/goods/index',
    'pages/mine/index',
    'pages/compare/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF8C42',
    navigationBarTitleText: '宠物消费分析',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#909399',
    selectedColor: '#FF8C42',
    borderStyle: 'black',
    backgroundColor: '#ffffff',
    list: [
      { pagePath: 'pages/home/index', text: '首页' },
      { pagePath: 'pages/record/index', text: '记账' },
      { pagePath: 'pages/analysis/index', text: '分析' },
      { pagePath: 'pages/goods/index', text: '商品' },
      { pagePath: 'pages/mine/index', text: '我的' }
    ]
  }
})
