<template>
  <div style="margin: 0px" class="app-container documentation-container">
    <div>
      <el-form ref="form" :model="form" label-width="80px">
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
        <!-- <el-form-item label="订单状态">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="待付款" name="type"></el-checkbox>
              <el-checkbox label="已收到" name="type"></el-checkbox>
              <el-checkbox label="部分收到" name="type"></el-checkbox>
              <el-checkbox label="已取消" name="type"></el-checkbox>
              <el-checkbox label="已退款" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
      </el-form>
    </div>
    <el-container>
      <el-main>
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            v-if="checkPermission(['admin'])"
            prop="type"
            width="55"
          >
            <template slot-scope="scope">
              <el-checkbox
                v-if="scope.row.payStatu === 0 && scope.row.receveStatu === 0"
                v-model="scope.row.type"
              />
            </template>
          </el-table-column>
          <el-table-column prop="no" label="编号" />
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="loja" label="店铺" />
          <el-table-column prop="pedido" label="单号(可选)" />
          <el-table-column prop="cliente" label="客人" />
          <el-table-column prop="valor" label="金额" />
          <el-table-column
            prop="payStatu"
            label="状态"
            :filters="ftstatus"
            :filter-method="filterHandler"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.payStatu === 0"
                type="success"
              >Recebido</el-tag>
              <el-tag
                v-if="scope.row.payStatu === 1"
                type="warning"
              >Pendente</el-tag>
              <el-tag
                v-if="scope.row.payStatu === 2"
                type="info"
              >Parcial</el-tag>
              <el-tag
                v-if="scope.row.payStatu === 3"
                type="danger"
              >Cancelado</el-tag>
              <el-tag
                v-if="scope.row.payStatu === 4"
                type="info"
              >Estornado</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="receveStatu" label="对账状态">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.receveStatu === 1"
                type="success"
              >已对账</el-tag>
              <el-tag
                v-if="scope.row.receveStatu === 0"
                type="info"
              >未对账</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button
            v-if="checkPermission(['admin'])"
            @click="markRecived()"
          >确认对账</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  data() {
    return {
      ftstatus: [
        { value: 0, text: '已收款' },
        { value: 1, text: '待收款' },
        { value: 2, text: '部分收款' },
        { value: 3, text: '已取消' },
        { value: 4, text: '已退款' }
      ],
      form: { type: [] },
      datetime: '',
      // status_legend: '0: Recebido, 1: Pendente, 2: Parcial, 3: Cancelado, 4: Estornado',
      tableData: [
        {
          no: '12323',
          date: '2016-05-02',
          loja: '王天贵',
          pedido: 'XS0001',
          cliente: 'andereere',
          valor: 1000,
          summary: '现金',
          payStatu: 1
        },
        {
          no: '12424',
          date: '2016-05-02',
          loja: '王天贵',
          pedido: 'XS0002',
          cliente: 'aba',
          valor: 4200,
          summary: '现金',
          payStatu: 0,
          receveStatu: 1
        },
        {
          no: '1323',
          date: '2016-05-02',
          loja: '王天贵',
          pedido: 'XS0003',
          cliente: 'kkkkd',
          valor: 3000,
          summary: '现金',
          payStatu: 2
        },
        {
          no: '12',
          date: '2016-05-02',
          loja: '王天贵',
          pedido: 'XS0004',
          cliente: 'badaf',
          valor: 2000,
          summary: '现金',
          payStatu: 3
        },
        {
          no: '12',
          date: '2016-05-02',
          loja: '王天贵',
          pedido: 'XS0004',
          cliente: 'badaf',
          valor: 2000,
          summary: '现金',
          payStatu: 4
        },
        {
          no: '12424',
          date: '2016-05-02',
          loja: '王天贵',
          pedido: 'XS00066',
          cliente: 'aba',
          valor: 3232,
          summary: '现金',
          payStatu: 0,
          receveStatu: 0
        },
        {
          no: '12424',
          date: '2016-05-02',
          loja: '王天贵',
          pedido: 'XS00023',
          cliente: 'aba',
          valor: 232323,
          summary: '现金',
          payStatu: 0,
          receveStatu: 0
        }
      ]
    }
  },
  mounted() {},
  methods: {
    // 确认入账
    markRecived() {
      console.log(this.tableData)
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    checkPermission,
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll(scope) {
      //   将tabledate中所有的有type的, 赋值;
      console.log('点了')
      console.log(scope)
      //   判断val是否是空数组;
      //   val == [] ? (val = false) : (val = true);
      //   console.log(val, "是否有变化");

      //   this.tableData.forEach((element) => {
      //     element.type = val;
      //   });
    }
  }
}
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
