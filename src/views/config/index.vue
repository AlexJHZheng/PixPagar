<template>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="6"
        ><el-button type="primary" @click="registWebhook"
          >注册webhook</el-button
        ></el-col
      >
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
  </el-main>
</template>

<script>
import { registWebhook } from "@/api/config";
export default {
  data() {
    return {};
  },
  mounted() {
    // 这里是生命周期函数，会在页面加载时执行
    // 调用api中的getList方法获取到数据，并赋值给tableData
    // this.getList();
  },
  methods: {
    registWebhook() {
      console.log("registWebhook");
      registWebhook().then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
