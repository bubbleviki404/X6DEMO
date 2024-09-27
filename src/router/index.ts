import { createRouter, createWebHistory } from 'vue-router';
import Graph from '../components/GraphDemo.vue';
import DEMO1 from '../demo/1_options.vue';
import DEMO2 from '../demo/2_composition.vue';
import DEMO3 from '../demo/3_component.vue';
import DEMO4 from '../demo/GADemo.vue';
import DEMO5 from '../demo/X6Demo.vue';
import C1 from '../components/C1.vue';
import C2 from '../components/C2.vue';
import C3 from '../components/C3.vue';
import C4 from '../components/C4.vue';
import C5 from '../components/C5.vue';
import C6 from '../components/C6.vue';
import C7 from '../components/C7.vue';
import C8 from '../components/C8.vue';
import C9 from '../components/C9.vue';
import CustomizeNodeD from '../components/CustomizeNodeD.vue';
import Node from '../components/Node.vue';
const routes = [
  { path: '/', component: Graph },
  { path: '/1', component: C1 },
  { path: '/2', component: C2 },
  { path: '/3', component: C3 },
  { path: '/4', component: C4 },
  { path: '/5', component: C5 },
  { path: '/6', component: C6 },
  { path: '/7', component: C7 },
  { path: '/8', component: C8 },
  { path: '/9', component: C9 },
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
