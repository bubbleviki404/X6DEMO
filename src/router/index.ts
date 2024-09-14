import { createRouter, createWebHistory } from 'vue-router';
import Graph from '../components/GraphDemo.vue'

const routes = [
  { path: '/', component: Graph}, 
  { path: '/demo', component: Graph}, 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;