<template>
  <div style="margin: 0px" class="app-container documentation-container">
    <el-container>
      <el-header style="height: auto">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          label-width="80px"
          class="responsive-form"
        >
          <el-row :gutter="20">
            <el-col :span="6" :xs="24">
              <el-form-item>
                <el-input
                  v-model="search"
                  placeholder="Enter search criteria"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item>
                <el-date-picker
                  v-model="datetime"
                  type="daterange"
                  :range-separator="$t('flow.to')"
                  :start-placeholder="$t('flow.starttime')"
                  :end-placeholder="$t('flow.endtime')"
                  align="right"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-form-item>
                <el-button type="primary" @click="onSubmit">
                  {{ $t("flow.query") }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <!-- <el-table-column
            prop="payNum"
            :label="$t('flow.codico')"
            width="215px"
          /> -->
          <el-table-column
            prop="payDate"
            :label="$t('flow.date')"
            :formatter="formatDate"
          />
          <el-table-column prop="summary" :label="$t('flow.shop')" />
          <el-table-column prop="payClient" :label="$t('flow.client')" />
          <el-table-column prop="payObs" :label="$t('flow.summary')" />
          <el-table-column prop="payTotal" :label="$t('pix.valor')" />
          <el-table-column
            prop="payStatus"
            :label="$t('flow.status')"
            :filters="ftstatus"
            :filter-method="filterHandler"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.payStatus === 0" type="success">{{
                $t("flow.recived")
              }}</el-tag>
              <el-tag v-if="scope.row.payStatus === 1" type="warning">{{
                $t("flow.notrecive")
              }}</el-tag>
              <el-tag v-if="scope.row.payStatus === 2" type="info">{{
                $t("flow.parcel")
              }}</el-tag>
              <el-tag v-if="scope.row.payStatus === 3" type="danger">{{
                $t("flow.cancel")
              }}</el-tag>
              <el-tag v-if="scope.row.payStatus === 4" type="info">{{
                $t("flow.return")
              }}</el-tag>
              <el-tag v-if="scope.row.payStatus === 5" type="info">{{
                $t("flow.experid")
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="receveStatu" :label="$t('flow.operar')">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.payStatus === 1"
                type="success"
                @click="handlePay(scope.row)"
                >{{ $t("flow.qrcode") }}</el-button
              >
              <el-button v-if="scope.row.payStatus === 3" type="danger">{{
                $t("flow.delete")
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </el-main>
    </el-container>
    <el-dialog
      title="Escanhar QR Code Para pagar"
      :visible.sync="dialogVisible"
      width="440px"
      :before-close="handleClose"
    >
      <!-- 图片大小控制在400px 400px -->
      <!-- <img :src="imgQr" class="image" style="width: 400px; height: 400px" /> -->
      <vue-qr
        :logo-src="logoSrc"
        :size="400"
        :margin="20"
        :auto-color="true"
        :dot-scale="1"
        :text="appSrc"
        color-dark="black"
        color-light="white"
      />
      <h3>Valor a pagar R$ {{ valorQr }}</h3>
      <!-- <img :src="imgQr" class="image" /> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import { getPayList, getPayStatus } from "@/api/pay";
import VueQr from "vue-qr";
export default {
  components: { VueQr },
  data() {
    return {
      search: "", // 搜索框的值
      searchTotal: 0, // 查询到的总金额
      logoSrc: "", // 二维码logo地址
      appSrc: "", // 二维码图片地址
      valorQr: 0, // 二维码金额
      dialogVisible: false,
      currentPage: 0,
      totalCount: 0,
      pageSize: 20,
      checked: false,
      ftstatus: [
        { value: 0, text: this.$t("flow.recived") },
        { value: 1, text: this.$t("flow.notrecive") },
        // { value: 2, text: "部分收款" },
        // { value: 3, text: "已取消" },
        // { value: 4, text: "已退款" },
        { value: 5, text: this.$t("flow.experid") },
      ],
      form: { type: [] },
      datetime: "",
      // status_legend: '0: Recebido, 1: Pendente, 2: Parcial, 3: Cancelado, 4: Estornado',
      tableData: [],
      multipleSelection: [],
    };
  },
  mounted() {
    // 这里是生命周期函数，会在页面加载时执行
    // 调用api中的getList方法获取到数据，并赋值给tableData
    // this.getList();
  },
  methods: {
    // 关闭弹出窗
    handleClose(done) {
      this.dialogVisible = false;
      this.appSrc = "";
    },
    handlePay(scope) {
      // 使用scope.pix_path来查询
      getPayStatus({ pix_path: scope.pix_path }).then((res) => {
        console.log(res, "res处");
        if (res.success) {
          // 查询成功，显示二维码)
          this.appSrc = res.data.pixCopiaECola;
          this.valorQr = scope.payTotal;
          this.dialogVisible = true;
        } else if (res.Payment == true) {
          // 付款已成功，刷新页面
          this.$message({
            message: "付款成功Pagamento Successo",
            type: "success",
            duration: 5 * 1000,
          });
          this.getInfoList(this.currentPage);
        } else {
          // 刷新数据
          this.$message({
            message: res.msg,
            type: "error",
            duration: 5 * 1000,
          });
          this.getInfoList(this.currentPage);
        }
      });
    },
    // 页面切换
    handlePageChange(newPage) {
      this.getInfoList(newPage);
    },
    // 优化表格显示时间
    formatDate(row, column) {
      const date = new Date(row.payDate);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    // 时间单个转换方法方法
    convertToDatabaseFormat(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    // 点击查询按钮时触发
    onSubmit() {
      this.getInfoList(1);
    },
    // 获取列表数据
    getInfoList(page) {
      // console.log("sousuoneirong", this.search);
      // 如果不存在page参数，则默认为1
      if (!page) {
        page = 1;
      }
      // 首先判断datatime是否为空
      // 如果不为空则通过convertToDatabaseFormat方法提取住startTime和endTime
      // 如果为空则不提取
      let startTime = "";
      let endTime = "";
      if (this.datetime) {
        startTime = this.convertToDatabaseFormat(this.datetime[0]);
        // 获取endTime，并给时间加上23小时59分59秒
        endTime = this.convertToDatabaseFormat(this.datetime[1]);
        endTime = endTime.split(" ")[0] + " 23:59:59";
      }
      const query = {}; // 创建一个空的查询对象

      if (startTime && endTime) {
        query.startTime = startTime;
        query.endTime = endTime;
      }
      query.currentPage = page;
      query.pageSize = this.pageSize;
      query.search = this.search;

      getPayList(query).then((res) => {
        this.tableData = res.data.data;
        // 把total转换成number类型赋值给totalCount
        this.totalCount = res.data.total;
        this.currentPage = Number(res.data.currentPage);
      });
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    checkPermission,
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
  },
};
</script>

<style lang="scss">
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
