<template>
  <div class="node_menu" :class="{ 'blur-effect': blur }">
    <el-dropdown
      placement="right"
      trigger="contextmenu"
      class="node_menu_context"
    >
      <div class="node_menu_title">{{ nodeName }}</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>定位到此处</el-dropdown-item>
          <el-dropdown-item divided>上钻</el-dropdown-item>
          <el-dropdown-item divided disabled>下钻</el-dropdown-item>
          <el-dropdown-item divided>去向</el-dropdown-item>
          <el-dropdown-item divided>来源</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, inject } from "vue";
import { Node } from "@antv/x6";

// 组件名称定义
defineOptions({
  name: "NodeComponent",
});

// 注入X6节点
const getNode = inject("getNode") as () => Node;
const nodeName = ref("");
const nodeId = ref("");
const blur = ref(false);

onMounted(() => {
  // 获取节点
  const node = getNode();

  // 初始化节点数据
  nodeName.value = node.data.nodeName;
  nodeId.value = node.data.nodeId;
  blur.value = node.data.blur;

  // 监听节点变化
  node.on("change:data", ({ current }) => {
    debugger;
    if (current && current.nodeName) {
      const {
        nodeName: newNodeName,
        nodeId: newNodeId,
        blur: newBlur,
      } = current;

      // 更新当前属性
      nodeName.value = newNodeName || ""; 
      nodeId.value = newNodeId || ""; 
      blur.value = newBlur !== undefined ? newBlur : false; 
    }
  });
});
</script>

<style scoped>
.node_menu {
  width: 80px;
  height: 100px;
  border: solid 1px rgb(143, 143, 143);
  background: white;
  border-radius: 8px;
}

.node_menu_context {
  width: 100%;
  height: 100%;
}

.node_menu_title {
  width: 90%;
  height: 90%;
  margin: auto;
  word-wrap: break-word;
}

/* 添加虚化效果的样式 */
.blur-effect {
  filter: blur(3px); /* 根据需要调整虚化程度 */
  transition: filter 0.3s ease; /* 添加过渡效果 */
}
</style>
