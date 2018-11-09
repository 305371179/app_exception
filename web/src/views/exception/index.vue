<template>
  <div class="dashboard-container" v-loading.body="listLoading" element-loading-text="Loading">
    <div class="block">
      <span class="demonstration" style="margin-right: 10px;">选择日期</span>
      <!--format="yyyy-MM-dd HH:mm:ss"-->
      <!--value-format="yyyy-MM-dd HH:mm:ss"-->
      <el-date-picker
        :clearable="false"
        v-model="date"
        type="datetimerange"
        :picker-options="pickerOptions2"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange"
        align="right">
      </el-date-picker>
      <span class="demonstration" style="margin-right: 10px;margin-left: 10px;">统计筛选</span>
      <el-select v-model="message" placeholder="请选择" style="width:400px;" @change="selectChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button style="float: right" :disabled="!list.length" type="primary" :loading="loading" @click="deleteException">清空数据</el-button>
      <el-button plain style="float: right;margin-right: 10px;" :disabled="!list.length" type="success" :loading="loading" @click="dialogVisible=true">手动增加</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      :default-sort = "{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        label="序号"
        type="index"
      >
      </el-table-column>
      <el-table-column
        :formatter="dateFormat"
        prop="date"
        label="日期"
        sortable
        width="180"
      >
      </el-table-column>
      <!--<el-table-column-->
        <!--label="生产异常堆栈"-->
        <!--width="500"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<p v-html="strFormat(scope.row.stack)"></p>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        label="源码异常堆栈"
        width="500"
        >
        <template slot-scope="scope">
          <p v-html="strFormat(scope.row.rawStack)"></p>
        </template>
      </el-table-column>

      <el-table-column
        label="源码片段"
        min-width="500"
      >
        <template slot-scope="scope">
          <!--<pre><code class="js" v-html="codeFormat(scope.row.code)"></code></pre>-->
          <codemirror :ref="'code'+scope.$index"
                      :value="codeFormat(scope.row.code)"
                      :options="cmOption(scope.row.code)"
                      ></codemirror>

          <!--@ready="onCmReady($event,scope.row.code,scope.$index)"-->
          <!--<pre v-highlightjs="codeFormat(scope.row.code)"><code class="javascript"></code></pre>-->
        </template>
      </el-table-column>
      <el-table-column
        label="查看源码"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-button size="small" :disabled="!list.length" type="danger" @click="checkFile(scope)">查看源文件</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="IP"
        prop="ip"
        >
      </el-table-column>
      <el-table-column
        label="UA"
        prop="ua"
        width="300"
        >
      </el-table-column>
      <el-table-column
        label="邮件已发"
        >
        <template slot-scope="scope">
          <p>{{scope.row.email?'是':'否'}}</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align: center;margin-top: 20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[5, 10, 50, 100]"
        :page-count="pageData.pageCount"
        :page-size="pageData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total">
      </el-pagination>
    </div>
    <el-dialog title="增加异常" :visible.sync="dialogVisible" @close="stack=''">
      <div style="margin: 10px 20px;">
        <el-input :rows="15" type="textarea" v-model="stack" placeholder="请输入堆栈信息"></el-input>
      </div>
      <el-button @click="confirm" type="primary" style="margin: 10px 20px;" :disabled="!stack.length">确定</el-button>
    </el-dialog>
    <el-dialog title="查看源文件" :visible.sync="dialogVisible1" @close="fileCode={}">
      <div style="margin: 10px 20px;">
        <codemirror ref="fileCode"
                    :value="codeFormat(fileCode)"
                    :options="cmFileOption"
        ></codemirror>      </div>
      <div style="height:50px;">
        <el-button @click="dialogVisible1=false" type="primary" style="float:right;">退出</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<!--<style src="../../highlight/default.css"></style>-->
<script>
import { mapGetters } from 'vuex'
import { getExceptions,deleteException,sendException, checkFile,statistics } from '@/api/exception'


export default {
  name: 'dashboard',
  components: {
    // Codemirror
  },
  mounted(){
    // hljs.initHighlightingOnLoad();
    // hljs.initLineNumbersOnLoad();

  },
  data() {
    return {
      message:'',
      options: [],
      clearable:false,
      fileCode:{},
      stack:'',
      dialogVisible:false,
      dialogVisible1:false,
      pageSize:10,
      pageData:{},
      list: [],
      listLoading: true,
      loading:false,
      currentPage:1,
      cmOption1: {
        // value: '<p>hello</p>',
        // origLeft: null,
        // orig: '<p>hello world</p>',
        // connect: 'align',
        mode: "javascript",
        lineNumbers: true,
        firstLineNumber:444,
        scrollbarStyle: null,
        readOnly:true,
        lineWiseCopyCut: true,
        // collapseIdentical: false,
        // highlightDifferences: true,
        // theme: 'darcula',
        line: true,
      },
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      date:[new Date(Date.now()-60*60*24*30*1000),new Date(Date.now())]
    }
  },
  filters:{
    strFormat:function(value){
      return value.replace(/\n/g,'<br')
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
    cmFileOption(){
      // console.log(this.cmOption(this.fileCode),555555)
      return this.cmOption(this.fileCode)
    }
    // pages(){
    //   if(!this.pageData.pageSize)return []
    //   let
    // }
  },
  created() {
    this.fetchData()
    statistics().then(response => {
      if(response.data){
        this.options=[{value:'',label:' 全部'}]
        response.data.forEach(item=>{
          this.options.push({
            value:item._id,
            label:item.count+'  '+item._id
          })
        })
      }
    }).catch(error=>{
    })
  },
  watch:{
    list(){
      // setTimeout(()=>{
      //   $('pre code').each(function(i, block) {
      //     hljs.highlightBlock(block);
      //   });
      // })
      for(let i=0;i<this.list.length;i++){
        let item = this.list[i]
        this.onCmReady(null,item.code,i)
      }
    },
    fileCode(){
      // console.log(this.fileCode,44444)
      this.onCmReady(null,this.fileCode)
    }
  },
  methods: {
    selectChange(){
      this.fetchData()
    },
    checkFile(scope){
      if(!scope.row.code){
        return this.$message.error('找不到源码')
      }
      this.dialogVisible1=true
      this.listLoading = true
      // console.log(new Date(this.date[0]).getTime())
      // return
      checkFile({exceptionId:scope.row._id}).then(response => {
        if(response.data){
          let content = this.parseFile(response.data, scope.row.code.line, scope.row.code.col);
          content.row= scope.row.code.line-1
          this.fileCode=content
        }
        this.listLoading = false
      }).catch(error=>{
        this.listLoading = false
      })
    },
    parseFile(code,line,column){
      let strs = code.split('\n')
      // console.log(strs.length,line,column)
      let range = line//附近的代码
      let row = line -1
      let col = column
      let lmin = 0
      let lmax = strs.length-2//-2是为了去掉webpack footer
      if(lmin<0)lmin=0
      if(lmax>strs.length-1)lmax = strs.length-2
      let codeArray = []
      for(let i = lmin;i<lmax;i++){
        // console.log(strs[i])
        codeArray.push(strs[i])
        // console.log(strs[i][col],444444)
      }
      // console.log(row,col)
      // console.log(code,index,source)
      return {codeArray,row:range,col,line}
    },
    confirm(){
      this.listLoading = true
      // console.log(new Date(this.date[0]).getTime())
      // return
      sendException({stack:this.stack}).then(response => {
        if(response.data){
          this.list.push(response.data)
          this.stack = '';
          this.dialogVisible=false
        }
        this.listLoading = false
      }).catch(error=>{
        this.listLoading = false
      })
    },
    dateChange(){
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.fetchData()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.fetchData()
      console.log(`当前页: ${val}`);
    },
    onCmReady(event,code,index){
      // return
      // console.log(event)
      // console.log(code,index)
      if(!code)return
      if(code.row===undefined)return
      // console.log(this.$refs['code'+index].$el.querySelectorAll('.CodeMirror-line')[code.row])
      setTimeout(()=>{
        let parent=''
        if(index===undefined){
          parent = this.$refs['fileCode'].$el
        }else{
          parent = this.$refs['code'+index].$el
        }

        let targetRow =parent.querySelectorAll('.CodeMirror-line')[code.row]
        targetRow.style.background = '#afafaf'
        //寻找列
        if(!code.col)return
        let length =code.codeArray[code.row].length
        let rcode = code.codeArray[code.row].replace(/(^\s*)|(\s*$)/g, "")
        let col = code.col-(length-rcode.length)
        let char = rcode[col]

        let spans = targetRow.querySelectorAll('span[class^="cm-"]')
        if(spans){
          let count =0
          let last = 0
          for(let item of spans){
            let text = item.innerText
            last = count
            count+=text.length
            if(count>=col){
              let index = col-last-2
              item.innerHTML= text.substr(0,index)+`<em style="color:red;font-weight: bolder;">${char}</em>`+text.substr(index+1)
            }
          }
        }
      },0)

      // CodeMirror-line
    },
    cmOption(code){
      if(!code)return {}
      let option={
        mode: "javascript",
        lineNumbers: true,
        firstLineNumber:code.line?code.line-code.row:1,
        scrollbarStyle: null,
        readOnly:true,
        lineWiseCopyCut: true,
        line: true,
      }

      return option
    },
    codeFormat(code){
      if(!code||!code.codeArray)return ''
      let str =''
      code.codeArray.forEach(item =>{
        str+=item+'\n'
      })
      str=str.substr(0,str.length-1)
      return str
    },
    deleteException(){
        this.loading=true
        deleteException().then(response => {
          if (response.data) {
            this.list=[]
          }
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
    },
    strFormat:function(value){
      if(!value)return ''
      return value.replace(/\n/g,'<br>')
    },
    dateFormat(row, column) {
      var value = row.date
      if(!value)return ''
      return new Date(value).Format('yyyy-MM-dd hh:mm:ss');
    },
    fetchData() {
      if(!this.date)return
      this.listLoading = true
      // console.log(new Date(this.date[0]).getTime())
      // return
      let message = this.message
      getExceptions({message,page:this.currentPage,pageSize:this.pageSize,startDate:new Date(this.date[0]).getTime(),endDate:new Date(this.date[1]).getTime()}).then(response => {
        if(response.data){
          this.list =response.data.list
          let {pageSize,total,pageCount} = response.data
          this.pageData={pageSize,total,pageCount}
        }
        this.listLoading = false
      }).catch(error=>{
        this.listLoading = false
      })
    }
  }
}
</script>
<style>
  .CodeMirror{
    height: auto;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>

.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
