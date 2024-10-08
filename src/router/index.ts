import { createRouter, createWebHistory } from 'vue-router';
import C_DB from '../components/C_DB.vue';

const responseData_1 = {
  nodes: [
    {
      id: '6231139901000023075',
      label: '吴苹',
    },
    {
      id: '622908398178980019',
      label: '刘京',
    },
    {
      id: '6222021001037345441',
      label: '欧文才',
    },
    {
      id: '6228480086300701975',
      label: '李璇',
    },
    {
      id: '62262289035973856226',
      label: '彭孝英',
    },
    {
      id: '6228480088424598873',
      label: '陈红',
    },
    {
      id: '6228480086109452374',
      label: '王英霖',
    },
    {
      id: '18272179',
      label: '上海哈啰普惠科技有限公司',
    },
    {
      id: '2088002822573801',
      label: '王桂香',
    },
    {
      id: '6230580000058864633',
      label: '孙亚涛',
    },
  ],
  edges: {
    money: [
      {
        from: '622908398178980019',
        to: '6231139901000023075',
        amount: 297000.0,
        count: 3,
        startDate: '2024-01-04 23:22:26',
        endDate: '2024-01-05 06:59:39',
      },
      {
        from: '6228480086109452374',
        to: '6231139901000023075',
        amount: 363908.0,
        count: 4,
        startDate: '2023-11-04 12:35:26',
        endDate: '2024-01-31 00:29:35',
      },
      {
        from: '6222021001037345441',
        to: '6231139901000023075',
        amount: 6227.0,
        count: 1,
        startDate: '2023-11-27 14:02:55',
        endDate: '2023-11-27 14:02:55',
      },
      {
        from: '62262289035973856226',
        to: '6231139901000023075',
        amount: 210432.0,
        count: 10,
        startDate: '2023-09-16 23:48:54',
        endDate: '2023-11-24 07:30:50',
      },
      {
        from: '6231139901000023075',
        to: '622908398178980019',
        amount: 50000.0,
        count: 1,
        startDate: '2023-09-11 16:29:09',
        endDate: '2023-09-11 16:29:09',
      },
      {
        from: '6231139901000023075',
        to: '6228480088424598873',
        amount: 60694.0,
        count: 2,
        startDate: '2024-01-16 15:35:50',
        endDate: '2024-01-16 15:40:00',
      },
      {
        from: '6231139901000023075',
        to: '6228480086300701975',
        amount: 61779.0,
        count: 3,
        startDate: '2024-01-29 14:55:15',
        endDate: '2024-01-29 20:41:57',
      },
      {
        from: '6231139901000023075',
        to: '2088002822573801',
        amount: 129.8,
        count: 2,
        startDate: '2023-10-22 20:06:02',
        endDate: '2023-10-22 20:28:34',
      },
      {
        from: '6231139901000023075',
        to: '6230580000058864633',
        amount: 25834.0,
        count: 1,
        startDate: '2023-08-11 17:21:03',
        endDate: '2023-08-11 17:21:03',
      },
      {
        from: '6231139901000023075',
        to: '18272179',
        amount: 547.6800000000001,
        count: 3,
        startDate: '2023-09-07 12:46:00',
        endDate: '2023-09-16 14:57:07',
      },
      {
        from: '2088002822573801',
        to: '6231139901000023075',
        amount: 49.9,
        count: 1,
        startDate: '2023-10-27 12:44:59',
        endDate: '2023-10-27 12:44:59',
      },
      {
        from: '6230580000058864633',
        to: '6231139901000023075',
        amount: 300000.0,
        count: 2,
        startDate: '2023-12-16 09:52:11',
        endDate: '2023-12-20 18:37:16',
      },
      {
        from: '18272179',
        to: '6231139901000023075',
        amount: 339.62,
        count: 1,
        startDate: '2023-09-07 20:35:11',
        endDate: '2023-09-07 20:35:11',
      },
    ],
    phone: [],
  },
};
const responseData_2 = {
  nodes: [
    {
      id: 'n0',
      label: '陈凤姣',
    },
    {
      id: 'n1',
      label: '程以生（个人）',
    },
    {
      id: 'n2',
      label: '丁勇',
    },
    {
      id: 'n3',
      label: '丁勇（个人）',
    },
    {
      id: 'n4',
      label: '高博',
    },
    {
      id: 'n5',
      label: '林裕荣（个人）',
    },
    {
      id: 'n6',
      label: '徐鹏',
    },
    {
      id: 'n7',
      label: '徐鹏（个人）',
    },
    {
      id: 'n8',
      label: '张文红',
    },
    {
      id: 'n9',
      label: '其他',
    },
  ],
  edges: {
    money: [
      {
        from: 'n0',
        to: 'n8',
        amount: 906000,
        count: 5,
        startDate: '2015-08-17',
        endDate: '2016-10-02',
      },
      {
        from: 'n1',
        to: 'n2',
        amount: 21500,
        count: 3,
        startDate: '2023-10-21',
        endDate: '2024-01-06',
      },
      {
        from: 'n1',
        to: 'n7',
        amount: 21300,
        count: 86,
        startDate: '20200101',
        endDate: '20210207',
      },
      {
        from: 'n1',
        to: 'n3',
        amount: 150000,
        count: 141,
        startDate: '20110701',
        endDate: '20230405',
      },
      {
        from: 'n2',
        to: 'n9',
        amount: 5,
        count: 3235,
        startDate: '20200101',
        endDate: '20210207',
      },
      {
        from: 'n2',
        to: 'n3',
        amount: 1030,
        count: 1,
        startDate: '20110701',
        endDate: '20230405',
      },
      {
        from: 'n2',
        to: 'n6',
        amount: 8220,
        count: 5,
        startDate: '20200101',
        endDate: '20210207',
      },
      {
        from: 'n2',
        to: 'n1',
        amount: 69200,
        count: 6,
        startDate: '20110701',
        endDate: '20230405',
      },
      {
        from: 'n3',
        to: 'n7',
        amount: 15400,
        count: 42,
        startDate: '20200101',
        endDate: '20210207',
      },
      {
        from: 'n3',
        to: 'n1',
        amount: 3095.18,
        count: 87,
        startDate: '20110701',
        endDate: '20230405',
      },
      {
        from: 'n7',
        to: 'n1',
        amount: 150,
        count: 3,
        startDate: '20110701',
        endDate: '20230405',
      },
      {
        from: 'n7',
        to: 'n3',
        amount: 2771.5,
        count: 35,
        startDate: '20110701',
        endDate: '20230405',
      },
      {
        from: 'n8',
        to: 'n0',
        amount: 984,
        count: 62,
        startDate: '20110701',
        endDate: '20230405',
      },
      {
        from: 'n9',
        to: 'n7',
        amount: 7980.02,
        count: 3,
        startDate: '20110701',
        endDate: '20230405',
      },
      {
        from: 'n9',
        to: 'n6',
        amount: 11800,
        count: 4,
        startDate: '20110701',
        endDate: '20230405',
      },
      {
        from: 'n9',
        to: 'n3',
        amount: 99900,
        count: 40,
        startDate: '20110701',
        endDate: '20230405',
      },
      {
        from: 'n9',
        to: 'n2',
        amount: 20300,
        count: 18,
        startDate: '20110701',
        endDate: '20230405',
      },
    ],
    phone: [],
  },
};

const routes = [
  {
    path: '/',
    component: C_DB,
    props: () => ({ graphData: responseData_1 }),
  },
  {
    path: '/other',
    component: C_DB,
    props: () => ({ graphData: responseData_2 }),
  }, // 传递路由查询参数
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
