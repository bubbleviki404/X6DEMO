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
        @keyup.enter.native="searchNode"
        :suffix-icon="Search"
    /></el-col>
    <el-col :span="4">
      <el-button type="primary" @click="exportToPng"
        >导出图片</el-button
      ></el-col
    >
  </el-row>
  <div id="graph_container"></div>
</template>

<script lang="ts" setup>
import { Back, Right, Search } from "@element-plus/icons-vue";
import { nextTick, onMounted, ref, onUnmounted } from "vue";
import { Graph } from "@antv/x6";
import { Scroller } from "@antv/x6-plugin-scroller";
import { History } from "@antv/x6-plugin-history";
import { Selection } from "@antv/x6-plugin-selection";
import { Export } from "@antv/x6-plugin-export";

const data = {
  hello: {
    id: "hello",
    x: 32,
    y: 32,
    width: 100,
    height: 40,
    label: "Hello",
    attrs: {
      body: {
        stroke: "#8f8f8f",
        strokeWidth: 1,
        fill: "#fff",
        rx: 6,
        ry: 6,
      },
    },
  },
  world: {
    id: "world",
    shape: "circle",
    x: 160,
    y: 180,
    width: 60,
    height: 60,
    label: "World",
    attrs: {
      body: {
        stroke: "#8f8f8f",
        strokeWidth: 1,
        fill: "#fff",
      },
    },
  },
  rect: {
    id: "rect",
    x: -60,
    y: 100,
    width: 100,
    height: 40,
    label: "Rect",
    attrs: {
      body: {
        stroke: "#8f8f8f",
        strokeWidth: 1,
        fill: "#fff",
        rx: 6,
        ry: 6,
      },
    },
  },
};

const nodeNameSearch = ref("");
const searchNode = () => {
  searchForNode(nodeNameSearch.value);
};

const graph = ref<Graph>();

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

  // 节点渲染
  renderNodes();

  // 画布内容对齐
  onCenterContent();

  // 双击-空白画布：画布内容居中对齐
  graph.value.on("blank:dblclick", () => {
    onCenterContent();
  });

  // 历史记录
  graph.value.use(new History({ enabled: true }));
  graph.value.on("history:change", () => {
    canUndo.value = graph.value.canUndo();
    canRedo.value = graph.value.canRedo();
  });

  // 款选
  graph.value.use(
    new Selection({
      enabled: true,
      multiple: true,
      rubberband: true,
      movable: true,
      showNodeSelectionBox: true,
    })
  );

  // 导出
  graph.value.use(new Export());
};

const renderNodes = () => {
  // 节点数据加载
  graph.value.fromJSON({ nodes: Object.keys(data).map((key) => data[key]) });

  // 节点-右键：菜单
  graph.value.on("node:contextmenu", ({ view, e }) => {
    if (view && view.cell && view.cell.id) {
      selectedNodeId.value = view.cell.id;
      debugger;
    }
  });

  // 节点-双击：节点居中
  graph.value.on("node:dblclick", ({ name, view, e }) => {
    if (view && view.cell && view.cell.id) {
      onCenrerNode(view.cell.id);
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
const searchForNode = (nodeName: string) => {
  debugger;
  const nodeId = nodeName.toLowerCase();
  onCenrerNode(nodeId);
};

/** 撤销重做 */
const canUndo = ref(false);
const canRedo = ref(false);
const onUndo = () => {
  if (graph && graph.value.canUndo()) {
    console.log("Undoing...");
    graph.value.undo();
  } else {
    console.log("Cannot undo");
  }
};
const onRedo = () => {
  if (graph && graph.value.canRedo()) {
    console.log("Redoing...");
    graph.value.redo();
  } else {
    console.log("Cannot redo");
  }
};

/** 导出 */
const exportToPng = () => {
  debugger;
  graph.value.exportPNG("导出测试", {
    quality: 1,
  });
};

onMounted(async () => {
  nextTick(() => {
    renderGraph();
  });
});
onUnmounted(() => {
});
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
