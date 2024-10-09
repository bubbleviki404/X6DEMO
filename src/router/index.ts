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
const responseData_db = {
  cells: [
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: '71cc76ec-83b7-471f-bc20-106ed756c580',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 3笔 共297000元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 297000 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '622908398178980019',
        port: 'moneyOut_6231139901000023075',
      },
      target: {
        cell: '6231139901000023075',
        port: 'moneyIn_622908398178980019',
      },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: '46c86dd9-9663-4bc7-af88-22630f005ed3',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 4笔 共363908元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 363908 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '6228480086109452374',
        port: 'moneyOut_6231139901000023075',
      },
      target: {
        cell: '6231139901000023075',
        port: 'moneyIn_6228480086109452374',
      },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: 'e6027465-cac6-4bb0-b975-1289af78df6e',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 1笔 共6227元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 6227 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '6222021001037345441',
        port: 'moneyOut_6231139901000023075',
      },
      target: {
        cell: '6231139901000023075',
        port: 'moneyIn_6222021001037345441',
      },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: 'c878b9f9-ca17-4cfe-9679-5bf764dba2be',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 10笔 共210432元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 210432 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '62262289035973856226',
        port: 'moneyOut_6231139901000023075',
      },
      target: {
        cell: '6231139901000023075',
        port: 'moneyIn_62262289035973856226',
      },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: '1de2950f-87d7-400f-b720-8aa4e353aaae',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 1笔 共50000元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 50000 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '6231139901000023075',
        port: 'moneyOut_622908398178980019',
      },
      target: {
        cell: '622908398178980019',
        port: 'moneyIn_6231139901000023075',
      },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: 'fa355c57-72a8-4f47-90b5-7ff90d157c8c',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 2笔 共60694元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 60694 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '6231139901000023075',
        port: 'moneyOut_6228480088424598873',
      },
      target: {
        cell: '6228480088424598873',
        port: 'moneyIn_6231139901000023075',
      },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: '930e569a-2a8b-418f-a334-ba71017b4cb8',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 3笔 共61779元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 61779 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '6231139901000023075',
        port: 'moneyOut_6228480086300701975',
      },
      target: {
        cell: '6228480086300701975',
        port: 'moneyIn_6231139901000023075',
      },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: 'a150e4bb-dd07-45e7-8a73-e603e3f043e5',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 2笔 共129.8元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 129.8 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '6231139901000023075',
        port: 'moneyOut_2088002822573801',
      },
      target: { cell: '2088002822573801', port: 'moneyIn_6231139901000023075' },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: 'c85d0069-ae9f-44d9-88d0-357aec7e6f0a',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 1笔 共25834元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 25834 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '6231139901000023075',
        port: 'moneyOut_6230580000058864633',
      },
      target: {
        cell: '6230580000058864633',
        port: 'moneyIn_6231139901000023075',
      },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: '148e60c9-f5d9-42ea-ae09-c874e1424f6d',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 3笔 共547.6800000000001元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 547.6800000000001 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: { cell: '6231139901000023075', port: 'moneyOut_18272179' },
      target: { cell: '18272179', port: 'moneyIn_6231139901000023075' },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: '19b4fbee-0b4d-4ada-9d92-b085348426db',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 1笔 共49.9元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 49.9 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '2088002822573801',
        port: 'moneyOut_6231139901000023075',
      },
      target: { cell: '6231139901000023075', port: 'moneyIn_2088002822573801' },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: '706c69f5-733d-4b24-8dea-f07faeb17c1d',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 2笔 共300000元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 300000 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: {
        cell: '6230580000058864633',
        port: 'moneyOut_6231139901000023075',
      },
      target: {
        cell: '6231139901000023075',
        port: 'moneyIn_6230580000058864633',
      },
    },
    {
      shape: 'edge',
      attrs: { line: { stroke: '#36121e', strokeWidth: 1 } },
      id: '2d8d721c-5b0a-45e5-b918-95dc46c696ea',
      zIndex: 1,
      labels: [
        {
          attrs: {
            label: {
              type: 'money',
              text: '转账 1笔 共339.62元',
              fill: '#36121e',
              stroke: '#36121e',
            },
          },
        },
      ],
      data: { isFilter: false, amount: 339.62 },
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { radius: 30 } },
      source: { cell: '18272179', port: 'moneyOut_6231139901000023075' },
      target: { cell: '6231139901000023075', port: 'moneyIn_18272179' },
    },
    {
      position: { x: 620, y: 140 },
      size: { width: 80, height: 100 },
      view: 'vue-shape-view',
      shape: 'custom-vue-node',
      id: '6231139901000023075',
      zIndex: 2,
      label: '吴苹_6231139901000023075',
      data: {
        nodeId: '6231139901000023075',
        nodeName: '吴苹_6231139901000023075',
        blur: false,
        drillUpDisabled: false,
        drillDownDisabled: false,
      },
      _order: 0,
      ports: {
        items: [
          { group: 'phone', id: 'phone' },
          { group: 'moneyIn', id: 'moneyIn_622908398178980019' },
          { group: 'moneyIn', id: 'moneyIn_6228480086109452374' },
          { group: 'moneyIn', id: 'moneyIn_6222021001037345441' },
          { group: 'moneyIn', id: 'moneyIn_62262289035973856226' },
          { group: 'moneyIn', id: 'moneyIn_2088002822573801' },
          { group: 'moneyIn', id: 'moneyIn_6230580000058864633' },
          { group: 'moneyIn', id: 'moneyIn_18272179' },
          { group: 'moneyOut', id: 'moneyOut_622908398178980019' },
          { group: 'moneyOut', id: 'moneyOut_6228480088424598873' },
          { group: 'moneyOut', id: 'moneyOut_6228480086300701975' },
          { group: 'moneyOut', id: 'moneyOut_2088002822573801' },
          { group: 'moneyOut', id: 'moneyOut_6230580000058864633' },
          { group: 'moneyOut', id: 'moneyOut_18272179' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'blue', r: 2 },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'green', r: 2 },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'purple', r: 2 },
            },
            zIndex: 1,
          },
        },
      },
    },
    {
      position: { x: 1150, y: 60 },
      size: { width: 80, height: 100 },
      view: 'vue-shape-view',
      shape: 'custom-vue-node',
      id: '622908398178980019',
      zIndex: 2,
      label: '刘京_622908398178980019',
      data: {
        nodeId: '622908398178980019',
        nodeName: '刘京_622908398178980019',
        blur: false,
        drillUpDisabled: false,
        drillDownDisabled: false,
      },
      _order: 0,
      ports: {
        items: [
          { group: 'phone', id: 'phone' },
          { group: 'moneyIn', id: 'moneyIn_6231139901000023075' },
          { group: 'moneyOut', id: 'moneyOut_6231139901000023075' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'blue', r: 2 },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'green', r: 2 },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'purple', r: 2 },
            },
            zIndex: 1,
          },
        },
      },
    },
    {
      position: { x: 170, y: 540 },
      size: { width: 80, height: 100 },
      view: 'vue-shape-view',
      shape: 'custom-vue-node',
      id: '6222021001037345441',
      zIndex: 2,
      label: '欧文才_6222021001037345441',
      data: {
        nodeId: '6222021001037345441',
        nodeName: '欧文才_6222021001037345441',
        blur: false,
        drillUpDisabled: true,
        drillDownDisabled: false,
      },
      _order: 1,
      ports: {
        items: [
          { group: 'phone', id: 'phone' },
          { group: 'moneyOut', id: 'moneyOut_6231139901000023075' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'blue', r: 2 },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'green', r: 2 },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'purple', r: 2 },
            },
            zIndex: 1,
          },
        },
      },
    },
    {
      position: { x: 1150, y: 380 },
      size: { width: 80, height: 100 },
      view: 'vue-shape-view',
      shape: 'custom-vue-node',
      id: '6228480086300701975',
      zIndex: 2,
      label: '李璇_6228480086300701975',
      data: {
        nodeId: '6228480086300701975',
        nodeName: '李璇_6228480086300701975',
        blur: false,
        drillUpDisabled: false,
        drillDownDisabled: true,
      },
      _order: 2,
      ports: {
        items: [
          { group: 'phone', id: 'phone' },
          { group: 'moneyIn', id: 'moneyIn_6231139901000023075' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'blue', r: 2 },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'green', r: 2 },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'purple', r: 2 },
            },
            zIndex: 1,
          },
        },
      },
    },
    {
      position: { x: 170, y: 700 },
      size: { width: 80, height: 100 },
      view: 'vue-shape-view',
      shape: 'custom-vue-node',
      id: '62262289035973856226',
      zIndex: 2,
      label: '彭孝英_62262289035973856226',
      data: {
        nodeId: '62262289035973856226',
        nodeName: '彭孝英_62262289035973856226',
        blur: false,
        drillUpDisabled: true,
        drillDownDisabled: false,
      },
      _order: 2,
      ports: {
        items: [
          { group: 'phone', id: 'phone' },
          { group: 'moneyOut', id: 'moneyOut_6231139901000023075' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'blue', r: 2 },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'green', r: 2 },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'purple', r: 2 },
            },
            zIndex: 1,
          },
        },
      },
    },
    {
      position: { x: 1150, y: 220 },
      size: { width: 80, height: 100 },
      view: 'vue-shape-view',
      shape: 'custom-vue-node',
      id: '6228480088424598873',
      zIndex: 2,
      label: '陈红_6228480088424598873',
      data: {
        nodeId: '6228480088424598873',
        nodeName: '陈红_6228480088424598873',
        blur: false,
        drillUpDisabled: false,
        drillDownDisabled: true,
      },
      _order: 1,
      ports: {
        items: [
          { group: 'phone', id: 'phone' },
          { group: 'moneyIn', id: 'moneyIn_6231139901000023075' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'blue', r: 2 },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'green', r: 2 },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'purple', r: 2 },
            },
            zIndex: 1,
          },
        },
      },
    },
    {
      position: { x: 170, y: 380 },
      size: { width: 80, height: 100 },
      view: 'vue-shape-view',
      shape: 'custom-vue-node',
      id: '6228480086109452374',
      zIndex: 2,
      label: '王英霖_6228480086109452374',
      data: {
        nodeId: '6228480086109452374',
        nodeName: '王英霖_6228480086109452374',
        blur: false,
        drillUpDisabled: true,
        drillDownDisabled: false,
      },
      _order: 0,
      ports: {
        items: [
          { group: 'phone', id: 'phone' },
          { group: 'moneyOut', id: 'moneyOut_6231139901000023075' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'blue', r: 2 },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'green', r: 2 },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'purple', r: 2 },
            },
            zIndex: 1,
          },
        },
      },
    },
    {
      position: { x: 170, y: 860 },
      size: { width: 80, height: 100 },
      view: 'vue-shape-view',
      shape: 'custom-vue-node',
      id: '18272179',
      zIndex: 2,
      label: '上海哈啰普惠科技有限公司_18272179',
      data: {
        nodeId: '18272179',
        nodeName: '上海哈啰普惠科技有限公司_18272179',
        blur: false,
        drillUpDisabled: false,
        drillDownDisabled: false,
      },
      _order: 3,
      ports: {
        items: [
          { group: 'phone', id: 'phone' },
          { group: 'moneyIn', id: 'moneyIn_6231139901000023075' },
          { group: 'moneyOut', id: 'moneyOut_6231139901000023075' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'blue', r: 2 },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'green', r: 2 },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'purple', r: 2 },
            },
            zIndex: 1,
          },
        },
      },
    },
    {
      position: { x: 1150, y: 540 },
      size: { width: 80, height: 100 },
      view: 'vue-shape-view',
      shape: 'custom-vue-node',
      id: '2088002822573801',
      zIndex: 2,
      label: '王桂香_2088002822573801',
      data: {
        nodeId: '2088002822573801',
        nodeName: '王桂香_2088002822573801',
        blur: false,
        drillUpDisabled: false,
        drillDownDisabled: false,
      },
      _order: 3,
      ports: {
        items: [
          { group: 'phone', id: 'phone' },
          { group: 'moneyIn', id: 'moneyIn_6231139901000023075' },
          { group: 'moneyOut', id: 'moneyOut_6231139901000023075' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'blue', r: 2 },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'green', r: 2 },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'purple', r: 2 },
            },
            zIndex: 1,
          },
        },
      },
    },
    {
      position: { x: 1150, y: 700 },
      size: { width: 80, height: 100 },
      view: 'vue-shape-view',
      shape: 'custom-vue-node',
      id: '6230580000058864633',
      zIndex: 2,
      label: '孙亚涛_6230580000058864633',
      data: {
        nodeId: '6230580000058864633',
        nodeName: '孙亚涛_6230580000058864633',
        blur: false,
        drillUpDisabled: false,
        drillDownDisabled: false,
      },
      _order: 4,
      ports: {
        items: [
          { group: 'phone', id: 'phone' },
          { group: 'moneyIn', id: 'moneyIn_6231139901000023075' },
          { group: 'moneyOut', id: 'moneyOut_6231139901000023075' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'blue', r: 2 },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'green', r: 2 },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: { magnet: false, stroke: 'black', fill: 'purple', r: 2 },
            },
            zIndex: 1,
          },
        },
      },
    },
  ],
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
    props: () => ({ dbData: responseData_db }),
  }, // 传递路由查询参数
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
