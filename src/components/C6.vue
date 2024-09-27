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
  </el-row>
  <div id="graph_container"></div>
  <TeleportContainer />
</template>

<script lang="ts" setup>
import * as htmlToImage from "html-to-image";
import { Back, Right, Search } from "@element-plus/icons-vue";
import { nextTick, onMounted, ref, onUnmounted, ReactiveFlags } from "vue";
import { EdgeView, Graph, Path } from "@antv/x6";
import { Scroller } from "@antv/x6-plugin-scroller";
import { Selection } from "@antv/x6-plugin-selection";
import { Export } from "@antv/x6-plugin-export";
import { History } from "@antv/x6-plugin-history";
import { register, getTeleport } from "@antv/x6-vue-shape";
import NodeComponent from "./Node.vue";
import { DagreLayout } from "@antv/layout";
import { circle } from "@antv/x6/lib/registry/marker/circle";
import { Vertices } from "@antv/x6/lib/registry/tool/vertices";
import { er } from "@antv/x6/lib/registry/router/er";
import axios from "axios";
import { bottom, left, right } from "@antv/x6/lib/registry/port-layout/line";
import { Connector } from "@antv/x6/lib/registry";

// 将组件内部的模板“传送”到该组件的 DOM 结构外层的位置（无敌重要！让节点的菜单模板可以在父组件生效）
const TeleportContainer = getTeleport();
const graph = ref<Graph>();
const ranksep = 100;
const nodesep = 60;
const maxAmount = ref(0);
const minAmount = ref(0);
const sortedTransactions = [];
// 计算角度
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

// 原始数据
const originData = ref(null);

// 画布颜色配置
const graphColor = {
  graph: "#F2F7FA",
  filter: {
    cell: "rgba(0,0,0,0)",
    stroke: "rgba(0,0,0,.1)",
  },
  edge: {
    label: {
      text: {
        money: "#36121e",
        phone: "purple",
      },

      bg: {
        // money: "yellow",
        // phone: "pink",
      },
    },
    line: {
      money: "#36121e",
      phone: "grey",
    },
    port: {
      moneyIn: "blue",
      moneyOut: "green",
      phone: "purple",
      stroke: "black",
    },
  },
};
// 节点数据
const data = {
  nodes: [],
  edges: [],
};

// 构建标签
const buildLabel = (edge: any) => {
  let labelText;
  let labelColor;
  let labelBg;
  if (edge.type === "money") {
    labelText = "转账 " + edge.count + "笔 共" + edge.amount + "元";
    labelColor = graphColor.edge.label.text.money;
    labelBg = graphColor.edge.label.bg.money;
  } else {
    labelText = "通话" + edge.count + "次";
    labelColor = graphColor.edge.label.text.phone;
    labelBg = graphColor.edge.label.bg.phone;
  }
  return {
    attrs: {
      label: {
        type: edge.type,
        text: labelText,
        fill: labelColor,
        stroke: labelColor,
      },
      rect: {
        ref: "label",
        fill: labelBg,
      },
    },
  };
};

// 节点端口数据
const nodesPorts = {};

// 构建边
const buildEdge = (edge: any) => {
  let currentNode = edge.from;
  let nextNode = edge.to;

  let lineColor = "";

  let fromPortType = "";
  let toPortType = "";
  let paddingBottom = 30;

  if (edge.type != "phone") {
    lineColor = graphColor.edge.line.money;

    fromPortType = "moneyOut" + "_" + nextNode;
    toPortType = "moneyIn" + "_" + currentNode;

    let fromArray = [];
    let toArray = [];

    if (nodesPorts[currentNode]) {
      toArray = nodesPorts[currentNode]["to"];
    } else {
      nodesPorts[currentNode] = {};
      nodesPorts[currentNode]["from"] = [];
      nodesPorts[currentNode]["to"] = [];
    }
    toArray.push(nextNode);

    nodesPorts[currentNode]["to"] = toArray;

    if (nodesPorts[nextNode]) {
      fromArray = nodesPorts[nextNode]["from"];
    } else {
      nodesPorts[nextNode] = {};
      nodesPorts[nextNode]["from"] = [];
      nodesPorts[nextNode]["to"] = [];
    }
    fromArray.push(currentNode);
    nodesPorts[nextNode]["from"] = fromArray;

    paddingBottom = (toArray.length + fromArray.length) * paddingBottom;
  } else {
    lineColor = graphColor.edge.line.phone;
    fromPortType = "phone";
    toPortType = "phone";
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
    sortedTransactions.push(edge.amount);
  }

  return {
    shape: "edge",
    source: { cell: edge.from, port: fromPortType },
    target: { cell: edge.to, port: toPortType },
    zIndex: 1,
    labels: [buildLabel(edge)],
    attrs: {
      line: {
        stroke: lineColor,
        strokeWidth: 1,
        targetMarker: "classic",
      },
    },
    data: {
      isFilter: false,
      amount: edge.amount,
    },
    router: {
      name: "metro",
      // name: "manhattan",
      // name:'orth'
      args: {
        padding: {
          top: 45,
          left: 45,
        },
        endDirections: ["left"],
      },
    },
    connector: {
      name: "rounded",
      args: {
        radius: 45,
      },
    },
    // connector: "pointConnector",
  };
};

// 节点端口构建
const nodePorts = (currenNode: String) => {
  const items = [{ group: "phone", id: "phone" }];
  const ports = nodesPorts[currenNode];
  if (ports) {
    if (currenNode == "6231139901000023075") {
      console.log("from >>>", ports["from"]);
      console.log("to >>>", ports["to"]);
    }
    ports["from"].forEach((n) => {
      let portId = "moneyIn" + "_" + n;
      items.push({
        group: "moneyIn",
        id: portId,
        // attrs: { text: { text: portId } },
      });
    });
    ports["to"].forEach((n) => {
      let portId = "moneyOut" + "_" + n;
      items.push({
        group: "moneyOut",
        id: portId,
        // attrs: { text: { text: portId } },
      });
    });
  }

  return {
    items: items,
    groups: {
      moneyIn: {
        position: { name: "left" },
        attrs: {
          circle: {
            magnet: false,
            stroke: graphColor.edge.port.stroke,
            fill: graphColor.edge.port.moneyIn,
            r: 2,
          },
        },
        zIndex: 1,
      },
      moneyOut: {
        position: { name: "right" },
        attrs: {
          circle: {
            magnet: false,
            stroke: graphColor.edge.port.stroke,
            fill: graphColor.edge.port.moneyOut,
            r: 2,
          },
        },
        zIndex: 1,
      },
      phone: {
        position: { name: "bottom" },
        attrs: {
          circle: {
            magnet: false,
            stroke: graphColor.edge.port.stroke,
            fill: graphColor.edge.port.phone,
            r: 2,
          },
        },
        zIndex: 1,
      },
    },
  };
};

// 节点构建
const buildNode = (id: String, label: String) => {
  return {
    id: id,
    shape: "custom-vue-node",
    x: 0,
    y: 0,
    zIndex: 2,
    label: label + "_" + id,
    data: {
      nodeId: id,
      nodeName: label + "_" + id,
      blur: false,
    },
    ports: nodePorts(id),
  };
};

const originalColors = {
  nodes: [],
  edges: [],
  labels: [],
};

// 画布渲染
const renderGraph = () => {
  // 初始化画布
  graph.value = new Graph({
    container: document.getElementById("graph_container")!,
    mousewheel: {
      enabled: true,
      modifiers: "ctrl",
      factor: 1.1,
      maxScale: 1.5,
      minScale: 0.5,
    },
    background: {
      color: graphColor.graph,
    },
  });

  // 滚动画布
  graph.value.use(
    new Scroller({
      enabled: true,
      height: 640,
      width: 1024,
      autoResize: true,
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
      showEdgeSelectionBox: true,
    })
  );
};

// 布局
const dagreLayout = new DagreLayout({
  type: "dagre",
  rankdir: "LR",
  align: "DR",
  ranksep: ranksep,
  nodesep: nodesep,
});

const getTransactionLevel = (amount) => {
  const range = (maxAmount.value - minAmount.value) / 5;

  if (amount >= minAmount.value && amount < minAmount.value + range) {
    return 1;
  } else if (
    amount >= minAmount.value + range &&
    amount < minAmount.value + 2 * range
  ) {
    return 1.5;
  } else if (
    amount >= minAmount.value + 2 * range &&
    amount < minAmount.value + 3 * range
  ) {
    return 2;
  } else if (
    amount >= minAmount.value + 3 * range &&
    amount < minAmount.value + 4 * range
  ) {
    return 2.5;
  } else if (
    amount >= minAmount.value + 4 * range &&
    amount <= maxAmount.value
  ) {
    return 3;
  } else {
    return null;
  }
};

// 渲染数据
const renderData = () => {
  const model = dagreLayout.layout(data);
  const nodePositionMap = {};
  const axisMap = {
    x: {},
    y: {},
  };

  model.nodes.forEach((e) => {
    nodePositionMap[e.id] = e;

    // 同X轴：5的偏差
    if (!axisMap.x[e.x]) {
      axisMap.x[e.x] = [];
    }
    axisMap.x[e.x].push(e);
    if (axisMap.x[e.x].length > 1) {
      e.x += axisMap.x[e.x].length * 5;
    }

    // 同y轴：20的偏差（2个节点以上）
    if (!axisMap.y[e.y]) {
      axisMap.y[e.y] = [];
    }
    axisMap.y[e.y].push(e);
    if (axisMap.y[e.y].length > 2) {
      e.y += axisMap.y[e.y].length * 5;
    }

    // if (axisMap.y[e.y].length > 2) {
    //   let portSize = 1;
    //   if (e.ports && e.ports.items && e.ports.items.length) {
    //     portSize += e.ports.items.length;
    //   }
    //   e.y += portSize * 20;
    // }
  });

  model.edges.forEach((e) => {
    // 调整线宽度
    let width = getTransactionLevel(e.data.amount);
    if (width) {
      e.attrs.line.strokeWidth = width;
      console.log("e.attrs.line.strokeWidth >>> ", e.attrs.line.strokeWidth);
    }

    // 调整线位置
    let source = nodePositionMap[e.source.cell];
    console.log("source >>>>", source.id);
    let target = nodePositionMap[e.target.cell];
    console.log("target >>>>", target.id);

    let sourcePorts = nodesPorts[source.id].to;
    let targetPorts = nodesPorts[target.id].from;

    let sourceIndex = sourcePorts.indexOf(target.id) + 1;
    let targetIndex = targetPorts.indexOf(source.id) + 1;

    const angle = getAngle(source.x, target.x, target.y, target.y);

    console.log("angle >>>>", angle);

    if (angle > 135 && angle < 151) {
      e["vertices"] = [
        {
          x: source.x + sourceIndex * 15,
          y: target.y + sourceIndex * 10,
        },
        {
          x: source.x - 10 - targetIndex * 10,
          y: target.y + 50 + targetIndex * 10,
        },
      ];
    }
    if (angle > 150 && angle < 181) {
      e["vertices"] = [
        {
          x: source.x + sourceIndex * 15,
          y: target.y + sourceIndex * 10,
        },
        {
          x: source.x - 10 - targetIndex * 10,
          y: target.y + 50 + targetIndex * 10,
        },
      ];
    }

    if (angle > 180 && angle < 201) {
      e["vertices"] = [
        {
          x: source.x + 10 + sourceIndex * 15,
          y: target.y + 100 + sourceIndex * 10,
        },
        {
          x: source.x - 10 - targetIndex * 10,
          y: target.y + 100 + targetIndex * 10,
        },
      ];
    }
    if (angle > 200 && angle < 225) {
      e["vertices"] = [
        {
          x: source.x + 10 + sourceIndex * 15,
          y: target.y + sourceIndex * 10,
        },
        {
          x: source.x - 10 - targetIndex * 10,
          y: target.y + 100 + targetIndex * 10,
        },
      ];
    }
    // if (angle > 340 && angle < 360) {
    //   e["vertices"] = [
    //     {
    //       x: source.x + 80 + sourceIndex * 15,
    //       y: target.y + 30 +  sourceIndex * 10,
    //     },
    //     {
    //       // x: source.x - 10 - targetIndex * 10,
    //       // y: target.y  + targetIndex * 10,
    //     },
    //   ];
    // }
  });

  console.log(sortedTransactions);

  graph.value.fromJSON(model);

  // 画布缩放
  graph.value.zoom(-0.6);

  // 画布居中
  onCenrerNode("n3");
};

// 节点渲染
const renderNodes = () => {
  // 注册自定义节点
  register({
    shape: "custom-vue-node",
    inherit: "vue-shape",
    width: 80,
    height: 100,
    component: NodeComponent,
  });

  originData.value.edges.phone.forEach((edge) => {
    edge.type = "phone";
    data.edges.push(buildEdge(edge));
  });

  originData.value.edges.money.forEach((edge) => {
    edge.type = "money";
    data.edges.push(buildEdge(edge));
  });

  originData.value.nodes.forEach(({ id, label }) => {
    data.nodes.push(buildNode(id, label));
  });

  // 渲染数据
  renderData();

  // // 初始化节点
  // graph.value.addNodes(data.nodes);
  // graph.value.addEdges(data.edges);

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

    // 边：虚化与当前选中节点不相连的边
    allEdges.forEach((e) => {
      if (
        e.getSourceNode().id !== selectedNodeId &&
        e.getTargetNode().id !== selectedNodeId
      ) {
        e.attr("line/stroke", graphColor.filter.stroke);
        e.setAttrByPath("data/data/isFilter", true);

        const size = e.labels.length;
        const originLabel = e.labels;

        for (let i = size - 1; i > -1; i--) {
          e.removeLabelAt(0);
        }

        originLabel.forEach((label, index) => {
          label.attrs.label.stroke = graphColor.filter.cell;
          label.attrs.label.fill = graphColor.filter.cell;
          label.attrs.rect.fill = graphColor.filter.cell;
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
      if (e.getAttrByPath("data/data/isFilter")) {
        const size = e.labels.length;
        const originLabel = e.labels;

        for (let i = size - 1; i > -1; i--) {
          e.removeLabelAt(0);
        }

        originLabel.forEach((label, index) => {
          let labelType = label.attrs.label.type;
          if (labelType === "money") {
            e.attr("line/stroke", graphColor.edge.line.money); // 恢复边原始颜色
            label.attrs.label.stroke = graphColor.edge.label.text.money;
            label.attrs.label.fill = graphColor.edge.label.text.money;
            label.attrs.rect.fill = graphColor.edge.label.bg.money;
          } else {
            e.attr("line/stroke", graphColor.edge.line.phone);
            label.attrs.label.stroke = graphColor.edge.label.text.phone;
            label.attrs.label.fill = graphColor.edge.label.text.phone;
            label.attrs.rect.fill = graphColor.edge.label.bg.phone;
          }

          e.appendLabel(label);
        });
      }
    });
  });

  /** 渲染勾选节点 */
  const renderSelectionNodes = (selected) => {
    const selectedNodes = selected.map((e) => e.id);
    // 过滤选中节点
    const nodes = data.nodes.filter((n) => selectedNodes.includes(n.id));
    console.log("selectedNodes >>>>", nodes);
    // 过滤选中节点相关边
    const edges = data.edges.filter(
      (e) =>
        selectedNodes.includes(e.source.cell) &&
        selectedNodes.includes(e.target.cell)
    );
    console.log("selectedEdges >>>>", edges);

    data.nodes = nodes;
    data.edges = edges;

    renderData();
  };

  /** 框选事件 */
  graph.value.on("selection:changed", ({ selected }) => {
    console.log("seletion >>>>", selected);

    // 过滤勾选节点
    if (selected && selected.length > 1) {
      // renderSelectionNodes(selected);
    }
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

/** 节点查询 */
const nodeNameSearch = ref("");
const searchForNode = (nodeName: string) => {
  const nodeId = nodeName.toLowerCase();
  onCenrerNode(nodeId);
};
const searchNodeByName = () => {
  const allNodes = graph.value.getNodes();
  allNodes.forEach((n) => {
    if (n && n.getData() && n.getData().nodeName == nodeNameSearch.value) {
      searchForNode(n.id);
    }
  });
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
  const container = document.getElementsByClassName("x6-graph-svg")[0];
  htmlToImage.toPng(container as HTMLElement).then((dataUri) => {
    const link = document.createElement("a");
    link.download = "导出.png";
    link.href = dataUri;
    link.click();
  });
};

const customSort = (arr) => {
  // 统计每个 from 和 to 的出现次数
  const fromCountMap = new Map();
  const toCountMap = new Map();
  arr.forEach((item) => {
    if (!fromCountMap.has(item.from)) {
      fromCountMap.set(item.from, 0);
    }
    fromCountMap.set(item.from, fromCountMap.get(item.from) + 1);

    if (!toCountMap.has(item.to)) {
      toCountMap.set(item.to, 0);
    }
    toCountMap.set(item.to, toCountMap.get(item.to) + 1);
  });

  return arr.sort((a, b) => {
    const fromCountDiff = fromCountMap.get(b.from) - fromCountMap.get(a.from);
    console.log(
      `Comparing ${a.from} and ${b.from}, fromCountDiff: ${fromCountDiff}`
    );
    if (fromCountDiff !== 0) {
      return fromCountDiff;
    }
    const toCountDiff = toCountMap.get(b.to) - toCountMap.get(a.to);
    console.log(`Comparing ${a.to} and ${b.to}, toCountDiff: ${toCountDiff}`);
    return toCountDiff;
  });
};
const readData = () => {
  const money = [
    {
      from: "n0",
      to: "n8",
      amount: 906000,
      count: 5,
      startDate: "2015-08-17",
      endDate: "2016-10-02",
    },
    {
      from: "n1",
      to: "n2",
      amount: 21500,
      count: 3,
      startDate: "2023-10-21",
      endDate: "2024-01-06",
    },
    {
      from: "n1",
      to: "n7",
      amount: 21300,
      count: 86,
      startDate: "20200101",
      endDate: "20210207",
    },
    {
      from: "n1",
      to: "n3",
      amount: 150000,
      count: 141,
      startDate: "20110701",
      endDate: "20230405",
    },
    {
      from: "n2",
      to: "n9",
      amount: 5,
      count: 3235,
      startDate: "20200101",
      endDate: "20210207",
    },
    {
      from: "n2",
      to: "n3",
      amount: 1030,
      count: 1,
      startDate: "20110701",
      endDate: "20230405",
    },
    {
      from: "n2",
      to: "n6",
      amount: 8220,
      count: 5,
      startDate: "20200101",
      endDate: "20210207",
    },
    {
      from: "n2",
      to: "n1",
      amount: 69200,
      count: 6,
      startDate: "20110701",
      endDate: "20230405",
    },
    {
      from: "n3",
      to: "n7",
      amount: 15400,
      count: 42,
      startDate: "20200101",
      endDate: "20210207",
    },
    {
      from: "n3",
      to: "n1",
      amount: 3095.18,
      count: 87,
      startDate: "20110701",
      endDate: "20230405",
    },
    {
      from: "n7",
      to: "n1",
      amount: 150,
      count: 3,
      startDate: "20110701",
      endDate: "20230405",
    },
    {
      from: "n7",
      to: "n3",
      amount: 2771.5,
      count: 35,
      startDate: "20110701",
      endDate: "20230405",
    },
    {
      from: "n8",
      to: "n0",
      amount: 984,
      count: 62,
      startDate: "20110701",
      endDate: "20230405",
    },
    {
      from: "n9",
      to: "n7",
      amount: 7980.02,
      count: 3,
      startDate: "20110701",
      endDate: "20230405",
    },
    {
      from: "n9",
      to: "n6",
      amount: 11800,
      count: 4,
      startDate: "20110701",
      endDate: "20230405",
    },
    {
      from: "n9",
      to: "n3",
      amount: 99900,
      count: 40,
      startDate: "20110701",
      endDate: "20230405",
    },
    {
      from: "n9",
      to: "n2",
      amount: 20300,
      count: 18,
      startDate: "20110701",
      endDate: "20230405",
    },
  ];
  console.log(money);

  const nodes = [
    {
      id: "n0",
      label: "陈凤姣",
    },
    {
      id: "n1",
      label: "程以生（个人）",
    },
    {
      id: "n2",
      label: "丁勇",
    },
    {
      id: "n3",
      label: "丁勇（个人）",
    },
    {
      id: "n4",
      label: "高博",
    },
    {
      id: "n5",
      label: "林裕荣（个人）",
    },
    {
      id: "n6",
      label: "徐鹏",
    },
    {
      id: "n7",
      label: "徐鹏（个人）",
    },
    {
      id: "n8",
      label: "张文红",
    },
    {
      id: "n9",
      label: "其他",
    },
  ];
  const phone = [];
  const sortedData = customSort(money);

  console.log(sortedData);

  return {
    nodes: nodes,
    edges: {
      money: sortedData,
      phone: phone,
    },
  };
};


const dataToSend = {
  caseId: 1,
  queryList: [
    {
      cardNo: "511025198802091421",
      tradeCard: ["6231139901000023075"],
    },
    {
      cardNo: "511025198802092843",
      tradeCard: ["18272179"],
    },
    {
      cardNo: "511025198802092844",
      tradeCard: ["2088002822573801"],
    },
    {
      cardNo: "511025198802092845",
      tradeCard: ["6228480086109452374"],
    },
    {
      cardNo: "511025198802092846",
      tradeCard: ["6222021001037345441"],
    },
    {
      cardNo: "511025198802092847",
      tradeCard: ["6228480088424598873"],
    },
    {
      cardNo: "511025198802092848",
      tradeCard: ["622908398178980019"],
    },
    {
      cardNo: "511025198802092849",
      tradeCard: ["6230580000058864633"],
    },
    {
      cardNo: "511025198802092840",
      tradeCard: ["6228480086300701975"],
    },
    {
      cardNo: "511025198802092842",
      tradeCard: ["62262289035973856226"],
    },
  ],
};
const customAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL as any,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzI3MzQ1Mjk2LCJleHAiOjE3Mjc5NTAwOTZ9.sTP6Wmd8WxAcQ-7jaHvsCoEooTVnRmQQ6uuzYAwKKrUDjQRzY3dua6F0b5BUs9Owaof4KPFUNiDAP6NuMPAxAQ",
  },
});
const sendRequest = async () => {
  try {
    const response = await customAxios.post("/data/trade/query", dataToSend);
    return response.data.result;
  } catch (error) {
    console.log(error);
    return null;
  }
};


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
