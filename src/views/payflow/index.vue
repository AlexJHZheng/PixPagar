<template>
  <div style="margin: 0px" class="app-container documentation-container">
    <el-container>
      <el-header>
        <el-form ref="form" :inline="true" :model="form" label-width="80px">
          <el-form-item label="时间范围">
            <div class="grid-content bg-purple">
              <el-date-picker
                v-model="datetime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
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
            v-if="checkPermission(['admin'])"
            type="selection"
            width="55"
          >
          </el-table-column> -->
          <el-table-column prop="payNum" label="编号" width="215px" />
          <el-table-column
            prop="payDate"
            label="日期"
            :formatter="formatDate"
          />
          <el-table-column prop="summary" label="店铺" />
          <!-- <el-table-column prop="pedido" label="单号(可选)" /> -->
          <el-table-column prop="payClient" label="客人" />
          <el-table-column prop="payTotal" label="金额" />
          <el-table-column
            prop="payStatus"
            label="状态"
            :filters="ftstatus"
            :filter-method="filterHandler"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.payStatus === 0" type="success"
                >Recebido</el-tag
              >
              <el-tag v-if="scope.row.payStatus === 1" type="warning"
                >Pendente</el-tag
              >
              <el-tag v-if="scope.row.payStatus === 2" type="info"
                >Parcial</el-tag
              >
              <el-tag v-if="scope.row.payStatus === 3" type="danger"
                >Cancelado</el-tag
              >
              <el-tag v-if="scope.row.payStatus === 4" type="info"
                >Estornado</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="receveStatu" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.payStatus === 1"
                type="success"
                @click="handlePay(scope.row)"
                >二维码</el-button
              >
              <el-button v-if="scope.row.payStatus === 3" type="danger"
                >删除</el-button
              >
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
          >
          </el-pagination>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      title="Pay Status"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
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
import { get } from "js-cookie";
export default {
  data() {
    return {
      dialogVisible: false,
      currentPage: 0,
      totalCount: 0,
      pageSize: 5,
      checked: false,
      ftstatus: [
        { value: 0, text: "已收款" },
        { value: 1, text: "待收款" },
        { value: 2, text: "部分收款" },
        { value: 3, text: "已取消" },
        { value: 4, text: "已退款" },
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
    //关闭弹出窗
    handleClose(done) {
      this.dialogVisible = false;
    },
    handlePay(scope) {
      console.log(scope);
      this.dialogVisible = true;
      // 使用scope.pix_path来查询
      getPayStatus({ pix_path: scope.pix_path }).then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.status == 0) {
          // 支付成功
          console.log(res.msg);
        } else if (res.status == 200 && res.data.status == 1) {
          // 显示二维码
          console.log(res.data.pix_wallet);
        }
      });
      // 如果过期则调用webhook接口更新上去
      // 如果没过期则正常显示二维码
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
      //如果不存在page参数，则默认为1
      if (!page) {
        page = 1;
      }
      //首先判断datatime是否为空
      //如果不为空则通过convertToDatabaseFormat方法提取住startTime和endTime
      //如果为空则不提取
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
