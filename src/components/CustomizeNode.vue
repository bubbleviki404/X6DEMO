<template>
  <div id="graph_container"></div>
  <TeleportContainer />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, onUnmounted } from "vue";
import { Graph } from "@antv/x6";
import { Scroller } from "@antv/x6-plugin-scroller";
import { Selection } from "@antv/x6-plugin-selection";
import { register, getTeleport } from "@antv/x6-vue-shape";
import NodeComponent from "./Node.vue";

// 将组件内部的模板“传送”到该组件的 DOM 结构外层的位置（无敌重要！让节点的菜单模板可以在父组件生效）
const TeleportContainer = getTeleport();
const data = {
  n1: {
    id: "n1",
    x: 32,
    y: 32,
    shape: "custom-vue-node",
    data: {
      nodeId: "n1",
      nodeName: "Hello",
      blur:true
    },
  },
  n2: {
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

  // 画布内容对齐
  onCenterContent();

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
      showNodeSelectionBox: true,
    })
  );
};

const renderEdge = () => {
  //添加边
  graph.value.addEdge({
    source: "n1",
    target: "n3",
  });
};

const renderNodes = () => {
  // 注册自定义节点
  register({
    shape: "custom-vue-node",
    inherit: "vue-shape",
    width: 100,
    height: 100,
    component: NodeComponent,
  });

  // 节点数据加载
  graph.value.fromJSON({ nodes: Object.keys(data).map((key) => data[key]) });

  // 添加节点
  graph.value.addNode({
    shape: "custom-vue-node",
    id: "n3",
    x: 100,
    y: 60,
    width: 100,
    height: 100,
    data: {
      nodeId: "n3",
      nodeName: "VikiVikiVikiVikiVikiVikiVikiVikiVikiVikiVikiV",
    },
  });

  // 节点-双击：节点居中
  graph.value.on("node:dblclick", ({ view }) => {
    if (view && view.cell && view.cell.id) {
      onCenrerNode(view.cell.id);
    }
  });
};

/** 画布对齐 */
const onCenterContent = () => {
  graph.value.centerContent();
};
const onCenrerNode = (nodeId: string) => {
  const node = graph.value.getCellById(nodeId);
  if (node) {
    graph.value.centerCell(node);
  }
};

onMounted(async () => {
  nextTick(() => {
    renderGraph();
    if (graph && graph.value) {
      renderNodes();
      renderEdge();
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
</style>
