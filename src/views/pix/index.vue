<template>
  <div style="margin: 0px" class="app-container documentation-container">
    <el-container>
      <el-main style="padding: 0px">PIX 收银台</el-main>
      <el-main style="padding: 0px">
        <el-row>
          <el-col :span="6" style="padding: 10px"
            ><el-select v-model="value" placeholder="有效时间">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> </el-select
          ></el-col>
          <el-col :span="6" style="padding: 10px"
            ><el-input
              v-model="pedido"
              type="text"
              placeholder="订单号"
              :disabled="true"
          /></el-col>
          <el-col :span="6" style="padding: 10px"
            ><el-input
              v-model="clientName"
              type="text"
              placeholder="客人名称(选填)"
          /></el-col>
          <el-col :span="6" style="padding: 10px"
            ><el-input v-model="summary" type="text" placeholder="备注(选填)"
          /></el-col>
        </el-row>
        <el-row style="padding: 0px">
          <el-col :span="6" style="padding: 10px"
            ><el-input v-model="input" type="number" placeholder="请输金额"
          /></el-col>
          <el-col :span="6" style="padding: 10px"
            ><el-button type="primary" @click="GeraQr"
              >生成收款二维码</el-button
            ></el-col
          >
          <el-col :span="6" style="padding: 10px"
            ><el-button type="primary" @click="test">test</el-button></el-col
          >
        </el-row>
      </el-main>
      <!-- 二维码区域 -->
      <el-main v-show="show" style="padding: 0px">
        <h3 style="margin: 0px">Aguardando pagamento</h3>
        Pagar com Pix é rápido e seguro! É só seguir estes Passos:

        <div style="text-align: center; margin-top: 20px">
          <el-row>
            <el-col
              :span="10"
              style="padding: 10px; width: 500px; height: 350px"
            >
              <el-card :body-style="{ padding: '0px', height: '100%' }">
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
              :span="14"
              style="padding: 10px; width: 500px; height: 350px"
            >
              <el-card :body-style="{ padding: '0px', height: '100%' }">
                <el-form style="text-align: left; padding: 5px; height: 100%">
                  <el-form-item>
                    1.<b>Abra o aplicativo ou Internet Banking </b>para pagar.
                  </el-form-item>
                  <el-form-item>
                    2.Na opção Pix, escolha <b>'Ler QR Code'</b>
                  </el-form-item>
                  <el-form-item>
                    3.<b>Ler QR Code</b> ou , se preferir,
                    <b>copie o código para Pix Copia e Cola.</b>
                  </el-form-item>
                  <el-form-item>
                    3.Revise as informações e <b>confirme o pagamento</b>
                  </el-form-item>
                  <el-form-item>
                    Pronto! O status do pedido será atualizado na mesma hora.
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <!-- <el-button type="success" @click="clear">清除</el-button> -->
        <el-button type="danger" @click="clear">删除</el-button>
        <el-button type="primary" @click="clear">生成新收款单</el-button>
      </el-main>
      <!-- 二维码区域结束 -->
      <el-footer />
    </el-container>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { addPay } from "@/api/pay";

export default {
  name: "Documentation",
  components: { VueQr },
  data() {
    return {
      expTime: "",
      value: 30,
      show: false,
      pedido: "",
      clientName: "",
      summary: "",
      options: [
        {
          value: 10,
          label: "10分钟",
        },
        {
          value: 30,
          label: "30分钟",
        },
        {
          value: 240,
          label: "4小时",
        },
        {
          value: 720,
          label: "12小时",
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
    test() {
      // console.log(this.$store.state);
      var res = this.generateOrderNumber();
      console.log(res, "订单号");
    },
    generateOrderNumber() {
      const currentDate = new Date();
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
    },
    GeraQr() {
      if (this.input != null && this.input > 0) {
        this.$confirm("确认收款金额为" + "R$" + this.input + "?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.show = true;
          // 生成时间信息
          if (this.value === "" || this.value === 0) {
            this.value = 15;
          }
          var curTime = new Date();
          var posCurTime = new Date(
            curTime.setMinutes(curTime.getMinutes() + this.value)
          );
          this.expTime =
            posCurTime.getDate() +
            "/" +
            posCurTime.getMonth() +
            1 +
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
          }).then((res) => {
            console.log(res);
          });

          // 调用Pix Api

          // 将pix信息渲染到二维码上
          this.appSrc = "确认收款金额为" + "R$" + this.input;
        });
      } else {
        this.$message({
          type: "error",
          message: "请输入正确金额",
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
