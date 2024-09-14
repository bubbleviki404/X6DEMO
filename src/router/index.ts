import { createRouter, createWebHistory } from 'vue-router';
import Graph from '../components/GraphDemo.vue'
import DEMO1 from '../demo/1_options.vue'
import DEMO2 from '../demo/2_composition.vue'
import DEMO3 from '../demo/3_component.vue'

const routes = [
  { path: '/', component: Graph}, 
  { path: '/demo/1', component: DEMO1}, 
  { path: '/demo/2', component: DEMO2}, 
  { path: '/demo/3', component: DEMO3}, 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;