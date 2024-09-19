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
    <!-- <el-col :span="4">
      <el-button type="primary" @click="exportToPng">导出图片</el-button>
    </el-col> -->
  </el-row>
  <div id="graph_container"></div>
  <TeleportContainer />
</template>

<script lang="ts" setup>
import * as htmlToImage from 'html-to-image';
import { Back, Right, Search } from "@element-plus/icons-vue";
import { nextTick, onMounted, ref, onUnmounted } from "vue";
import { Graph, Path, Cell } from "@antv/x6";
import { Scroller } from "@antv/x6-plugin-scroller";
import { Selection } from "@antv/x6-plugin-selection";
import { Export } from "@antv/x6-plugin-export";
import { History } from "@antv/x6-plugin-history";
import { register, getTeleport } from "@antv/x6-vue-shape";
import NodeComponent from "./Node.vue";

// 将组件内部的模板“传送”到该组件的 DOM 结构外层的位置（无敌重要！让节点的菜单模板可以在父组件生效）
const TeleportContainer = getTeleport();
const graph = ref<Graph>();

const nodeNameSearch = ref("");
const searchNodeByName = () => {
  const allNodes = graph.value.getNodes();
  allNodes.forEach((n) => {
    if (n && n.getData() && n.getData().nodeName == nodeNameSearch.value) {
      searchForNode(n.id);
    }
  });
};

// Register connector
const graphRegister = () => {
  Graph.registerConnector(
    "single-left-right-top-connector",
    (s, e) => {
      const v1 = hypotenuse(200, 70);
      const c1 = { x: s.x + v1.linbian, y: s.y - v1.duibian };
      const v2 = hypotenuse(200, 20);
      const c2 = { x: e.x - v2.linbian, y: e.y + v2.duibian };

      const pathArr = [];
      pathArr.push(`M ${s.x} ${s.y}`);
      pathArr.push(`C ${c1.x} ${c1.y} ${c2.x} ${c2.y}  ${e.x} ${e.y}`);
      const paths = Path.normalize(pathArr.join(" "));
      return paths;
    },
    true
  );
  Graph.registerConnector(
    "single-left-right-bottom-connector",
    (s, e) => {
      const v1 = hypotenuse(200, 10);
      const c1 = { x: s.x + v1.linbian, y: s.y - v1.duibian };
      const v2 = hypotenuse(200, 70);
      const c2 = { x: e.x - v2.linbian, y: e.y + v2.duibian };

      const pathArr = [];
      pathArr.push(`M ${s.x} ${s.y}`);
      pathArr.push(`C ${c1.x} ${c1.y} ${c2.x} ${c2.y}  ${e.x} ${e.y}`);
      const paths = Path.normalize(pathArr.join(" "));
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
  const paths = Path.normalize(pathArr.join(" "));
  return paths;
};
Graph.unregisterConnector("pointConnector");
Graph.registerConnector("pointConnector", pointConnector);
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
  const paths = Path.normalize(pathArr.join(" "));
  return paths;
};
Graph.unregisterConnector("pointRightConnector");
Graph.registerConnector("pointRightConnector", pointRightConnector);
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
          stroke: label.type == "money" ? "#393f45" : "#37a987",
          type: label.type,
          fill: label.type == "money" ? "#393f45" : "#37a987",
        },
        rect: {
          ref: "label",
          fill: "rgba(0,0,0,.1)",
        },
      },
      position: {
        distance: distance,
        offset: currentOffset, // 动态计算偏移量
      },
    };
  });

  return {
    shape: "edge",
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
      stroke: "#8f8f8f",
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
      { group: "moneyIn", id: "moneyIn" },
      { group: "moneyOut", id: "moneyOut" },
      // { group: 'phone', id: 'phone' },
    ],
    groups: {
      moneyIn: {
        position: { name: "left" },
        attrs: {
          circle: {
            magnet: true,
            stroke: "#000",
            fill: "#315098",
            r: 0,
          },
        },
        zIndex: 1,
      },
      moneyOut: {
        position: { name: "right" },
        attrs: {
          circle: {
            magnet: true,
            stroke: "#000",
            fill: "#37a987",
            r: 0,
          },
        },
        zIndex: 1,
      },
      phone: {
        position: { name: "bottom" },
        attrs: {
          circle: {
            magnet: true,
            stroke: "#000",
            fill: "yellow",
            r: 0,
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
      id: "p1",
      shape: "custom-vue-node",
      x: 140,
      y: 200,

      label: "p1\n\n张三",
      zIndex: 10,
      attrs: nodeAttrs("rgba(95,149,255,0.9)"),
      ports: nodePorts(),
      data: {
        nodeId: "p1",
        nodeName: "张三",
        blur: false,
      },
    },
    {
      id: "p2",
      shape: "custom-vue-node",
      x: 440,
      y: 240,

      label: "p2\n\n李四",
      zIndex: 10,
      attrs: nodeAttrs("rgba(255,149,255,0.9)"),
      ports: nodePorts(),
      data: {
        nodeId: "p2",
        nodeName: "李四",
        blur: false,
      },
    },
    {
      id: "p3",
      shape: "custom-vue-node",
      x: 840,
      y: 140,

      label: "p3\n\n王五",
      zIndex: 10,
      attrs: nodeAttrs("rgba(95,255,255,0.9)"),
      ports: nodePorts(),
      data: {
        nodeId: "p3",
        nodeName: "王五",
        blur: false,
      },
    },
    {
      id: "p4",
      shape: "custom-vue-node",
      x: 840,
      y: 440,
      label: "p4\n\n马六",
      zIndex: 10,
      attrs: nodeAttrs("rgba(95,149,255,0.9)"),
      ports: nodePorts(),
      data: {
        nodeId: "p4",
        nodeName: "马六",
        blur: false,
      },
    },
    {
      id: "p5",
      shape: "custom-vue-node",
      x: 540,
      y: 440,
      label: "p5\n\n张一",
      zIndex: 10,
      attrs: nodeAttrs("rgba(95,149,255,0.9)"),
      ports: nodePorts(),
      data: {
        nodeId: "p5",
        nodeName: "张一",
        blur: false,
      },
    },
    {
      id: "p6",
      shape: "custom-vue-node",
      x: 240,
      y: 540,
      label: "p6\n\n张二",
      zIndex: 10,
      attrs: nodeAttrs("rgba(0,149,0,0.9)"),
      ports: nodePorts(),
      data: {
        nodeId: "p6",
        nodeName: "张二",
        blur: false,
      },
    },
    {
      id: "p7",
      shape: "custom-vue-node",
      x: 840,
      y: 640,
      label: "p7\n\n张五",
      zIndex: 10,
      attrs: nodeAttrs("rgba(95,0,0,0.9)"),
      ports: nodePorts(),
      data: {
        nodeId: "p7",
        nodeName: "张五",
        blur: false,
      },
    },
    {
      id: "p8",
      shape: "custom-vue-node",
      x: 1040,
      y: 240,
      label: "p8\n\n张六",
      zIndex: 10,
      attrs: nodeAttrs("rgba(95,0,255,0.9)"),
      ports: nodePorts(),
      data: {
        nodeId: "p8",
        nodeName: "张六",
        blur: false,
      },
    },
    {
      id: "p9",
      shape: "custom-vue-node",
      x: 1040,
      y: 440,
      label: "p9\n\nSOLO",
      zIndex: 10,
      attrs: nodeAttrs("rgba(35,0,255,0.9)"),
      ports: nodePorts(),
      data: {
        nodeId: "p9",
        nodeName: "SOLO",
        blur: false,
      },
    },
  ],
  edges: [
    edges(
      { cell: "p1", port: "moneyIn" },
      { cell: "p2", port: "moneyIn" },
      [
        {
          text: "张三 20笔 共2000万\n李四 10笔 200万\n20240902-20240902",
          type: "money",
        },
        { text: "通话20次\n20240902-20240902", type: "phone" },
      ],
      "#315098",
      "pointConnector",
      "classic",
      "classic"
    ),
    edges(
      { cell: "p3", port: "moneyIn" },
      { cell: "p2", port: "moneyIn" },
      [
        {
          text: "王五 20笔 共2000万\n李四 10笔 200万\n20240902-20240902",
          type: "money",
        },
      ],
      "#315098",
      "pointConnector",
      "classic",
      "classic"
    ),
    edges(
      { cell: "p4", port: "moneyIn" },
      { cell: "p3", port: "moneyIn" },
      [
        {
          text: "王五 10笔 200万\n马六 10笔 200万\n20240902-20240902",
          type: "money",
        },
        { text: "通话20次\n20240902-20240902", type: "phone" },
      ],
      "#315098",
      "pointConnector",
      "classic",
      "classic"
    ),
    edges(
      { cell: "p5", port: "moneyIn" },
      { cell: "p7", port: "moneyIn" },
      [
        {
          text: "张一 10笔 200万\n张五 10笔 200万\n20240902-20240902",
          type: "money",
        },
      ],
      "#315098",
      "pointConnector",
      "classic",
      "classic"
    ),
    edges(
      { cell: "p6", port: "moneyIn" },
      { cell: "p4", port: "moneyIn" },
      [
        {
          text: "张二 10笔 200万\n马六 10笔 200万\n20240902-20240902",
          type: "money",
        },
      ],
      "#315098",
      "pointConnector",
      "classic",
      "classic"
    ),
    edges(
      { cell: "p4", port: "moneyIn" },
      { cell: "p2", port: "moneyIn" },
      [
        {
          text: "马六 10笔 200万\n20240902-20240902",
          type: "money",
        },
        { text: "通话20次\n20240902-20240902", type: "phone" },
      ],
      "#315098",
      "pointConnector",
      "classic",
      null
    ),
    edges(
      { cell: "p4", port: "moneyIn" },
      { cell: "p8", port: "moneyIn" },
      [
        {
          text: "张六 10笔 200万\n20240902-20240902",
          type: "money",
        },
      ],
      "#315098",
      "pointConnector",
      "classic",
      null
    ),
    edges(
      { cell: "p3", port: "moneyIn" },
      { cell: "p7", port: "moneyIn" },
      [
        {
          text: "张五 10笔 200万\n20240902-20240902",
          type: "money",
        },
      ],
      "#315098",
      "pointConnector",
      "classic",
      null
    ),
    edges(
      { cell: "p4", port: "moneyIn" },
      { cell: "p5", port: "moneyIn" },
      [
        {
          text: "张一 10笔 200万\n20240902-20240902",
          type: "money",
        },
      ],
      "#315098",
      "pointConnector",
      "classic",
      null
    ),
    edges(
      { cell: "p7", port: "moneyOut" },
      { cell: "p2", port: "moneyOut" },
      [
        {
          text: "通话20次\n20240902-20240902",
          type: "phone",
          position: 0.8,
        },
      ],
      "#37a987",
      "pointRightConnector"
    ),
  ],
};
const originalColors = {
  nodes: [],
  edges: [],
  labels: [],
};
const filter = {
  name: "blur",
  args: { x: 13, y: 16 },
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
      shape: item.shape,
      x: item.x,
      y: item.y,
      width: 80,
      height: 100,
      label: `${index}: ${item.x.toFixed(0)},${item.y.toFixed(0)}`,
      data: item.data,
    });
    graph.value.addNode(node);
    nodeTemp.push(id);
  });
};

const renderGraph = () => {
  // 初始化画布
  graph.value = new Graph({
    container: document.getElementById("graph_container")!,
    height: 480,
    width: 960,
    mousewheel: {
      enabled: true,
      modifiers: "ctrl",
      factor: 1.1,
      maxScale: 1.5,
      minScale: 0.5,
    },
    background: {
      color: "#F2F7FA",
    },
  });

  // 滚动画布
  graph.value.use(
    new Scroller({
      enabled: true,
    })
  );

  // 历史记录
  graph.value.use(new History({ enabled: true }));
  graph.value.on("history:change", () => {
    canUndo.value = graph.value.canUndo();
    canRedo.value = graph.value.canRedo();
  });

  // 导出
  graph.value.use(new Export());

  // 双击-空白画布：画布内容居中对齐
  graph.value.on("blank:dblclick", () => {
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
    })
  );
};

const renderNodes = () => {
  // 注册自定义节点
  register({
    shape: "custom-vue-node",
    inherit: "vue-shape",
    width: 80,
    height: 100,
    component: NodeComponent,
  });

  // 初始化节点
  graph.value.addNodes(data.nodes);
  graph.value.addEdges(data.edges);

  // 画布节点对齐
  onCenterContent();

  // 节点-双击：节点居中
  graph.value.on("node:dblclick", ({ view }) => {
    if (view && view.cell && view.cell.id) {
      onCenrerNode(view.cell.id);
    }
  });

  /** 节点选中事件 */
  graph.value.on("node:selected", ({ node }) => {
    console.log("node:selected:", node);

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

    allNodes.forEach((n) => {
      if (n.id !== selectedNodeId && !connectedNodeIds.includes(n.id)) {
        let data = n.getData();
        data.blur = true;
        n.removeData();
        n.setData(data);
      }
    });

    // 边：保存原始颜色 && 虚化与当前选中节点不相连的边
    allEdges.forEach((e) => {
      if (!originalColors.edges[e.id]) {
        originalColors.edges[e.id] = e.attr("line/stroke");

        e.labels.forEach((label, index) => {
          originalColors.labels[e.id] = originalColors.labels[e.id] || {};
        });
      }
      if (
        e.getSourceNode().id !== selectedNodeId &&
        e.getTargetNode().id !== selectedNodeId
        // !connectedNodeIds.includes(e.getSourceNode().id) &&
        // !connectedNodeIds.includes(e.getTargetNode().id)
      ) {
        const filterColor = "rgba(0,0,0,0)";
        e.attr("line/stroke", "rgba(0,0,0,.1)");

        const size = e.labels.length;
        const originLabel = e.labels;

        for (let i = size - 1; i > -1; i--) {
          e.removeLabelAt(0);
        }

        debugger;

        originLabel.forEach((label, index) => {
          label.attrs.label.stroke = filterColor;
          label.attrs.label.fill = filterColor;
          label.attrs.rect.fill = filterColor;
          e.appendLabel(label);
        });
      }
    });
  });

  /** 节点取消选中事件 */
  graph.value.on("node:unselected", ({ node }) => {
    const allNodes = graph.value.getNodes();
    allNodes.forEach((n) => {
      let data = n.getData();
      data.blur = false;
      n.removeData();
      n.setData(data);
    });

    const allEdges = graph.value.getEdges();
    // 恢复所有边的颜色
    allEdges.forEach((e) => {
      if (originalColors.edges[e.id]) {
        e.attr("line/stroke", originalColors.edges[e.id]); // 恢复边原始颜色

        const size = e.labels.length;
        const originLabel = e.labels;

        for (let i = size - 1; i > -1; i--) {
          e.removeLabelAt(0);
        }

        debugger;

        originLabel.forEach((label, index) => {
          label.attrs.rect.fill = "rgba(0,0,0,.1)";
          label.attrs.label.stroke =
            label.attrs.label.type == "money" ? "#393f45" : "#37a987";
          label.attrs.label.fill =
            label.attrs.label.type == "money" ? "#393f45" : "#37a987";
          e.appendLabel(label);
        });
      }
    });
  });
};

/** 画布对齐 */
const onCenter = () => {
  graph.value.center();
};
const onCenterContent = () => {
  graph.value.centerContent();
};
const onCenrerNode = (nodeId: string) => {
  const node = graph.value.getCellById(nodeId);
  if (node) {
    graph.value.centerCell(node);
  }
};
const searchForNode = (nodeName: string) => {
  const nodeId = nodeName.toLowerCase();
  onCenrerNode(nodeId);
};

/** 撤销重做 */
const canUndo = ref(false);
const canRedo = ref(false);
const onUndo = () => {
  if (graph && graph.value.canUndo()) {
    graph.value.undo();
  }
};
const onRedo = () => {
  if (graph && graph.value.canRedo()) {
    graph.value.redo();
  }
};

/** 导出 */
const exportToPng = () => {
  // graph.value.exportPNG("导出测试", {
  //   quality: 1,
  // });
  const container =  document.getElementsByClassName("x6-graph-svg")[0];
  htmlToImage.toPng(container as HTMLElement).then((dataUri) => {
    const link = document.createElement('a');
    link.download = '导出.png';
    link.href = dataUri;
    link.click();
  });
};

onMounted(async () => {
  nextTick(() => {
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
</style>
