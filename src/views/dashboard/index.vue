<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <!-- h2左边距30px -->
    <div style="margin-left: 30px">
      <h2>{{ $t("dashboard.pixrecive") }}</h2>
    </div>
    <div class="responsive-container">
      <img src="/pix.png" alt="pix" />
    </div>
    <div style="margin-left: 30px; margin-right: 30px">
      <h4>{{ $t("dashboard.notica") }}</h4>
      <h4>{{ $t("dashboard.com1") }}</h4>
      <h4>{{ $t("dashboard.com2") }}</h4>
      <h4>{{ $t("dashboard.com3") }}</h4>
      <h4>{{ $t("dashboard.com4") }}</h4>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";

export default {
  name: "Dashboard",
  components: { adminDashboard },
  data() {
    return {
      currentRole: "adminDashboard",
    };
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  created() {},
};
</script>
<style scoped>
.responsive-container {
  margin-top: 40px;
  margin-left: 40px;
  margin-right: 40px;
  width: calc(100% - 80px); /* 容器宽度减去左右 margin 值 */
  max-width: 400px; /* 最大宽度（可根据需要调整） */
  height: auto; /* 高度自适应 */
  display: flex; /* 使用 flexbox 对齐内容 */
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
}

.responsive-container img {
  width: 100%; /* 图片宽度自适应容器 */
  height: auto; /* 图片高度自适应，保持比例 */
  object-fit: contain; /* 保持图片内容在容器内完整显示 */
}
</style>
