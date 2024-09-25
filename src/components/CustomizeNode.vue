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
import { circle } from "@antv/x6/lib/registry/marker/circle";
import { Vertices } from "@antv/x6/lib/registry/tool/vertices";

// 将组件内部的模板“传送”到该组件的 DOM 结构外层的位置（无敌重要！让节点的菜单模板可以在父组件生效）
const TeleportContainer = getTeleport();
const graph = ref<Graph>();

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
        money: "blue",
        phone: "purple",
      },

      bg: {
        money: "yellow",
        phone: "pink",
      },
    },
    line: {
      money: "blue",
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
  } else {
    lineColor = graphColor.edge.line.phone;
    fromPortType = "phone";
    toPortType = "phone";
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
    },
    router: {
      // name: "metro",
      name: "manhattan",
      // args:{
      //   startDirections:['right'],
      //   endDirections:['bottom']
      // }
    },
    // connector: 'smooth',
  };
};

originData.edges.phone.forEach((edge) => {
  edge.type = "phone";
  data.edges.push(buildEdge(edge));
});

originData.edges.money.forEach((edge) => {
  edge.type = "money";
  data.edges.push(buildEdge(edge));
});

// 节点端口构建
const nodePorts = (currenNode: String) => {
  const items = [{ group: "phone", id: "phone" }];
  const ports = nodesPorts[currenNode];
  if (ports) {
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
            magnet: true,
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
            magnet: true,
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
            magnet: true,
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

originData.nodes.forEach(({ id, label }) => {
  data.nodes.push(buildNode(id, label));
});

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
    height: 480,
    width: 1280,
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
    debugger;
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
