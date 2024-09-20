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
import { nextTick, onMounted, ref, onUnmounted } from "vue";
import { Graph, Path } from "@antv/x6";
import { Scroller } from "@antv/x6-plugin-scroller";
import { Selection } from "@antv/x6-plugin-selection";
import { Export } from "@antv/x6-plugin-export";
import { History } from "@antv/x6-plugin-history";
import { register, getTeleport } from "@antv/x6-vue-shape";
import NodeComponent from "./Node.vue";
import { DagreLayout } from "@antv/layout";

// 将组件内部的模板“传送”到该组件的 DOM 结构外层的位置（无敌重要！让节点的菜单模板可以在父组件生效）
const TeleportContainer = getTeleport();
const graph = ref<Graph>();

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

// 原始数据
const originData = {
  nodes: [
    {
      id: "n0",
      label: "张三",
    },
    {
      id: "n1",
      label: "李四",
    },
    {
      id: "n2",
      label: "王五",
    },
    {
      id: "n3",
      label: "马六",
    },
    {
      id: "n4",
      label: "张一",
    },
    {
      id: "n5",
      label: "张二",
    },
    {
      id: "n6",
      label: "张五",
    },
    {
      id: "n7",
      label: "张六",
    },
    {
      id: "n8",
      label: "SOLO",
    },
  ],
  edges: {
    money: [
      {
        from: "n0",
        to: "n1",
        amount: 2000,
        count: 20,
        startDate: "20200101",
        endDate: "20210207",
      },
      {
        from: "n1",
        to: "n0",
        amount: 200,
        count: 10,
        startDate: "20110701",
        endDate: "20230405",
      },
      {
        from: "n2",
        to: "n1",
        amount: 2000,
        count: 20,
        startDate: "20200101",
        endDate: "20210207",
      },
      {
        from: "n1",
        to: "n2",
        amount: 200,
        count: 10,
        startDate: "20110701",
        endDate: "20230405",
      },
      {
        from: "n3",
        to: "n2",
        amount: 2000,
        count: 10,
        startDate: "20200101",
        endDate: "20210207",
      },
      {
        from: "n2",
        to: "n3",
        amount: 200,
        count: 10,
        startDate: "20110701",
        endDate: "20230405",
      },
      {
        from: "n4",
        to: "n6",
        amount: 2000,
        count: 10,
        startDate: "20200101",
        endDate: "20210207",
      },
      {
        from: "n6",
        to: "n4",
        amount: 200,
        count: 10,
        startDate: "20110701",
        endDate: "20230405",
      },
      {
        from: "n5",
        to: "n3",
        amount: 2000,
        count: 10,
        startDate: "20200101",
        endDate: "20210207",
      },
      {
        from: "n3",
        to: "n5",
        amount: 200,
        count: 10,
        startDate: "20110701",
        endDate: "20230405",
      },
      {
        from: "n3",
        to: "n7",
        amount: 150,
        count: 8,
        startDate: "20110701",
        endDate: "20230405",
      },
      {
        from: "n2",
        to: "n6",
        amount: 120,
        count: 5,
        startDate: "20110701",
        endDate: "20230405",
      },
      {
        from: "n3",
        to: "n4",
        amount: 190,
        count: 5,
        startDate: "20110701",
        endDate: "20230405",
      },
    ],
    phone: [
      {
        from: "n0",
        to: "n1",
        count: 20,
        startDate: "20120701",
        endDate: "20230405",
      },
      {
        from: "n6",
        to: "n1",
        count: 20,
        startDate: "20120701",
        endDate: "20230405",
      },
      {
        from: "n3",
        to: "n1",
        count: 20,
        startDate: "20120701",
        endDate: "20230405",
      },
      {
        from: "n3",
        to: "n2",
        count: 20,
        startDate: "20120701",
        endDate: "20230405",
      },
    ],
  },
};

// 节点数据
const data = {
  nodes: [],
  edges: [],
};
const buildNode = (id: String, label: String) => {
  return {
    id: id,
    shape: "custom-vue-node",
    x: 0,
    y: 0,
    label: label,
    data: {
      nodeId: id,
      nodeName: label,
      blur: false,
    },
  };
};
originData.nodes.forEach(({ id, label }) => {
  data.nodes.push(buildNode(id, label)); // 使用解构提取 id 和 label
});

// 合并分支数据
const mergeEdges = (edges) => {
  const mergedEdges = {};

  for (const type in edges) {
    mergedEdges[type] = {};

    for (const edge of edges[type]) {
      const key =
        edge.from < edge.to
          ? `${edge.from}-${edge.to}`
          : `${edge.to}-${edge.from}`;

      if (!mergedEdges[type][key]) {
        mergedEdges[type][key] = {
          shape: "edge",
          source: edge.from,
          target: edge.to,
          zIndex: 1,
          connector: "pointConnector",
          labels: [],
          attrs: {
            // line 是选择器名称，选中的边的 path 元素
            line: {
              stroke: "#315098",
              strokeWidth: 0,
              targetMarker: "classic",
              sourceMarker: "classic",
            },
          },
        };
      }

      mergedEdges[type][key].attrs.line.strokeWidth++;

      // 标签数目
      let size = mergedEdges[type][key].labels
        ? mergedEdges[type][key].labels.length
        : 0;

      let distance;
      let labelText;
      let labelColor;
      let currentOffset = -50 + size * 60;
      if (type === "money") {
        labelText = edge.from + " " + edge.count + "笔 共" + edge.amount + "笔";
        labelColor = "#393f45";
        distance = 0.5;
      } else {
        labelText = "通话" + edge.count + "次";
        labelColor = "#37a987";
        distance = 0.7;
      }

      mergedEdges[type][key].labels.push({
        attrs: {
          label: {
            type: type,
            text: labelText,
            fill: labelColor,
            stroke: labelColor,
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
      });
    }
  }

  for (const type in mergedEdges) {
    mergedEdges[type] = Object.values(mergedEdges[type]);
  }

  return mergedEdges;
};
const mergedEdges = mergeEdges(originData.edges);
data.edges = mergedEdges.money;
data.edges.push(...mergedEdges.phone);
const originalColors = {
  nodes: [],
  edges: [],
  labels: [],
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

  const dagreLayout = new DagreLayout({
    type: "dagre",
    rankdir: "LR",
    align: "UR",
    ranksep: 75,
    nodesep: 55,
  });
  const model = dagreLayout.layout(data);
  graph.value.fromJSON(model);

  // // 初始化节点
  // graph.value.addNodes(data.nodes);
  // graph.value.addEdges(data.edges);

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

        originLabel.forEach((label, index) => {
          label.attrs.rect.fill = "rgba(0,0,0,.1)";
          label.attrs.label.stroke =
            label.attrs.label.type === "money" ? "#393f45" : "#37a987";
          label.attrs.label.fill =
            label.attrs.label.type === "money" ? "#393f45" : "#37a987";
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
