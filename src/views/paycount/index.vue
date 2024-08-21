<template>
  <div style="margin: 0px" class="app-container documentation-container">
    <div v-if="!isAuthenticated">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-input
            v-model="password"
            placeholder="请输入密码"
            show-password
            @keyup.enter="checkPassword"
          />
        </el-col>
        <el-col :span="10">
          <el-button
            type="primary"
            @click="checkPassword"
          >确认</el-button></el-col>
      </el-row>
      <div v-if="errorMessage" style="color: red">{{ errorMessage }}</div>
    </div>
    <div v-else>
      <!-- 这里是需要加密保护的页面内容 -->
      <el-container>
        <el-header>
          <el-form ref="form" :inline="true" :model="form" label-width="80px">
            <el-form-item :label="$t('flow.timerange')">
              <el-select
                v-model="selectedRange"
                placeholder="请选择日期范围"
                @change="handleRangeChange"
              >
                <el-option :label="$t('paycount.custom')" value="custom" />
                <el-option :label="$t('paycount.today')" value="today" />
                <el-option
                  :label="$t('paycount.yesterday')"
                  value="yesterday"
                />
                <el-option :label="$t('paycount.last7')" value="last7days" />
                <el-option :label="$t('paycount.last30')" value="last30days" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="datetime"
                type="daterange"
                :range-separator="$t('flow.to')"
                :start-placeholder="$t('flow.starttime')"
                :end-placeholder="$t('flow.endtime')"
                align="right"
                :disabled="selectedRange !== 'custom'"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{
                $t("flow.query")
              }}</el-button>
            </el-form-item>
            <el-form-item />
          </el-form>
        </el-header>
        <el-main v-if="show">
          <el-card class="box-card">
            <div class="clearfix">
              <span>{{ $t("paycount.total") }}：</span>
              <span class="totalamount">R$ {{ totalamount }}</span>
            </div></el-card>
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              prop="payNum"
              :label="$t('flow.codico')"
              width="215px"
            />
            <el-table-column
              prop="payDate"
              :label="$t('flow.date')"
              width="180px"
              :formatter="formatDate"
            />
            <el-table-column prop="summary" :label="$t('flow.shop')" />
            <el-table-column prop="payTotal" :label="$t('pix.valor')" />
            <el-table-column
              prop="payClient"
              :label="$t('flow.client')"
              width="180px"
            />
            <el-table-column
              prop="payObs"
              :label="$t('flow.summary')"
              width="180px"
            />
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
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { getPayStatus, getPayTotalList } from '@/api/pay'
import VueQr from 'vue-qr'
export default {
  components: { VueQr },
  data() {
    return {
      show: false,
      totalamount: 0, // 总金额
      password: '',
      isAuthenticated: true, // 标记用户是否已通过身份验证
      errorMessage: '', // 错误信息
      correctPassword: '123456', // 设置正确的密码
      selectedRange: 'yesterday', // 默认选择为"自定义"
      searchTotal: 0, // 查询到的总金额
      dialogVisible: false,
      currentPage: 0,
      totalCount: 0,
      pageSize: 20,
      checked: false,
      form: { type: [] },
      datetime: [],
      tableData: [],
      multipleSelection: []
    }
  },
  mounted() {
    // 这里是生命周期函数，会在页面加载时执行
    // 调用api中的getList方法获取到数据，并赋值给tableData
    this.handleRangeChange()
    if (this.isAuthenticated) {
      this.handleRangeChange()
    }
  },
  methods: {
    checkPassword() {
      if (this.password === this.correctPassword) {
        this.isAuthenticated = true
        this.errorMessage = ''
        this.handleRangeChange()
      } else {
        this.errorMessage = '密码错误，请重试。'
      }
    },
    handleRangeChange() {
      const today = new Date()
      let start = null
      let end = null
      switch (this.selectedRange) {
        case 'today':
          start = new Date(today.setHours(0, 0, 0, 0))
          end = new Date(today.setHours(23, 59, 59, 999))
          break
        case 'yesterday':
          start = new Date(today.setDate(today.getDate() - 1))
          start.setHours(0, 0, 0, 0)
          end = new Date(today.setHours(23, 59, 59, 999))
          break
        case 'last7days':
          start = new Date()
          start.setDate(start.getDate() - 7) // 减去7天
          start.setHours(0, 0, 0, 0)

          end = new Date()
          end.setDate(end.getDate() - 1) // 减去1天，使其不包括今天
          end.setHours(23, 59, 59, 999)
          break

        case 'last30days':
          start = new Date()
          start.setDate(start.getDate() - 30) // 减去30天
          start.setHours(0, 0, 0, 0)

          end = new Date()
          end.setDate(end.getDate() - 1) // 减去1天，使其不包括今天
          end.setHours(23, 59, 59, 999)
          break
        default:
          this.datetime = []
          return
      }
      this.datetime = [start, end]
    },
    // 页面切换
    handlePageChange(newPage) {
      this.getPayTotalList(newPage)
    },
    // 优化表格显示时间
    formatDate(row, column) {
      const date = new Date(row.payDate)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    },
    // 时间单个转换方法方法
    convertToDatabaseFormat(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    // 点击查询按钮时触发
    onSubmit() {
      this.getTotalList(1)
    },
    // 获取列表数据
    getTotalList(page) {
      // 如果不存在page参数，则默认为1
      if (!page) {
        page = 1
      }
      // 首先判断datatime是否为空
      // 如果不为空则通过convertToDatabaseFormat方法提取住startTime和endTime
      // 如果为空则不提取
      let startTime = ''
      let endTime = ''
      if (this.datetime) {
        startTime = this.convertToDatabaseFormat(this.datetime[0])
        // 获取endTime，并给时间加上23小时59分59秒
        endTime = this.convertToDatabaseFormat(this.datetime[1])
        endTime = endTime.split(' ')[0] + ' 23:59:59'
      }
      const query = {} // 创建一个空的查询对象

      if (startTime && endTime) {
        query.startTime = startTime
        query.endTime = endTime
      }
      query.currentPage = page
      query.pageSize = this.pageSize

      getPayTotalList(query).then((res) => {
        this.show = true
        this.tableData = res.data.data
        this.totalamount = res.data.totalAmount
        // 把total转换成number类型赋值给totalCount
        this.totalCount = res.data.total
        this.currentPage = Number(res.data.currentPage)
      })
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
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 180px;
}
</style>
