/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/',
    name: '写作首页',
    component: './HomePage/index.tsx',
    icon: 'EditOutlined',
    access: 'canUser'
  },
  {
    path: '/Addtext',
    name: '对话窗口',
    component: './Addtext/index.tsx',
    icon: 'CommentOutlined',
    access: 'canUser'
  },
  {
    path: '/Study',
    name: '资源库',
    component: './Study/index.tsx',
    icon: 'HighlightOutlined',
    access: 'canUser'
  },
  {
    path: '/MaterialManage',
    name: '素材管理',
    component: './MaterialManage/index.tsx',
    icon: 'CopyOutlined',
    access: 'canUser'
  },
  {
    path: '/File',
    name: '我的文档',
    icon: 'FolderOpenOutlined',
    component: './File/index.tsx',
    access: 'canUser'
  },
  {
    path: '/History',
    name: '历史会话',
    component: './History/index.tsx',
    icon: 'FileSyncOutlined',
    access: 'canUser'
  },
  {
    path: '/Templet',
    name: '模板库',
    component: './Templet/index.tsx',
    icon: 'FileTextOutlined',
    access: 'canUser'
  },
  {
    path: '/Login',
    layout: false,
    component: './Login/index.tsx',
    routes: [
      {
        component: './Login/index.tsx',
      }
    ]
  },
  {
    path: '/longTexts/:id',
    layout: false, // 确保该页面不使用任何布局
    component: './LongTexts/index.tsx',
    access: 'canUser',
    routes: [
      {
        component: './LongTexts/index.tsx',
      }
    ]
  },
  {
    path: '/lookfile/:id',
    layout: false, // 确保该页面不使用任何布局
    component: './LookFile/index.tsx',
    access: 'canUser',
    routes: [
      {
        component: './LookFile/index.tsx',
      }
    ]
  },
  {
    path: '/aisearch',
    layout: false, // 确保该页面不使用任何布局
    component: './Aisearch/index.tsx',
    access: 'canUser',
    routes: [
      {
        component: './Aisearch/index.tsx',
      }
    ]
  },
  {
    path: '/lookExternalMaterial/:id',
    layout: false, // 确保该页面不使用任何布局
    component: './LookExternalMaterial/index.tsx',
    access: 'canUser',
    routes: [
      {
        component: './LookExternalMaterial/index.tsx',
      }
    ]
  },

  {
    path: '/Dictionary',
    name: '词典',
    // component: './Dictionary/Dictionary.tsx',
    icon: 'ReadOutlined',
    access: 'canUser',
    routes: [
      {
        path: '/Dictionary/Blacklist',
        name: '黑名单',
        component: './Dictionary/Blacklist.tsx',
        access: 'canUser',
        hideInBreadcrumb: true,
      },
      {
        path: '/Dictionary/FallibleWord',
        name: '易错词',
        component: './Dictionary/FallibleWord.tsx',
        access: 'canUser',
        hideInBreadcrumb: true,
      },
      {
        path: '/Dictionary/SensitiveWords',
        name: '敏感词',
        component: './Dictionary/SensitiveWords.tsx',
        access: 'canUser',
        hideInBreadcrumb: true,
      },
      {
        path: '/Dictionary/FallenOfficial',
        name: '落马官员',
        component: './Dictionary/FallenOfficial.tsx',
        access: 'canUser',
        hideInBreadcrumb: true,
      },
      {
        path: '/Dictionary/JobComparison',
        name: '职务对照',
        component: './Dictionary/JobComparison.tsx',
        access: 'canUser',
        hideInBreadcrumb: true,
      },
      {
        path: '/Dictionary/FocusWord',
        name: '重点关注词',
        component: './Dictionary/FocusWord.tsx',
        access: 'canUser',
        hideInBreadcrumb: true,
      },
      // {
      //   path: '/Dictionary/LawsAndRegulations',
      //   name: '法律法规',
      //   component: './Dictionary/LawsAndRegulations.tsx',
      //   access: 'canUser',
      //   hideInBreadcrumb: true,
      // },
      {
        path: '/Dictionary/FixedCollocation',
        name: '固定搭配',
        component: './Dictionary/FixedCollocation.tsx',
        access: 'canUser',
        hideInBreadcrumb: true,
      },
      {
        path: '/Dictionary/ImportantSpeech',
        name: '重要讲话',
        component: './Dictionary/ImportantSpeech.tsx',
        access: 'canUser',
        hideInBreadcrumb: true,
      },
      {
        path: '/Dictionary/Department',
        name: '部门机构',
        component: './Dictionary/Department.tsx',
        access: 'canUser',
        hideInBreadcrumb: true,
      },
    ]
  },
  {
    path: '/IndustryTerms',
    name: '行业术语库',
    component: './IndustryTerms/IndustryTerms.tsx',
    icon: 'ContainerOutlined',
    access: 'canUser'
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },

  {
    path: '/MaterialGrab',
    name: '素材抓取',
    component: './MaterialGrab/index.tsx',
    icon: 'DeploymentUnitOutlined',
    access: 'canAdmin'
  },
  {
    path: '/IndividualCenter',
    name: '个人中心',
    component: './IndividualCenter/index.tsx',
    icon: 'UserOutlined',
    access: 'canUser'
  },
  {
    path: '/HelpCenter',
    // name: '个人中心',
    component: './HelpCenter/HelpCenter.tsx',
    // icon: 'UserOutlined',
    access: 'canUser'
  },
];
