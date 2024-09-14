<template>
  <h1>Counter</h1>
  <button class="couter_btn" id="counter" @click="increment">
    {{ count }}
  </button>
  <button class="couter_btn" @click="reset">Reset</button>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      console.log("counter:" + document.getElementById("counter").innerText);
      this.count++;
      console.log(
        "after increment:" + document.getElementById("counter").innerText
      );

      // 改变组件属性后，可以立刻获取到渲染以后的DOM对象
      this.$nextTick(() => {
        console.log(
          "after next tick:" + document.getElementById("counter").innerText
        );
      });
    },
    reset() {
      this.count = 0;
    },
  },
  mounted() {
    this.increment();
    this.reset();
  },
};
</script>

<style>
.couter_btn {
  margin: 4px;
}
</style>
