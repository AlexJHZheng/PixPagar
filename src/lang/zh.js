import { date } from 'jszip/lib/defaults'

export default {
  route: {
    dashboard: '首页',
    pix: 'Pix收款',
    payflow: '收款情况',
    paycount: '店铺对账',
    shopcount: '总帐对账'
  },
  dashboard: {
    pixrecive: 'Pix中央收款系统',
    notica: '巴西银行系统当前不稳定，本系统现在处于维护状态，请等候通知再使用',
    com1: '1. 本系统是一个中央收款系统，用于接收各个业务系统的支付请求，统一处理。',
    com2: '2. 本系统即时查询，方便自行查看到账情况，避免假小票欺诈。',
    com3: '3. 本系全自动对账，自动汇总每天流水总额，方便快捷。',
    com4: '4. 本系统方便店家收银，分散风险，减少店家财税风险。'
  },
  pix: {
    painel: 'PIX 收银台',
    pedido: '订单号',
    client: '客户',
    obs: '备注',
    valor: '金额',
    geraqr: '生成收款码',
    notice: '提示',
    comformvalor: '确认收款金额为',
    comfirm: '确认',
    cancel: '取消',
    reciveclean: '收款成功,点击确定清除界面',
    notrecive: '收款还未到账，请重新查询',
    min10: '10分钟',
    min30: '30分钟',
    hora4: '4小时',
    hora12: '12小时',
    query: '查询收款状态',
    clean: '清除',
    newquery: '生成新收款单',
    errorvalor: '请输入正确的金额'
  },
  flow: {
    timerange: '时间范围',
    to: '至',
    starttime: '开始时间',
    endtime: '结束时间',
    query: '查询',
    codico: '编号',
    date: '日期',
    shop: '店铺',
    client: '客户',
    summary: '备注',
    status: '状态',
    operar: '操作',
    recived: '已收款',
    notrecive: '未收款',
    parcel: '部分付款',
    cancel: '取消',
    return: '返回',
    experid: '过期',
    qrcode: '收款码',
    delete: '删除'
  },
  paycount: {
    custom: '自定义',
    today: '今天',
    yesterday: '昨天',
    last7: '最近7天',
    last30: '最近30天',
    total: '总计'
  },
  navbar: {
    dashboard: '首页',
    logOut: '退出登录',
    theme: '换肤',
    size: '布局大小'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！'
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    addRole: '新增角色',
    editPermission: '编辑权限',
    roles: '你的权限',
    switchRoles: '切换权限',
    tips: '在某些情况下，不适合使用 v-permission。例如：Element-UI 的 el-tab 或 el-table-column 以及其它动态渲染 dom 的场景。你只能通过手动设置 v-if 来实现。',
    delete: '删除',
    confirm: '确定',
    cancel: '取消'
  },
  guide: {
    description:
      '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  components: {
    documentation: '文档',
    tinymceTips:
      '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips:
      '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2:
      '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips:
      '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  table: {
    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    type: '类型',
    remark: '点评',
    search: '搜索',
    add: '添加',
    export: '导出',
    reviewer: '审核人',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定'
  },
  example: {
    warning:
      '创建和编辑页面是不能被 keep-alive 缓存的，因为keep-alive 的 include 目前不支持根据路由来缓存，所以目前都是基于 component name 来进行缓存的。如果你想类似的实现缓存效果，可以使用 localStorage 等浏览器缓存方案。或者不要使用 keep-alive 的 include，直接缓存所有页面。详情见'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description:
      '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',
    placeholder: '请输入文件名(默认file)'
  },
  pdf: {
    tips: '这里使用   window.print() 来实现下载pdf的功能'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  }
}
