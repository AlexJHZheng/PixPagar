<template>
  <div class="container">
    <div class="content">
      <div class="top-section">
        <div class="text-center">
          <!-- 显示二维码或默认图片 -->
          <div ref="imageContainer" class="image-container">
            <img
              v-if="!qrGenerated"
              ref="defaultImage"
              :src="defaultImageSrc"
              class="default-image"
              alt="QR Code"
            />
            <vue-qr
              v-else
              ref="qrQr"
              :logo-src="logoSrc"
              :size="qrSize"
              :margin="20"
              :auto-color="true"
              :dot-scale="1"
              :text="appSrc"
              color-dark="black"
              color-light="white"
              class="qr-code"
            />
          </div>
          <p class="info-text">
            Quantia R$ {{ formattedAmount }} {{ infoText }}
          </p>
        </div>
      </div>
      <div class="bottom-section">
        <div class="button-grid">
          <el-button
            v-for="(button, index) in buttons"
            :key="button.label"
            v-loading.fullscreen.lock="loading"
            class="square-button"
            :class="{ 'first-button': index % 3 === 0 }"
            :type="button.type"
            :disabled="button.label === 'Consulta' && !isQueryEnabled"
            @click="handleButtonClick(button.label)"
          >
            {{ button.label }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { addPay, getPayStatus } from "@/api/pay";

export default {
  components: {
    VueQr,
  },
  data() {
    return {
      loading: false,
      infoText: "",
      qrGenerated: false,
      defaultImageSrc: "/pix400.png",
      logoSrc: "/pixqr.png",
      appSrc: "",
      buttons: [
        { label: "1" },
        { label: "2" },
        { label: "3" },
        { label: "4" },
        { label: "5" },
        { label: "6" },
        { label: "7" },
        { label: "8" },
        { label: "9" },
        { label: "0" },
        { label: "." },
        { label: "Backspace" },
        { label: "Consulta", type: "success" },
        { label: "Clear", type: "info" },
        { label: "Confirm", type: "primary" },
      ],
      qrSize: 250,
      inputAmount: "0.00",
      isFirstInput: true,
    };
  },
  computed: {
    formattedAmount() {
      return this.inputAmount;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.observeContainerSize();
    });
  },
  methods: {
    getZero(num) {
      // 补0
      // 单数前面加0
      if (parseInt(num) < 10) {
        num = "0" + num;
      }
      return num;
    },
    generateOrderNumber() {
      const currentDate = new Date();
      console.log(currentDate, "currentDate");
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const seconds = String(currentDate.getSeconds()).padStart(2, "0");
      const milliseconds = String(currentDate.getMilliseconds()).padStart(
        3,
        "0"
      );
      const randomCode1 = Math.floor(Math.random() * 100);
      const randomCode2 = Math.floor(Math.random() * 1000);
      const randomCode3 = Math.floor(Math.random() * 1000);
      const orderNumber = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${randomCode1}${randomCode2}${randomCode3}`;
      console.log(orderNumber, "orderNumber");
      return orderNumber;
    },
    handleButtonClick(label) {
      if (label === "Confirm") {
        if (this.inputAmount === "0.00") {
          this.infoText = "valor válido";
          return;
        } else {
          this.validateAmount();
        }
      } else if (label === "Clear") {
        this.isQueryEnabled = false;
        this.infoText = "";
        this.appSrc = "";
        this.pix_path = "";
        this.resetToDefault();
      } else if (label === "Backspace") {
        this.handleBackspace();
      } else if (label === "Consulta") {
        // 调用查询接口
        getPayStatus({ pix_path: this.pix_path })
          .then((res) => {
            if (res.Payment == true) {
              this.infoText = "Pago!!";
            } else {
              this.infoText = "Não Recebida.......";
            }
          })
          .catch((error) => {});
      } else {
        this.updateAmount(label);
      }
    },
    updateAmount(label) {
      if (this.isFirstInput) {
        this.isFirstInput = false;
        this.inputAmount = "";
      }

      if (label === ".") {
        if (!this.inputAmount.includes(".")) {
          this.inputAmount += ".";
        }
      } else if (label === "0") {
        if (this.inputAmount && this.inputAmount !== "0") {
          this.inputAmount += label;
        }
      } else {
        if (this.inputAmount === "0.00" || this.inputAmount === "0") {
          this.inputAmount = label;
        } else {
          const [integerPart, decimalPart] = this.inputAmount.split(".");
          if (decimalPart) {
            if (decimalPart.length < 2) {
              this.inputAmount += label;
            }
          } else {
            this.inputAmount += label;
          }
        }
      }

      if (this.inputAmount.includes(".")) {
        const [integerPart, decimalPart] = this.inputAmount.split(".");
        if (decimalPart && decimalPart.length > 2) {
          this.inputAmount = `${integerPart}.${decimalPart.slice(0, 2)}`;
        }
      }
    },
    handleBackspace() {
      // 如果输入金额是 '0.00'，则不允许进行删除操作
      if (this.inputAmount === "0.00") {
        return;
      }

      // 删除最后一个字符
      if (this.inputAmount.length > 0) {
        this.inputAmount = this.inputAmount.slice(0, -1);

        // 如果删除后金额为空或只剩下 '0'，则重置为 '0.00'
        if (this.inputAmount === "" || this.inputAmount === ".") {
          this.inputAmount = "0.00";
        } else if (this.inputAmount.endsWith(".")) {
          // 如果剩余的金额以 '.' 结尾，删除它
          this.inputAmount = this.inputAmount.slice(0, -1);
        }

        // 保证金额不为空并且符合两位小数的规则
        if (this.inputAmount === "" || this.inputAmount === ".") {
          this.inputAmount = "0.00";
        }
      }
    },
    validateAmount() {
      const amount = parseFloat(this.inputAmount).toFixed(2);
      this.inputAmount = amount;
      this.$nextTick(() => {
        // 调用方法获取二维码信息
        this.loading = true; // 读条
        var expirationMinutes = 60; // 默认过期时间60分钟

        var curTime = new Date();
        var posCurTime = new Date(curTime);
        // 增加分钟数
        posCurTime.setMinutes(curTime.getMinutes() + this.value);
        // 计算当天的 23:59
        var endOfDay = new Date(curTime);
        endOfDay.setHours(23, 59, 0, 0); // 设置为当天的 23:59:00
        // 如果计算后的时间超过当天 23:59，则将时间设置为 23:59，并调整 this.value
        if (posCurTime > endOfDay) {
          posCurTime = endOfDay;

          // 计算新的 this.value
          expirationMinutes = Math.round((endOfDay - curTime) / 60000); // 转换为分钟
        }
        this.expTime =
          posCurTime.getDate() +
          "/" +
          (posCurTime.getMonth() + 1) +
          "   " +
          this.getZero(posCurTime.getHours()) +
          ":" +
          this.getZero(posCurTime.getMinutes());
        // 生成订单号
        this.pedido = this.generateOrderNumber();
        // 调用payApi中的方法，生成pix信息
        addPay({
          payTotal: this.inputAmount,
          payNum: this.pedido,
          payObs: "autopix",
          payClient: "",
          expiration: expirationMinutes,
        })
          .then((res) => {
            this.calculateQrSize();
            this.qrGenerated = true; // 在大小计算之后才生成二维码

            this.loading = false;
            this.appSrc = res.data.pix_copy;
            this.pix_path = res.data.pix_path;
          })
          .catch((error) => {
            // 请求失败后的处理
            this.loading = false;
          })
          .finally(() => {
            this.loading = false;
          });
        // 调用Pix Api
        // 将pix信息渲染到二维码上
      });
      this.isQueryEnabled = true;
    },
    resetToDefault() {
      this.qrGenerated = false;
      this.inputAmount = "0.00";
      this.isFirstInput = true;
    },
    observeContainerSize() {
      const defaultImage = this.$refs.defaultImage;

      if (defaultImage) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.target === defaultImage) {
              const containerWidth = entry.contentRect.width;
              this.qrSize = containerWidth;
            }
          }
        });

        resizeObserver.observe(defaultImage);
      }
    },
    calculateQrSize() {
      const defaultImage = this.$refs.defaultImage;
      if (defaultImage) {
        this.qrSize = defaultImage.offsetWidth;
      }
    },
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}

.container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.image-container {
  width: 100%;
  max-width: 400px;
}

.default-image {
  width: 100%;
  height: auto;
}

.qr-code {
  width: 100%;
  height: auto;
}

.info-text {
  margin-top: 10px;
  font-size: 1.5rem; /* Default font size */
}

/* Media queries for different screen sizes */
@media (max-width: 600px) {
  .info-text {
    font-size: 1.2rem; /* Font size for small screens (phones) */
  }
}

@media (min-width: 601px) and (max-width: 1024px) {
  .info-text {
    font-size: 1.4rem; /* Font size for medium screens (tablets) */
  }
}

@media (min-width: 1025px) {
  .info-text {
    font-size: 1.6rem; /* Font size for large screens (desktops) */
  }
}

.bottom-section {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #fff;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  max-width: 400px;
  width: 100%;
}

.square-button {
  width: 100%;
  height: 60px;
  border-radius: 10px;
  font-size: 18px;
  line-height: 60px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.first-button {
  margin-left: 0;
}
</style>
