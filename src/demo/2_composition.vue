<template>
  <div class="demo">
    <h1>Counter</h1>
    <button class="couter_btn" id="counter" @click="increment">
      {{ count }}
    </button>
    <button
      class="couter_btn"
      id="counter_reactive"
      @click="state.counter_reactive++"
      @keyup.enter="state.counter_reactive = 0"
    >
      {{ state.counter_reactive }}
    </button>
    <button class="couter_btn" @click="reset">Reset</button>
  </div>
  <div class="demo">
    <p>{{ fullName }} Has publised books:</p>
    <li v-for="b in publisBooks">{{ b.name }}</li>
  </div>
  <div class="demo">
    <div class="static" :class="{ active: isActive, 'text-danger': hasError }">
      类与绑定
    </div>
  </div>

  <div class="demo">
    <button @click="awesome = !awesome">Toggle</button>
    <h1 v-if="awesome">Nice</h1>
    <h1 v-else>Sucks</h1>
  </div>

  <div class="demo">
    <div>Selected:{{ selected }}</div>
    <select v-model="selected">
      <option disabled value="">Please select one</option>
      <option>A</option>
      <option>B</option>
      <option>C</option>
    </select>
  </div>

  <div class="demo">
    <p>
      Ask a yes/no question?
      <input v-model="question" :disabled="loading" />
    </p>
    <p>{{ answer }}</p>
  </div>
</template>

<!-- 使用setup可以使得内部变量，function ，import的内容可以直接在template中使用，而无需再通过data(),methods()方法暴露 -->
<script setup>
import { async } from "@antv/x6/lib/registry/marker/async";
import { ref, onMounted, nextTick, reactive, computed, watch } from "vue";

const isActive = ref(true);
const hasError = ref(true);
const awesome = ref(true);
const selected = ref("B");

const question = ref("");
const answer = ref("");
const loading = ref(false);

watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes("?")) {
    loading.value = true;
    answer.value = "Thinking...";
    try {
      const res = await fetch("https://yesno.wtf/api");
      answer.value = (await res.json()).answer;
    } catch (error) {
      answer.value = "Error!Could not fetch the API." + error;
    } finally {
      loading.value = false;
    }
  }
});

// A. 响应式变量
const count = ref(0);

// B. 响应式状态(复杂数据类型 only对象和数组)
const state = reactive({
  counter_reactive: 0,
});

const author = reactive({
  firstName: "John",
  lastName: "Doe",
  books: [
    { name: "B1", status: 1 },
    { name: "B2", status: 0 },
    { name: "B3", status: 1 },
  ],
});
const publisBooks = computed(() => {
  return author.books.filter((b) => b.status === 1);
});

const fullName = computed({
  get() {
    return author.firstName + " " + author.lastName;
  },
  set(newName) {
    [author.firstName, author.lastName] = newName.split(" ");
  },
});
fullName.value = "viki hao";

function increment() {
  console.log("counter:" + document.getElementById("counter").innerText);
  count.value++;
  console.log(
    "after increment:" + document.getElementById("counter").innerText
  );

  nextTick(() => {
    // 改变组件属性后，可以立刻获取到渲染以后的DOM对象
    console.log("nextTick:" + document.getElementById("counter").innerText);
  });
}
function reset() {
  count.value = 0;
}

onMounted(() => {});
</script>
<style>
.couter_btn {
  margin: 4px;
}
.demo {
  margin-top: 32px;
}
</style>
