<template>
  <div style="margin: 0px" class="app-container documentation-container">
    <el-container>
      <el-main style="padding: 0px">{{ $t("pix.painel") }}</el-main>
      <el-main v-loading="loading" style="padding: 0px">
        <el-row>
          <el-col :xs="24" :sm="12" :md="6" style="padding: 10px"
            ><el-select v-model="value" placeholder="valido tempo">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> </el-select
          ></el-col>
          <el-col :xs="24" :sm="12" :md="6" style="padding: 10px"
            ><el-input
              v-model="pedido"
              type="text"
              :placeholder="$t('pix.pedido')"
              :disabled="true"
          /></el-col>
          <el-col :xs="24" :sm="12" :md="6" style="padding: 10px"
            ><el-input
              v-model="clientName"
              type="text"
              :placeholder="$t('pix.client')"
          /></el-col>
          <el-col :xs="24" :sm="12" :md="6" style="padding: 10px"
            ><el-input
              v-model="summary"
              type="text"
              :placeholder="$t('pix.obs')"
          /></el-col>
        </el-row>
        <el-row style="padding: 0px">
          <el-col :span="6" style="padding: 10px"
            ><el-input
              v-model="input"
              type="number"
              :placeholder="$t('pix.valor')"
              :disabled="isLocked"
          /></el-col>
          <el-col :span="6" style="padding: 10px"
            ><el-button type="primary" @click="GeraQr">{{
              $t("pix.geraqr")
            }}</el-button></el-col
          >
          <!-- <el-col :span="6" style="padding: 10px"
            ><el-button type="primary" @click="test">test</el-button></el-col
          > -->
        </el-row>
      </el-main>
      <!-- 二维码区域 -->
      <el-main
        v-show="show"
        style="
          padding: 0px;
          max-width: 100vw;
          margin: 0 auto;
          box-sizing: border-box;
          overflow-x: hidden;
        "
      >
        <h3 style="margin: 0px">Aguardando pagamento</h3>
        Pagar com Pix é rápido e seguro! É só seguir estes Passos:
        <div
          style="
            text-align: center;
            margin-top: 20px;
            max-width: 1200px;
            margin: 0 auto;
            box-sizing: border-box;
          "
        >
          <el-row>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="12"
              :xl="12"
              style="padding: 10px; height: 350px"
            >
              <el-card
                :body-style="{
                  padding: '0px',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }"
              >
                <vue-qr
                  :logo-src="logoSrc"
                  :size="250"
                  :margin="20"
                  :auto-color="true"
                  :dot-scale="1"
                  :text="appSrc"
                  color-dark="black"
                  color-light="white"
                />
                <div style="padding: 14px">
                  <span>R${{ input }}</span>
                  <div class="bottom clearfix">
                    <time class="time">过期时间：{{ expTime }}</time>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="12"
              :xl="12"
              style="padding: 10px"
            >
              <el-card
                :body-style="{
                  padding: '0px',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }"
              >
                <el-form style="text-align: left; padding: 5px; height: 100%">
                  <div style="text-align: left; padding: 10px">
                    <p>
                      1. <b>Abra o aplicativo ou Internet Banking</b> para
                      pagar.
                    </p>
                    <p>2. Na opção Pix, escolha <b>'Ler QR Code'</b></p>
                    <p>
                      3. <b>Ler QR Code</b> ou, se preferir,
                      <b>copie o código para Pix Copia e Cola.</b>
                    </p>
                    <p>
                      4. Revise as informações e <b>confirme o pagamento</b>
                    </p>
                    <p>
                      Pronto! O status do pedido será atualizado na mesma hora.
                    </p>
                  </div>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <!-- <el-button type="success" @click="clear">清除</el-button> -->
        <el-button type="success" @click="query">{{
          $t("pix.query")
        }}</el-button>
        <el-button @click="copyToClipboard"> Copia Cola</el-button>
        <el-button type="primary" @click="clear">{{
          $t("pix.newquery")
        }}</el-button>
      </el-main>
      <!-- 二维码区域结束 -->
      <el-footer />
    </el-container>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { addPay, getPayStatus } from "@/api/pay";

export default {
  name: "Documentation",
  components: { VueQr },
  data() {
    return {
      pix_path: "",
      isLocked: false,
      loading: false,
      expTime: "",
      value: 30,
      show: false,
      pedido: "",
      clientName: "",
      summary: "",
      options: [
        {
          value: 10,
          label: this.$t("pix.min10"),
        },
        {
          value: 30,
          label: this.$t("pix.min30"),
        },
        {
          value: 240,
          label: this.$t("pix.hora4"),
        },
        {
          value: 720,
          label: this.$t("pix.hora12"),
        },
      ],
      currentDate: new Date(),
      input: null,
      logoSrc: "",
      appSrc: "",
    };
  },
  methods: {
    // test方法，打印dispatch中的数据
    copyToClipboard() {
      const textToCopy = this.appSrc;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          this.$message.success("copia sucesso");
        })
        .catch(() => {
          this.$message.error("falha copia");
        });
    },
    query() {
      // 通过接口查询付款情况
      // 如果付款成功，弹出提示框付款成功
      // 并清除页面数据
      getPayStatus({ pix_path: this.pix_path }).then((res) => {
        if (res.Payment == true) {
          // 弹出提示框，付款成功，用户点击确定以后提示框消失
          this.$confirm(this.$t("pix.reciveclean"), this.$t("pix.notice"), {
            confirmButtonText: this.$t("pix.comfirm"),
            cancelButtonText: this.$t("pix.cancel"),
            type: "warning",
          }).then(() => {
            this.clear();
          });
        } else {
          this.$confirm(this.$t("pix.notrecive"), this.$t("pix.notice"), {
            confirmButtonText: this.$t("pix.comfirm"),
            cancelButtonText: this.$t("pix.cancel"),
            type: "warning",
          });
        }
      });
      // this.$message({
      //   type: "success",
      //   message: "查询付款情况",
      // });
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
    getZero(num) {
      // 补0
      // 单数前面加0
      if (parseInt(num) < 10) {
        num = "0" + num;
      }
      return num;
    },
    clear() {
      this.appSrc = "";
      this.input = null;
      this.clientName = "";
      this.pedido = "";
      this.show = false;
      this.isLocked = false; // 启用输入框
    },
    GeraQr() {
      if (this.input != null && this.input > 0) {
        this.$confirm(
          this.$t("pix.comformvalor") + "R$" + this.input + "?",
          this.$t("pix.notice"),
          {
            confirmButtonText: this.$t("pix.comfirm"),
            cancelButtonText: this.$t("pix.cancel"),
            type: "warning",
          }
        ).then(() => {
          // 加载动画
          this.loading = true;
          var expirationMinutes = this.value;
          // 生成时间信息
          if (this.value === "" || this.value === 0) {
            expirationMinutes = 15;
          }
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
            payTotal: this.input,
            payNum: this.pedido,
            payObs: this.summary,
            payClient: this.clientName,
            expiration: expirationMinutes,
          })
            .then((res) => {
              this.show = true; // 显示二维码区域
              this.isLocked = true; // 禁用输入框
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
      } else {
        this.$message({
          type: "error",
          message: this.$t("pix.errorvalor"),
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    padding: 0 16px;
    margin: 16px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
