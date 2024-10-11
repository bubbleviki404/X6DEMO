<template>
  <el-row>
    <el-col :span="4">
      <el-button @click="onUndo" :disabled="!canUndo"
        ><el-icon :size="20"> <Back /> </el-icon
      ></el-button>
      <el-button @click="onRedo" :disabled="!canRedo">
        <el-icon :size="20"> <Right /> </el-icon></el-button
    ></el-col>
    <el-col :span="4">
      <el-input
        v-model="nodeNameSearch"
        style="width: 120px"
        placeholder="节点名称"
        @keyup.enter.native="searchNodeByName"
        :suffix-icon="Search"
    /></el-col>
    <el-col :span="4">
      <el-button type="primary" @click="exportToPng">导出图片</el-button>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" @click="exportData">保存</el-button>
    </el-col>
  </el-row>
  <!-- 右键菜单 -->
  <div
    v-if="isMenuVisible"
    class="custom-context-menu"
    :style="{
      position: 'absolute',
      top: `${menuPosition.y}px`,
      left: `${menuPosition.x}px`,
      zIndex: 1000,
    }"
    @mouseleave="hideMenu"
  >
    <div @click="pin">群组</div>
    <div @click="otherAction">群组2</div>
  </div>
  <div id="graph_container"></div>
  <TeleportContainer />
</template>

<script lang="ts" setup>
import * as htmlToImage from 'html-to-image';
import { Back, Right, Search } from '@element-plus/icons-vue';
import { h, nextTick, onMounted, ref, onUnmounted, defineProps } from 'vue';
import { Graph, Model } from '@antv/x6';
import { Scroller } from '@antv/x6-plugin-scroller';
import { Selection } from '@antv/x6-plugin-selection';
import { Export } from '@antv/x6-plugin-export';
import { History } from '@antv/x6-plugin-history';
import { register, getTeleport } from '@antv/x6-vue-shape';
import NodeComponent from './Node.vue';
import { DagreLayout } from '@antv/layout';
import { getTransactionLevel } from '../utils/graphUtils';
import FileSaver from 'file-saver';

interface ResponseData {
  nodes: [];
  edges: {
    money: [];
    phone: [];
  };
}
const props = defineProps<{
  graphData: ResponseData; // 根据需要定义类型
  dbData: Model.FromJSONData;
}>();

// 将组件内部的模板“传送”到该组件的 DOM 结构外层的位置（无敌重要！让节点的菜单模板可以在父组件生效）
const TeleportContainer = getTeleport();
const graph = ref<Graph | null>(null);

interface Edge {
  money: {
    from: string;
    to: string;
    amount: number;
    count: number;
    startDate: string;
    endDate: string;
  };
  phone: {
    from: string;
    to: string;
    count: number;
    startDate: string;
    endDate: string;
  };
}

// 原始数据
const originData = ref<{
  nodes: Array<{ id: string; label: string }>;
  edges: {
    money: Array<Edge['money']>; // 使用 Edge 接口
    phone: Array<Edge['phone']>;
  };
} | null>(null);

// 节点数据
const data = {
  nodes: [] as Array<{
    id: string;
    shape: string;
    x: number;
    y: number;
    zIndex: number;
    label: string;
    data: any;
    ports: any;
  }>,
  edges: [] as Array<any>,
};

// 交易金额记录
const maxAmount = ref(0); // 最高金额
const minAmount = ref(0); // 最低金额

// 画布样式配置
const graphConfig = {
  node: {
    width: 80,
    height: 100,
  },
  size: {
    width: 1028,
    height: 640,
  },
  // 布局间隔
  sep: {
    rank: 150,
    node: 40,
  },
  // 颜色
  color: {
    graph: '#F2F7FA',
    filter: {
      cell: 'rgba(0,0,0,0)',
      stroke: 'rgba(0,0,0,.1)',
    },
    edge: {
      label: {
        text: {
          money: '#36121e',
          phone: 'purple',
        },
      },
      line: {
        money: '#36121e',
        phone: 'grey',
      },
      port: {
        moneyIn: 'blue',
        moneyOut: 'green',
        phone: 'purple',
        stroke: 'black',
      },
    },
  },
};

// 布局
const dagreLayout = new DagreLayout({
  type: 'dagre',
  rankdir: 'LR',
  align: 'UR',
  ranksep: graphConfig.sep.rank,
  nodesep: graphConfig.sep.node,
});

// 构建标签
const buildLabel = (edge: any) => {
  let labelText;
  let labelColor;
  if (edge.amount) {
    edge.type = 'money';
  }
  if (edge.type === 'money') {
    labelText = '转账 ' + edge.count + '笔 共' + edge.amount + '元';
    labelColor = graphConfig.color.edge.label.text.money;
  } else {
    labelText = '通话' + edge.count + '次';
    labelColor = graphConfig.color.edge.label.text.phone;
    // labelBg = graphConfig.color.edge.label.bg.phone;
  }
  return {
    attrs: {
      label: {
        type: edge.type,
        text: labelText,
        fill: labelColor,
        stroke: labelColor,
        // TODO:标签位置
      },
      // rect: {
      //   ref: 'label',
      //   fill: labelBg,
      // },
    },
  };
};

// 节点端口数据
const nodesPorts: Record<string, { from: string[]; to: string[] }> = {};

// 构建边
const buildEdge = (edge: any) => {
  let currentNode = edge.from;
  let nextNode = edge.to;

  let lineColor = '';

  let fromPortType = '';
  let toPortType = '';
  let paddingBottom = 30;

  if (edge.type != 'phone') {
    lineColor = graphConfig.color.edge.line.money;

    fromPortType = 'moneyOut' + '_' + nextNode;
    toPortType = 'moneyIn' + '_' + currentNode;

    if (!nodesPorts[currentNode]) {
      nodesPorts[currentNode] = { from: [], to: [] };
    }
    if (!nodesPorts[nextNode]) {
      nodesPorts[nextNode] = { from: [], to: [] };
    }
    nodesPorts[nextNode]['from'].push(currentNode);
    nodesPorts[currentNode]['to'].push(nextNode);

    let fromArraySize = nodesPorts[currentNode]['from'].length;
    let toArraySize = nodesPorts[currentNode]['to'].length;
    paddingBottom = (fromArraySize + toArraySize) * paddingBottom;
  } else {
    lineColor = graphConfig.color.edge.line.phone;
    fromPortType = 'phone';
    toPortType = 'phone';
  }

  if (edge.amount) {
    if (edge.amount > maxAmount.value) {
      maxAmount.value = edge.amount;
    }

    if (minAmount.value < 1) {
      minAmount.value = edge.amount;
    }

    if (edge.amount < minAmount.value) {
      minAmount.value = edge.amount;
    }
  }

  return {
    shape: 'edge',
    source: { cell: edge.from, port: fromPortType },
    target: { cell: edge.to, port: toPortType },
    zIndex: 1,
    labels: [buildLabel(edge)],
    attrs: {
      line: {
        stroke: lineColor,
        strokeWidth: 1,
        targetMarker: 'classic',
      },
    },
    data: {
      isFilter: false,
      amount: edge.amount,
    },
    router: {
      name: 'metro',
      // name: "manhattan",
      // name:'orth'
      // args: {
      //   padding: {
      //     top: 45,
      //     left: 45,
      //   },
      //   endDirections: ["left"],
      // },
    },
    connector: {
      name: 'rounded',
      args: {
        radius: 30,
      },
    },
    // connector: "pointConnector",
  };
};

// 构建节点端口
const nodePorts = (currenNode: string) => {
  const items = [{ group: 'phone', id: 'phone' }];
  const ports = nodesPorts[currenNode];
  if (ports) {
    ports['from'].forEach((n: string) => {
      let portId = 'moneyIn' + '_' + n;
      items.push({
        group: 'moneyIn',
        id: portId,
        // attrs: { text: { text: portId } },
      });
    });
    ports['to'].forEach((n: string) => {
      let portId = 'moneyOut' + '_' + n;
      items.push({
        group: 'moneyOut',
        id: portId,
        // attrs: { text: { text: portId } },
      });
    });
  }

  return {
    items: items,
    groups: {
      moneyIn: {
        position: { name: 'left' },
        attrs: {
          circle: {
            magnet: false,
            stroke: graphConfig.color.edge.port.stroke,
            fill: graphConfig.color.edge.port.moneyIn,
            r: 2,
          },
        },
        zIndex: 1,
      },
      moneyOut: {
        position: { name: 'right' },
        attrs: {
          circle: {
            magnet: false,
            stroke: graphConfig.color.edge.port.stroke,
            fill: graphConfig.color.edge.port.moneyOut,
            r: 2,
          },
        },
        zIndex: 1,
      },
      phone: {
        position: { name: 'bottom' },
        attrs: {
          circle: {
            magnet: false,
            stroke: graphConfig.color.edge.port.stroke,
            fill: graphConfig.color.edge.port.phone,
            r: 2,
          },
        },
        zIndex: 1,
      },
    },
  };
};

// 构建节点
const buildNode = (id: string, label: string) => {
  let drillUpDisabled = true;
  let drillDownDisabled = true;
  if (nodesPorts && nodesPorts[id]) {
    if (nodesPorts[id].from && nodesPorts[id].from.length > 0) {
      drillUpDisabled = false;
    }
    if (nodesPorts[id].to && nodesPorts[id].to.length > 0) {
      drillDownDisabled = false;
    }
  }

  return {
    id: id,
    shape: 'custom-vue-node',
    x: 0,
    y: 0,
    zIndex: 2,
    label: label + '_' + id,
    data: {
      nodeId: id,
      nodeName: label + '_' + id,
      blur: false,
      drillUpDisabled: drillUpDisabled,
      drillDownDisabled: drillDownDisabled,
    },
    ports: nodePorts(id),
  };
};

// 画布渲染
const renderGraph = () => {
  // 初始化画布
  graph.value = new Graph({
    container: document.getElementById('graph_container')!,
    mousewheel: {
      enabled: true,
      modifiers: 'ctrl',
      factor: 1.1,
      maxScale: 1.5,
      minScale: 0.5,
    },
    background: {
      color: graphConfig.color.graph,
    },
  });

  // 滚动画布
  graph.value.use(
    new Scroller({
      enabled: true,
      height: graphConfig.size.height,
      width: graphConfig.size.width,
      autoResize: true,
    })
  );

  // 历史记录
  graph.value.use(new History({ enabled: true }));
  graph.value.on('history:change', () => {
    if (graph && graph.value) {
      canUndo.value = graph.value.canUndo();
      canRedo.value = graph.value.canRedo();
    }
  });

  // 导出
  graph.value.use(new Export());

  // 双击-空白画布：画布内容居中对齐
  graph.value.on('blank:dblclick', () => {
    onCenterContent();
  });

  // 框选
  graph.value.use(
    new Selection({
      enabled: true,
      multiple: true,
      rubberband: true,
      movable: true,
      strict: true,
      showNodeSelectionBox: true,
      showEdgeSelectionBox: true,
      className: 'custom-selection',
    })
  );
};

// 渲染数据
const renderData = () => {
  let model;

  if (props.graphData != null) {
    // 获取布局数据
    model = dagreLayout.layout(data);
    if (model.edges) {
      model.edges.forEach((e: any) => {
        // 调整线宽度
        let width = getTransactionLevel(
          e.data,
          minAmount.value,
          maxAmount.value,
          5
        );
        if (width) {
          e.attrs.line.strokeWidth = width;
          console.log(
            'e.attrs.line.strokeWidth >>> ',
            e.attrs.line.strokeWidth
          );
        }
      });
    }
  }
  if (props.dbData != null) {
    model = props.dbData;
  }

  // 渲染数据
  graph.value?.fromJSON(model);
  onCenterContent();

  // 缩放至合适位置
  graph.value?.zoomToFit();
};

// 节点渲染
const renderNodes = () => {
  // 注册自定义节点
  register({
    shape: 'custom-vue-node',
    inherit: 'vue-shape',
    width: graphConfig.node.width,
    height: graphConfig.node.height,
    // component: NodeComponent,
    component: {
      // 使用vue3的render渲染组件，并添加自定义事件
      render() {
        return h(NodeComponent, {
          // 事件名称前面必须添加 `on`
          onPin: (val: string) => {
            onCenrerNode(val);
          },
          onDrillUp: (val: string) => {
            console.log('onDrillUp');
          },
          onDrillDown: (val: string) => {
            console.log('onDrillDown');
          },
          onDrillConfig: (val: string) => {
            console.log('onDrillConfig');
          },
        });
      },
    },
  });

  originData.value?.edges.phone.forEach((edge) => {
    // edge.type = 'phone';
    data.edges.push(buildEdge(edge));
  });

  originData.value?.edges.money.forEach((edge) => {
    // edge.type = 'money';
    data.edges.push(buildEdge(edge));
  });

  originData.value?.nodes.forEach(({ id, label }) => {
    data.nodes.push(buildNode(id, label));
  });

  // 渲染数据
  renderData();

  // // 初始化节点
  // graph.value.addNodes(data.nodes);
  // graph.value.addEdges(data.edges);

  // 节点-双击：节点居中
  graph.value?.on('node:dblclick', ({ view }) => {
    if (view && view.cell && view.cell.id) {
      onCenrerNode(view.cell.id);
    }
  });

  /** 节点选中事件 */
  graph.value?.on('node:selected', ({ node }) => {
    console.log('node:selected:', node);

    // 获取当前选中的节点 ID
    const selectedNodeId = node.id;

    // 获取所有节点和边
    const allNodes = graph.value?.getNodes();
    const allEdges = graph.value?.getEdges();

    // 寻找与选中节点相连的节点
    if (allEdges) {
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

      allNodes?.forEach((n) => {
        if (n.id !== selectedNodeId && !connectedNodeIds.includes(n.id)) {
          let data = n.getData();
          data.blur = true;
          n.removeData();
          n.setData(data);
        }
      });
    }

    // 边：虚化与当前选中节点不相连的边
    allEdges?.forEach((e) => {
      const sourceNode = e.getSourceNode();
      const targetNode = e.getTargetNode();

      if (
        sourceNode &&
        targetNode &&
        sourceNode.id !== selectedNodeId &&
        targetNode.id !== selectedNodeId
      ) {
        e.attr('line/stroke', graphConfig.color.filter.stroke);
        e.setAttrByPath('data/data/isFilter', true);

        const size = e.labels.length;
        const originLabel = e.labels;

        for (let i = size - 1; i > -1; i--) {
          e.removeLabelAt(0);
        }

        originLabel.forEach((label) => {
          let attrs = label.attrs;
          if (attrs) {
            attrs.label.stroke = graphConfig.color.filter.cell;
            attrs.label.fill = graphConfig.color.filter.cell;
            // attrs.rect.fill = graphConfig.color.filter.cell;
          }

          e.appendLabel(label);
        });
      }
    });
  });

  /** 节点取消选中事件 */
  graph.value?.on('node:unselected', () => {
    if (graph.value) {
      const allNodes = graph.value.getNodes();
      allNodes.forEach((n) => {
        let data = n.getData();
        data.blur = false;
        n.removeData();
        n.setData(data);
      });
    }

    if (graph.value) {
      const allEdges = graph.value.getEdges();
      // 恢复所有边的颜色
      allEdges.forEach((e) => {
        if (e.getAttrByPath('data/data/isFilter')) {
          const size = e.labels.length;
          const originLabel = e.labels;

          for (let i = size - 1; i > -1; i--) {
            e.removeLabelAt(0);
          }

          originLabel.forEach((label) => {
            let attrs = label.attrs;
            if (attrs) {
              let labelType = attrs.label.type;
              if (labelType === 'money') {
                e.attr('line/stroke', graphConfig.color.edge.line.money); // 恢复边原始颜色
                attrs.label.stroke = graphConfig.color.edge.label.text.money;
                attrs.label.fill = graphConfig.color.edge.label.text.money;
                // attrs.rect.fill = graphConfig.color.edge.label.bg.money;
              } else {
                e.attr('line/stroke', graphConfig.color.edge.line.phone);
                attrs.label.stroke = graphConfig.color.edge.label.text.phone;
                attrs.label.fill = graphConfig.color.edge.label.text.phone;
                // attrs.rect.fill = graphConfig.color.edge.label.bg.phone;
              }
            }

            e.appendLabel(label);
          });
        }
      });
    }
  });

  /** 框选事件 */
  graph.value?.on('selection:changed', ({ selected }) => {
    console.log('seletion >>>>', selected);

    // 过滤勾选节点
    if (selected && selected.length > 1) {
      const parent = document.getElementsByClassName('custom-selection')[0];
      if (parent) {
        parent.addEventListener('contextmenu', showMenu, true); // 使用捕获阶段
      }
    }
  });
};
const isMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });

const showMenu = (event: MouseEvent) => {
  event.preventDefault();
  // 确保 menuPosition 只在菜单可见时设置
  menuPosition.value = { x: event.clientX, y: event.clientY };
  isMenuVisible.value = true;
};
// 隐藏右键菜单
const hideMenu = () => {
  isMenuVisible.value = false;
};

const onCenterContent = () => {
  graph.value?.centerContent();
};
const onCenrerNode = (nodeId: string) => {
  const node = graph.value?.getCellById(nodeId);
  if (node) {
    graph.value?.centerCell(node);
  }
};

/** 节点查询 */
const nodeNameSearch = ref('');
const searchForNode = (nodeName: string) => {
  const nodeId = nodeName.toLowerCase();
  onCenrerNode(nodeId);
};
const searchNodeByName = () => {
  const allNodes = graph.value?.getNodes();

  allNodes?.forEach((n) => {
    if (n && n.getData() && n.getData().nodeName == nodeNameSearch.value) {
      searchForNode(n.id);
    }
  });
};

/** 撤销重做 */
const canUndo = ref(false);
const canRedo = ref(false);
const onUndo = () => {
  if (graph.value && graph.value.canUndo()) {
    graph.value.undo();
  }
};
const onRedo = () => {
  if (graph.value && graph.value.canRedo()) {
    graph.value.redo();
  }
};

/** 导出 */
const exportToPng = () => {
  // graph.value.exportPNG("导出测试", {
  //   quality: 1,
  // });
  const container = document.getElementsByClassName('x6-graph-svg')[0];
  htmlToImage.toPng(container as HTMLElement).then((dataUri) => {
    const link = document.createElement('a');
    link.download = '导出.png';
    link.href = dataUri;
    link.click();
  });
};

const exportData = () => {
  const data = graph.value.toJSON();
  const blob = new Blob([JSON.stringify(data)], { type: '' });
  FileSaver.saveAs(blob, 'demo.json');
};

onMounted(async () => {
  nextTick(() => {
    originData.value = props.graphData;
    renderGraph();
    if (graph && graph.value) {
      renderNodes();
    }
  });
});

onUnmounted(() => {});
</script>
<style lang="scss">
#container {
  width: 100%;
  height: 100%;
  position: relative;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.custom-context-menu {
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 5px;
}

.custom-context-menu div {
  padding: 8px 12px;
  cursor: pointer;
}

.custom-context-menu div:hover {
  background-color: #f5f5f5; /* 鼠标悬停效果 */
}
</style>
