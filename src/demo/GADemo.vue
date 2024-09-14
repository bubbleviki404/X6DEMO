<template>
  <div class="container">
    <div class="header">
      <div class="history-app">
        <button @click="onUndo" :disabled="!canUndo">撤销 Ctrl+Z</button>
        <button @click="onRedo" :disabled="!canRedo">重做 Ctrl+Y</button>
      </div>
      <div class="anniu">
        <button @click="importData">导入数据</button>
        <button @click="exportData">导出数据</button>
      </div>
    </div>

    <div style="width: 100%; height: 100%" class="panning-mousewheel-app">
      <div id="diyConnector" class="app-content"></div>
    </div>
    <div id="minimap" class="app-minimap"></div>
    <Menu id="menu_self">
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
            3rd menu item
          </a>
        </Menu.Item>
        <Menu.Item key="4" danger>a danger item</Menu.Item>
      </Menu>
  </div>
  
</template>

<script lang="ts">
import { Menu, Dropdown } from 'ant-design-vue';
import { onMounted, onUnmounted, nextTick, ref } from 'vue';
import FileSaver from 'file-saver';
import { Graph, Path, Cell,ToolsView } from '@antv/x6';
import { History } from '@antv/x6-plugin-history';
import { Selection } from '@antv/x6-plugin-selection';




const ContextMenuTool = class extends ToolsView.ToolItem {
  constructor() {
    super();
    this.knob = null;
    this.timer = null;
  }

  render() {
    if (!this.knob) {
      this.knob = ToolsView.createElement('div', false);
      this.knob.style.position = 'absolute';
      this.container.appendChild(this.knob);
    }
  }

  toggleContextMenu(visible) {
    if (this.knob) {
      const dropdownContainer = this.knob;

      const unmountComponent = () => {
        dropdownContainer.innerHTML = '';
      };

      unmountComponent();
      document.removeEventListener('mousedown', this.onMouseDown);

      if (visible) {
        dropdownContainer.innerHTML = ''; // Clean up previous content

        Dropdown.render(
          {
            overlay: this.options.menu,
            visible: true,
            onClose: () => {
              unmountComponent();
              document.removeEventListener('mousedown', this.onMouseDown);
            },
          },
          dropdownContainer
        );

        document.addEventListener('mousedown', this.onMouseDown);
      }
    }
  }

  updatePosition(e) {
    const style = this.knob.style;
    if (e) {
      const pos = this.graph.clientToGraph(e.clientX, e.clientY);
      style.left = `${pos.x}px`;
      style.top = `${pos.y}px`;
    } else {
      style.left = '-1000px';
      style.top = '-1000px';
    }
  }

  onMouseDown = () => {
    debugger
    this.timer = window.setTimeout(() => {
      this.updatePosition();
      this.toggleContextMenu(false);
    }, 200);
  };

  onContextMenu({ e }) {
    debugger
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
    this.updatePosition(e);
    this.toggleContextMenu(true);
  }

  delegateEvents() {
    this.cellView.on('cell:contextmenu', this.onContextMenu, this);
    return super.delegateEvents();
  }

  onRemove() {
    this.cellView.off('cell:contextmenu', this.onContextMenu, this);
  }
};

ContextMenuTool.config({
  tagName: 'div',
  isSVGElement: false,
});

export default {
  name: 'GADemo',
  setup() {
    // 1. Create container
    const container = ref(null);



    const canUndo = ref(false);
    const canRedo = ref(false);

const menu = document.getElementById('menu_self');



    // 2.Register connector
    const graphRegister = () => {
      Graph.registerConnector(
        'single-left-right-top-connector',
        (s, e) => {
          const v1 = hypotenuse(200, 70);
          const c1 = { x: s.x + v1.linbian, y: s.y - v1.duibian };
          const v2 = hypotenuse(200, 20);
          const c2 = { x: e.x - v2.linbian, y: e.y + v2.duibian };

          const pathArr = [];
          pathArr.push(`M ${s.x} ${s.y}`);
          pathArr.push(`C ${c1.x} ${c1.y} ${c2.x} ${c2.y}  ${e.x} ${e.y}`);
          const paths = Path.normalize(pathArr.join(' '));
          return paths;
        },
        true
      );
      Graph.registerConnector(
        'single-left-right-bottom-connector',
        (s, e) => {
          const v1 = hypotenuse(200, 10);
          const c1 = { x: s.x + v1.linbian, y: s.y - v1.duibian };
          const v2 = hypotenuse(200, 70);
          const c2 = { x: e.x - v2.linbian, y: e.y + v2.duibian };

          const pathArr = [];
          pathArr.push(`M ${s.x} ${s.y}`);
          pathArr.push(`C ${c1.x} ${c1.y} ${c2.x} ${c2.y}  ${e.x} ${e.y}`);
          const paths = Path.normalize(pathArr.join(' '));
          return paths;
        },
        true
      );
    };
    graphRegister();
    const pointConnector = (s, e) => {
      // 判断角度所在象限
      const angle = getAngle(s.x, s.y, e.x, e.y);
      let quadrant = Math.ceil(angle / 90);
      if (angle > 340 || angle < 20) quadrant = 41;
      if (angle > 70 && angle < 110) quadrant = 12;
      if (angle > 160 && angle < 210) quadrant = 23;
      if (angle > 250 && angle < 290) quadrant = 34;

      let c1 = { x: 0, y: 0 };
      let c2 = { x: 0, y: 0 };
      let v1, v2;

      switch (quadrant) {
        case 1:
          v1 = hypotenuse(150, 50);
          c1 = { x: s.x - v1.linbian, y: s.y - v1.duibian };
          v2 = hypotenuse(100, 20);
          c2 = { x: e.x - v2.linbian, y: e.y - v2.duibian };
          break;
        case 2:
          v1 = hypotenuse(150, 10);
          c1 = { x: s.x - v1.linbian, y: s.y - v1.duibian };
          v2 = hypotenuse(100, 40);
          c2 = { x: e.x - v2.linbian, y: e.y + v2.duibian };
          break;
        case 3:
          v1 = hypotenuse(100, 10);
          c1 = { x: s.x - v1.linbian, y: s.y - v1.duibian };
          v2 = hypotenuse(100, 40);
          c2 = { x: e.x - v2.linbian, y: e.y - v2.duibian };
          break;
        case 4:
          v1 = hypotenuse(100, 50);
          c1 = { x: s.x - v1.duibian, y: s.y + v1.linbian };
          c2 = { x: e.x - v1.duibian, y: e.y + v1.linbian };
          break;
        case 41:
          v1 = hypotenuse(200, 70);
          c1 = { x: s.x + v1.linbian, y: s.y - v1.duibian };
          v2 = hypotenuse(200, 20);
          c2 = { x: e.x - v2.linbian, y: e.y + v2.duibian };
          break;
        case 12:
          v1 = hypotenuse(100, 50);
          c1 = { x: s.x - v1.duibian, y: s.y - v1.linbian };
          c2 = { x: e.x - v1.duibian, y: e.y + v1.linbian };
          break;
        case 23:
          v1 = hypotenuse(200, 10);
          c1 = { x: s.x - v1.linbian, y: s.y + v1.duibian };
          v2 = hypotenuse(200, 70);
          c2 = { x: e.x + v2.linbian, y: e.y - v2.duibian };
          break;
        case 34:
          v1 = hypotenuse(100, 50);
          c1 = { x: s.x - v1.duibian, y: s.y + v1.linbian };
          c2 = { x: e.x - v1.duibian, y: e.y - v1.linbian };
          break;
        default:
          v1 = hypotenuse(150, 10);
          c1 = { x: s.x - v1.linbian, y: s.y - v1.duibian };
          v2 = hypotenuse(100, 40);
          c2 = { x: e.x - v2.linbian, y: e.y + v2.duibian };
      }

      const pathArr = [];
      pathArr.push(`M ${s.x} ${s.y}`);
      pathArr.push(`C ${c1.x} ${c1.y} ${c2.x} ${c2.y}  ${e.x} ${e.y}`);
      const paths = Path.normalize(pathArr.join(' '));
      return paths;
    };
    Graph.unregisterConnector('pointConnector');
    Graph.registerConnector('pointConnector', pointConnector);
    const pointRightConnector = (s, e) => {
      // 判断角度所在象限
      const angle = getAngle(s.x, s.y, e.x, e.y);
      let quadrant = Math.ceil(angle / 90);
      if (angle > 340 || angle < 20) quadrant = 41;
      if (angle > 70 && angle < 110) quadrant = 12;
      if (angle > 160 && angle < 210) quadrant = 23;
      if (angle > 250 && angle < 290) quadrant = 34;

      let c1 = { x: 0, y: 0 };
      let c2 = { x: 0, y: 0 };
      let v1, v2;

      switch (quadrant) {
        case 1:
          v1 = hypotenuse(150, 20);
          c1 = { x: s.x + v1.linbian, y: s.y + v1.duibian };
          v2 = hypotenuse(100, 20);
          c2 = { x: e.x + v2.linbian, y: e.y + v2.duibian };
          break;
        case 2:
          v1 = hypotenuse(100, 50);
          c1 = { x: s.x + v1.linbian, y: s.y - v1.duibian };
          v2 = hypotenuse(100, 30);
          c2 = { x: e.x + v2.linbian, y: e.y - v2.duibian };
          break;
        case 3:
          v1 = hypotenuse(100, 50);
          c1 = { x: s.x + v1.linbian, y: s.y + v1.duibian };
          v2 = hypotenuse(100, 30);
          c2 = { x: e.x + v2.linbian, y: e.y + v2.duibian };
          break;
        case 4:
          v1 = hypotenuse(100, 70);
          c1 = { x: s.x + v1.duibian, y: s.y - v1.linbian };
          v2 = hypotenuse(150, 40);
          c2 = { x: e.x + v2.duibian, y: e.y - v2.linbian };

          break;
        case 41:
          v1 = hypotenuse(200, 20);
          c1 = { x: s.x + v1.linbian, y: s.y + v1.duibian };
          v2 = hypotenuse(200, 70);
          c2 = { x: e.x - v2.linbian, y: e.y - v2.duibian };
          break;
        case 12:
          v1 = hypotenuse(100, 50);
          c1 = { x: s.x + v1.duibian, y: s.y - v1.linbian };
          c2 = { x: e.x + v1.duibian, y: e.y + v1.linbian };
          break;
        case 23:
          v1 = hypotenuse(200, 70);
          c1 = { x: s.x - v1.linbian, y: s.y - v1.duibian };
          v2 = hypotenuse(200, 10);
          c2 = { x: e.x + v2.linbian, y: e.y + v2.duibian };

          break;
        case 34:
          v1 = hypotenuse(100, 50);
          c1 = { x: s.x + v1.duibian, y: s.y + v1.linbian };
          c2 = { x: e.x + v1.duibian, y: e.y - v1.linbian };
          break;
        default:
          v1 = hypotenuse(150, 10);
          c1 = { x: s.x + v1.linbian, y: s.y - v1.duibian };
          v2 = hypotenuse(100, 40);
          c2 = { x: e.x + v2.linbian, y: e.y + v2.duibian };
      }

      const pathArr = [];
      pathArr.push(`M ${s.x} ${s.y}`);
      pathArr.push(`C ${c1.x} ${c1.y} ${c2.x} ${c2.y}  ${e.x} ${e.y}`);
      const paths = Path.normalize(pathArr.join(' '));
      return paths;
    };
    Graph.unregisterConnector('pointRightConnector');
    Graph.registerConnector('pointRightConnector', pointRightConnector);


    Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)
    Graph.registerNodeTool('contextmenu', ContextMenuTool, true)

    // 2.Prepare data (Nodes, Edges)
    const edges = (
      source,
      target,
      labels,
      color,
      connector,
      targetMarker = null,
      sourceMarker = null
    ) => {
      const baseOffset = -50; // 基础偏移量

      let distance = 0.5;
      if (sourceMarker == null) {
        distance = 0.7;
      }

      const labelItems = labels.map((label, index) => {
        const currentOffset = baseOffset + index * 60; // 每个标签增加10的偏移量

        return {
          attrs: {
            label: {
              text: label.text,
              stroke: label.color,
            },
            rect: {
              ref: 'label',
              fill: 'rgba(0,0,0,.1)',
            },
          },
          position: {
            distance: distance,
            offset: currentOffset, // 动态计算偏移量
          },
        };
      });

      return {
        shape: 'edge',
        source: source,
        target: target,
        zIndex: 1,
        connector: connector,
        labels: labelItems,
        attrs: {
          // line 是选择器名称，选中的边的 path 元素
          line: {
            stroke: color,
            strokeWidth: targetMarker && sourceMarker ? 3 : 1,
            targetMarker: targetMarker && sourceMarker ? null : targetMarker,
            sourceMarker: targetMarker && sourceMarker ? null : sourceMarker,
          },
        },
      };
    };
    const nodeAttrs = (bgcolor) => {
      return {
        // body 是选择器名称，选中的是 rect 元素
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: bgcolor, // 'rgba(95,149,255,0.9)',
          rx: 6,
          ry: 6,
        },
      };
    };
    const nodePorts = () => {
      return {
        items: [
          { group: 'moneyIn', id: 'moneyIn' },
          { group: 'moneyOut', id: 'moneyOut' },
          // { group: 'phone', id: 'phone' },
        ],
        groups: {
          moneyIn: {
            position: { name: 'left' },
            attrs: {
              circle: {
                magnet: true,
                stroke: '#000',
                fill: 'green',
                r: 5,
              },
            },
            zIndex: 1,
          },
          moneyOut: {
            position: { name: 'right' },
            attrs: {
              circle: {
                magnet: true,
                stroke: '#000',
                fill: 'red',
                r: 5,
              },
            },
            zIndex: 1,
          },
          phone: {
            position: { name: 'bottom' },
            attrs: {
              circle: {
                magnet: true,
                stroke: '#000',
                fill: 'yellow',
                r: 5,
              },
            },
            zIndex: 1,
          },
        },
      };
    };
    const data = {
      nodes: [
        {
          id: 'p1',
          shape: 'rect',
          x: 140,
          y: 200,
          width: 80,
          height: 100,
          label: 'p1\n\n张三',
          zIndex: 10,
          attrs: nodeAttrs('rgba(95,149,255,0.9)'),
          ports: nodePorts(),
        },
        {
          id: 'p2',
          shape: 'rect',
          x: 440,
          y: 240,
          width: 80,
          height: 100,
          label: 'p2\n\n李四',
          zIndex: 10,
          attrs: nodeAttrs('rgba(255,149,255,0.9)'),
          ports: nodePorts(),
        },
        {
          id: 'p3',
          shape: 'rect',
          x: 840,
          y: 140,
          width: 80,
          height: 100,
          label: 'p3\n\n王五',
          zIndex: 10,
          attrs: nodeAttrs('rgba(95,255,255,0.9)'),
          ports: nodePorts(),
        },
        {
          id: 'p4',
          shape: 'rect',
          x: 840,
          y: 440,
          width: 80,
          height: 100,
          label: 'p4\n\n马六',
          zIndex: 10,
          attrs: nodeAttrs('rgba(95,149,255,0.9)'),
          ports: nodePorts(),
        },
        {
          id: 'p5',
          shape: 'rect',
          x: 540,
          y: 440,
          width: 80,
          height: 100,
          label: 'p5\n\n张一',
          zIndex: 10,
          attrs: nodeAttrs('rgba(95,149,255,0.9)'),
          ports: nodePorts(),
        },
        {
          id: 'p6',
          shape: 'rect',
          x: 240,
          y: 540,
          width: 80,
          height: 100,
          label: 'p6\n\n张二',
          zIndex: 10,
          attrs: nodeAttrs('rgba(0,149,0,0.9)'),
          ports: nodePorts(),
        },
        {
          id: 'p7',
          shape: 'rect',
          x: 840,
          y: 640,
          width: 80,
          height: 100,
          label: 'p7\n\n张五',
          zIndex: 10,
          attrs: nodeAttrs('rgba(95,0,0,0.9)'),
          ports: nodePorts(),
        },
        {
          id: 'p8',
          shape: 'rect',
          x: 1040,
          y: 240,
          width: 80,
          height: 100,
          label: 'p8\n\n张六',
          zIndex: 10,
          attrs: nodeAttrs('rgba(95,0,255,0.9)'),
          ports: nodePorts(),
        },{
          id: 'p9',
          shape: 'rect',
          x: 1040,
          y: 440,
          width: 80,
          height: 100,
          label: 'p9\n\nSOLO',
          zIndex: 10,
          attrs: nodeAttrs('rgba(35,0,255,0.9)'),
          ports: nodePorts(),
        },
      ],
      edges: [
        edges(
          { cell: 'p1', port: 'moneyIn' },
          { cell: 'p2', port: 'moneyIn' },
          [
            {
              text: '张三 20笔 共2000万\n李四 10笔 200万\n20240902-20240902',
              color: '#393f45',
            },
            { text: '通话20次\n20240902-20240902', color: 'red' },
            { text: '测试数据', color: 'blue' },
          ],
          'green',
          'pointConnector',
          'classic',
          'classic'
        ),
        edges(
          { cell: 'p3', port: 'moneyIn' },
          { cell: 'p2', port: 'moneyIn' },
          [
            {
              text: '王五 20笔 共2000万\n李四 10笔 200万\n20240902-20240902',
              color: '#393f45',
            },
          ],
          'green',
          'pointConnector',
          'classic',
          'classic'
        ),
        edges(
          { cell: 'p4', port: 'moneyIn' },
          { cell: 'p3', port: 'moneyIn' },
          [
            {
              text: '王五 10笔 200万\n马六 10笔 200万\n20240902-20240902',
              color: '#393f45',
            },
            { text: '通话20次\n20240902-20240902', color: 'red' },
          ],
          'green',
          'pointConnector',
          'classic',
          'classic'
        ),
        edges(
          { cell: 'p5', port: 'moneyIn' },
          { cell: 'p7', port: 'moneyIn' },
          [
            {
              text: '张一 10笔 200万\n张五 10笔 200万\n20240902-20240902',
              color: '#393f45',
            },
          ],
          'green',
          'pointConnector',
          'classic',
          'classic'
        ),
        edges(
          { cell: 'p6', port: 'moneyIn' },
          { cell: 'p4', port: 'moneyIn' },
          [
            {
              text: '张二 10笔 200万\n马六 10笔 200万\n20240902-20240902',
              color: '#393f45',
            },
          ],
          'green',
          'pointConnector',
          'classic',
          'classic'
        ),
        edges(
          { cell: 'p4', port: 'moneyIn' },
          { cell: 'p2', port: 'moneyIn' },
          [
            {
              text: '马六 10笔 200万\n20240902-20240902',
              color: '#393f45',
            },
            { text: '通话20次\n20240902-20240902', color: 'red' },
          ],
          'green',
          'pointConnector',
          'classic',
          null
        ),
        edges(
          { cell: 'p4', port: 'moneyIn' },
          { cell: 'p8', port: 'moneyIn' },
          [
            {
              text: '张六 10笔 200万\n20240902-20240902',
              color: '#393f45',
            },
          ],
          'green',
          'pointConnector',
          'classic',
          null
        ),
        edges(
          { cell: 'p3', port: 'moneyIn' },
          { cell: 'p7', port: 'moneyIn' },
          [
            {
              text: '张五 10笔 200万\n20240902-20240902',
              color: '#393f45',
            },
          ],
          'green',
          'pointConnector',
          'classic',
          null
        ),
        edges(
          { cell: 'p4', port: 'moneyIn' },
          { cell: 'p5', port: 'moneyIn' },
          [
            {
              text: '张一 10笔 200万\n20240902-20240902',
              color: '#393f45',
            },
          ],
          'green',
          'pointConnector',
          'classic',
          null
        ),
        edges(
          { cell: 'p7', port: 'moneyOut' },
          { cell: 'p2', port: 'moneyOut' },
          [
            {
              text: '通话20次\n20240902-20240902',
              color: 'red',
              position: 0.8,
            },
          ],
          'red',
          'pointRightConnector'
        ),
      ],
    };

    // 3.Render graph
    const graph = ref();
    const originalColors = {
      nodes: [],
      edges: [],
      labels: [],
    };


    const filter = {
      name: "blur",
      args: { x:13,y:16}
    };

    

    const init = () => {
      graph.value = new Graph({
        container: document.getElementById('diyConnector'),
        width: window.innerWidth,
        height: window.innerHeight,
        autoResize: true,
        panning: true,
        mousewheel: true,
        background: {
          color: '#F2F7FA',
        },
        interacting: {
          magnetConnectable: false, // 连接桩禁止连接
        },
        connecting: {
          connectionPoint: 'anchor', // anchor 使用锚点作为连接点 boundary 默认值，与链接图形的边框的交点。
        },
      });




      graph.value.addNodes(data.nodes);
      graph.value.addEdges(data.edges);

      const parent = graph.value.addNode({
  x: 40,
  y: 40,
  width: 240,
  height: 160,
  zIndex: 1,
  label: 'Parent\n(try to move me)',
  attrs: {
    label: {
      refY: 120,
      fontSize: 12,
    },
    body: {
      fill: '#fffbe6',
      stroke: '#ffe7ba',
    },
  },
})
debugger

parent.addChild(graph.value.getNodes()[0]);
parent.addChild(graph.value.getNodes()[1]);
debugger

      /** 插件添加 */
      graph.value.use(new History({ enabled: true }));
      graph.value.use(
        new Selection({
          enabled: true,
          multiple: true,
          rubberband: true,
          movable: true,
          showNodeSelectionBox: true,
        })
      );

      /** 节点选中事件 */
      graph.value.on('node:selected', ({ node }) => {
        debugger;
        console.log('node:selected:', node);

        // 获取当前选中的节点 ID
        const selectedNodeId = node.id;

        // 获取所有节点和边
        const allNodes = graph.value.getNodes();
        const allEdges = graph.value.getEdges();

        // 寻找与选中节点相连的节点
        const connectedNodeIds = allEdges
          .filter(
            (edge) =>
              edge.getSourceCellId() === selectedNodeId ||
              edge.getTargetCellId() === selectedNodeId
          )
          .map((edge) => {
            return edge.getSourceCellId() === selectedNodeId
              ? edge.getTargetCellId()
              : edge.getSourceCellId();
          });

        // 节点：保存原始颜色 && 虚化与当前选中节点不相连的节点
        allNodes.forEach((n) => {
          if (!originalColors.nodes[n.id]) {
            originalColors.nodes[n.id] = n.attr('body/fill');
          }
          if (n.id !== selectedNodeId && !connectedNodeIds.includes(n.id)) {
            n.attr('body/filter', filter); // 修改虚化颜色
          }
        });

        // 边：保存原始颜色 && 虚化与当前选中节点不相连的边
        allEdges.forEach((e) => {
          if (!originalColors.edges[e.id]) {
            originalColors.edges[e.id] = e.attr('line/stroke');

            e.labels.forEach((label, index) => {
              originalColors.labels[e.id] = originalColors.labels[e.id] || {};
              debugger;
              originalColors.labels[e.id][index] = label.attrs.label.stroke; // 假设这是获取标签颜色的方法
            });
          }
          if (
            e.getSourceNode().id !== selectedNodeId &&
            e.getTargetNode().id !== selectedNodeId
            // !connectedNodeIds.includes(e.getSourceNode().id) &&
            // !connectedNodeIds.includes(e.getTargetNode().id)
          ) {
            e.attr('line/stroke', 'rgba(0, 0, 0, 0.2)');
            e.attr('body/filter', filter); // 修改虚化颜色
            debugger;
            e.labels.forEach((label, index) => {
              debugger;
              e.attr('label/filter', filter); // 修改虚化颜色
              // 将标签颜色设置为透明
              label.attrs.label.stroke = 'rgba(0, 0, 0, 0)';
            });
          }
        });
      });

      /** 节点取消选中事件 */
      graph.value.on('node:unselected', ({ node }) => {
        console.log('node:unselected:', node);

        // 获取取消选中的节点 ID
        const unselectedNodeId = node.id;

        // 恢复所有节点的颜色
        const allNodes = graph.value.getNodes();
        allNodes.forEach((n) => {
          if (originalColors.nodes[n.id]) {
            n.attr('body/fill', originalColors.nodes[n.id]); // 恢复原始颜色
          }
        });
        const allEdges = graph.value.getEdges();
        // 恢复所有边的颜色
        allEdges.forEach((e) => {
          if (originalColors.edges[e.id]) {
            e.attr('line/stroke', originalColors.edges[e.id]); // 恢复边原始颜色
          }
        });
      });

      /** 撤销重做事件 */
      graph.value.on('history:change', () => {
        debugger
        canUndo.value = graph.value.canUndo();
        canRedo.value = graph.value.canRedo();
        console.log('canUndo:', canUndo.value, 'canRedo:', canRedo.value);




});
    };
    //已知角度和斜边，求直角边
    function hypotenuse(long, angle) {
      //获得弧度
      var radian = ((2 * Math.PI) / 360) * angle;
      return {
        duibian: Math.sin(radian) * long, //对边
        linbian: Math.cos(radian) * long, //邻边
      };
    }
    function getAngle(x1, y1, x2, y2) {
      var x = x2 - x1;
      var y = y2 - y1;
      var atan = Math.atan2(y, x); // 使用 atan2 方法来获取角度
      var angle = Math.round((atan * 180) / Math.PI); // 将弧度转换为角度
      if (angle < 0) {
        angle = angle + 360;
      }
      return angle > 0 ? 360 - angle : 360 + angle;
    }

    const nodeTemp = [];
    const drawPoint = (points) => {
      if (nodeTemp.length > 0) return;
      points.forEach((item, index) => {
        let id = `${item.x.toFixed(2)},${item.y.toFixed(2)}`;
        let node = graph.value.createNode({
          id: id,
          shape: 'circle',
          x: item.x,
          y: item.y,
          width: 8,
          height: 8,
          label: `${index}: ${item.x.toFixed(0)},${item.y.toFixed(0)}`,
          attrs: {
            body: {
              refX: -40,
              refY: 0,
              fill: 'red',
              stroke: 'yellow',
            },
          },
        tools: [
          {
            name: 'contextmenu',
            args: {
              menu,
            },
          },
        ],
          
        });
        graph.value.addNode(node);
        nodeTemp.push(id);
      });
    };

    // 4. Functions

    // 4.1 Redo & Undo
    const handleKeydown = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        onUndo();
        event.preventDefault(); // 防止默认行为，例如浏览器的撤销
      } else if (event.ctrlKey && event.key === 'y') {
        onRedo();
        event.preventDefault(); // 防止默认行为
      }
    };
    const onUndo = () => {
      debugger
      if (graph && graph.value.canUndo()) {
        console.log('Undoing...');
        graph.value.undo();
      } else {
        console.log('Cannot undo');
      }
    };
    const onRedo = () => {
      debugger
      if (graph && graph.value.canRedo()) {
        console.log('Redoing...');
        graph.value.redo();
      } else {
        console.log('Cannot redo');
      }
    };

    // 4.2 Import and Export
    const exportData = () => {
      const data = graph.value.toJSON();
      const blob = new Blob([JSON.stringify(data)], { type: '' });
      FileSaver.saveAs(blob, 'demo.json');
    };
    const importData = (file) => {
      const element = document.createElement('input');
      element.setAttribute('type', 'file');
      element.style.display = 'none';
      element.click();
      element.onchange = function (e) {
        const file = e.target.files[0];

        var reader = new FileReader();
        reader.onload = function (e) {
          var content = e.target.result;

          graph.value.clearCells();
          graph.value.fromJSON(JSON.parse(content));
        };
        reader.readAsText(file); // 以文本格式读取文件
      };

      // graph.value.clearCells()
      // console.log(file)
      // graph.fromJSON()
    };
    
    onMounted(async () => {
      nextTick(() => {
        init();
        window.addEventListener('keydown', handleKeydown);
      });
    });
    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown);
    });
    return {
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    importData,
    exportData
  };
  },
};
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f8f8f8; /* 使背景和按钮有对比 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.anniu {
  display: flex;
  button {
    margin-left: 10px;
  }
}

.history-app {
  display: flex;
  button {
    margin-right: 10px;
  }
}

.app-content {
  flex: 1;
  height: 280px;
  margin: 10px; /* 增加画布的边距 */
  border-radius: 5px;
  box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
  background-color: #ffffff; /* 确保画布有背景 */
}

.app-minimap {
  /* 适当的样式，如需要 */
  margin: 10px;
}
</style>
