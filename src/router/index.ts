import { createRouter, createWebHistory } from 'vue-router';
import Graph from '../components/GraphDemo.vue';
import DEMO1 from '../demo/1_options.vue';
import DEMO2 from '../demo/2_composition.vue';
import DEMO3 from '../demo/3_component.vue';
import DEMO4 from '../demo/GADemo.vue';
import DEMO5 from '../demo/X6Demo.vue';
import CustomizeNode from '../components/CustomizeNode.vue';
import CustomizeNode2 from '../components/CustomizeNode2.vue';
import CustomizeNode3 from '../components/CustomizeNode3.vue';
import CustomizeNodeD from '../components/CustomizeNodeD.vue';
import Node from '../components/Node.vue';
const routes = [
  { path: '/', component: Graph },
  { path: '/1', component: CustomizeNode },
  { path: '/2', component: CustomizeNode2 },
  { path: '/3', component: CustomizeNode3 },
  { path: '/d', component: CustomizeNodeD },
  { path: '/demo/1', component: DEMO1 },
  { path: '/demo/2', component: DEMO2 },
  { path: '/demo/3', component: DEMO3 },
  { path: '/demo/ga', component: DEMO4 },
  { path: '/demo/x6', component: DEMO5 },
  { path: '/node', component: Node },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
