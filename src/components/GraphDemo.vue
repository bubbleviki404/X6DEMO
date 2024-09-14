<template>
    <div id="container"></div>
</template>

<script lang="ts" setup>


import { Graph } from '@antv/x6'
  import { Scroller } from '@antv/x6-plugin-scroller';
  import { nextTick, onMounted, ref } from "vue";
  
  const graph = ref<Graph>();

onMounted(async()=>{
    nextTick(()=>{
        graph.value = new Graph({
            container:document.getElementById('container'),
    width:800,
    height:600,
    background:{
        color:'#F2F7FA'
    }
})
    })
})



</script>
