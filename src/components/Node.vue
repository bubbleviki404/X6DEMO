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
          <el-dropdown-item @click="pin">定位到此处</el-dropdown-item>
          <el-dropdown-item divided :disabled="drillUpDisabled" @click="drillUp"
            >上钻</el-dropdown-item
          >
          <el-dropdown-item
            divided
            :disabled="drillDownDisabled"
            @click="drillDown"
            >下钻</el-dropdown-item
          >
          <el-dropdown-item divided @click="drillConfig"
            >上下钻设置</el-dropdown-item
          >
          <el-dropdown-item divided @click="addTag">添加标签</el-dropdown-item>
          <el-dropdown-item divided @click="flows">全部流向</el-dropdown-item>
          <el-dropdown-item divided @click="detail">查看明细</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, inject, defineEmits } from 'vue';
import { Node } from '@antv/x6';

// 组件名称定义
defineOptions({
  name: 'NodeComponent',
});

// 注入X6节点
const getNode = inject('getNode') as () => Node;
const nodeName = ref('');
const nodeId = ref('');
const blur = ref(false);
const drillUpDisabled = ref(false);
const drillDownDisabled = ref(false);

// 菜单方法
const emit = defineEmits(['pin', 'drillUp', 'drillDown', 'drillConfig']);
const pin = () => {
  emit('pin', nodeId.value);
};
const drillUp = () => {
  emit('drillUp', nodeId.value);
};
const drillDown = () => {
  emit('drillDown', nodeId.value);
};
const drillConfig = () => {
  emit('drillConfig', nodeId.value);
};

onMounted(() => {
  // 获取节点
  const node = getNode();

  // 初始化节点数据
  debugger;
  nodeName.value = node.data.nodeName;
  nodeId.value = node.data.nodeId;
  blur.value = node.data.blur;
  drillUpDisabled.value = node.data.drillUpDisabled;
  drillDownDisabled.value = node.data.drillDownDisabled;

  // 监听节点变化
  node.on('change:data', ({ current }) => {
    if (current && current.nodeName) {
      const {
        nodeName: newNodeName,
        nodeId: newNodeId,
        blur: newBlur,
        drillUpDisabled: newDrillUpDisabled,
        drillDownDisabled: newDrillDownDisabled,
      } = current;

      // 更新当前属性
      nodeName.value = newNodeName || '';
      nodeId.value = newNodeId || '';
      blur.value = newBlur !== undefined ? newBlur : false;
      drillUpDisabled.value =
        newDrillUpDisabled !== undefined ? newDrillUpDisabled : false;
      drillDownDisabled.value =
        newDrillDownDisabled !== undefined ? newDrillDownDisabled : false;
    }
  });
});
</script>

<style scoped>
.node_menu {
  width: 80px;
  height: 100px;
  border: solid 1px rgb(51, 102, 153);
  background: rgb(46, 132, 193);
  border-radius: 8px;
}
.node_menu_title {
  color: white;
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
