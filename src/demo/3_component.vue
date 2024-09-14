<template>
  <h1>Child Compnent</h1>
  <ButtonCounter v-for="c in counters" :key="c.id" :title="c.title" />
</template>
<script setup>
import {ref} from 'vue'
import ButtonCounter from "./components/ButtonCounter.vue";
const counters = ref([
  { id: 1, title: "c-1" },
  { id: 2, title: "c-2" },
  { id: 3, title: "c-3" },
]);
</script>
 