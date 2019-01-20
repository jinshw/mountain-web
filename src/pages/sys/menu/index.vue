<template>
  <d2-container>
    <h1 class="d2-mt-0">菜单管理</h1>
    <el-row class="d2-mb" :gutter="10">
       <el-col :span="6">
        <el-input type="text" placeholder="菜单名称" v-model="searchText"></el-input>
      </el-col>
      <el-col :span="18">
        <el-button v-on:click="getMenus">查询</el-button>
        <el-button type="primary" v-on:click="clickAddBT()">新增</el-button>
        <el-button type="primary" >修改</el-button>
        <el-button type="primary" >删除</el-button>
      </el-col>  
      
    </el-row>
    
     <el-dialog title="新增" :visible.sync="addDialogVisible">
       <el-form label-width="80px" size="mini">
        <el-form-item label="类型">
          <el-radio-group  v-model="menu.type" v-on:change="changeType">
            <el-radio label="0">目录</el-radio>
            <el-radio label="1">菜单</el-radio>
            <el-radio label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="menu.type=='0'">
          <el-form-item label="目录名称"  >
            <el-input  auto-complete="off" v-model="menu.name"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单"  >
            <el-input  auto-complete="off" v-model="menu.parentName" readonly="readonly" v-on:click.native="showMenuTree"></el-input>
          </el-form-item>
          <el-form-item label="排序号"  >
            <el-input-number v-model="menu.orderNum" :step=1 :min="0" :max="1000000" controls-position="right"></el-input-number>
          </el-form-item>
        </template>
        <template v-if="menu.type=='1'">
          <el-form-item label="菜单名称"  >
            <el-input  auto-complete="off" v-model="menu.name"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单"  >
            <el-input  auto-complete="off" v-model="menu.parentName" readonly="readonly" v-on:click.native="showMenuTree"></el-input>
          </el-form-item>
          <el-form-item label="菜单路由"  >
            <el-input  auto-complete="off" v-model="menu.url"></el-input>
          </el-form-item>
          <el-form-item label="授权标识"  >
            <el-input  auto-complete="off" v-model="menu.perms"></el-input>
          </el-form-item>
          <el-form-item label="排序号"  >
            <el-input-number v-model="menu.orderNum" :step=1 :min="0" :max="1000000" controls-position="right"></el-input-number>
          </el-form-item>
        </template>
        <template v-if="menu.type=='2'">
          <el-form-item label="按钮名称"  >
            <el-input  auto-complete="off" v-model="menu.name"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单"  >
            <el-input  auto-complete="off" v-model="menu.parentName" readonly="readonly" v-on:click.native="showMenuTree"></el-input>
          </el-form-item>
          <el-form-item label="授权标识"  >
            <el-input  auto-complete="off" v-model="menu.perms"></el-input>
          </el-form-item>
        </template>
        
        <el-form-item >
          <el-button type="primary" v-on:click="addRole">立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> 

    <el-dialog title="选择菜单" :visible.sync="menuTreeDialog">
      <el-container style="height: 400px;width:100%; border: 1px solid #eee;overflow-y: scroll;">
        <el-tree style="width:100%;"
          :data="data2"
          node-key="menuId"
          ref="tree"
          highlight-current
          :props="defaultProps"
          :default-expanded-keys="[-1]"
          >
        </el-tree>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuTreeDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveParentMenu">确 定</el-button>
      </div>
    </el-dialog>


    <el-table
      :data="menus"
      :row-style="showRow">

      <el-table-column v-if="menus.length===0" width="150">
        <template slot-scope="scope">
          <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
          <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-plus"/>
            <i v-else class="el-icon-minus"/>
          </span>
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column v-for="(column, index) in attrs" v-else :key="column.value" :label="column.text" :width="column.width" >
        <template slot-scope="scope">
          <!-- Todo -->
          <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
          <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>
          <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-caret-right"/>
            <i v-else class="el-icon-caret-bottom"/>
          </span>
          <template v-if="column.value=='type'">
            <template v-if="scope.row[column.value] == '0'">
              目录
            </template>
            <template v-else-if="scope.row[column.value] == '1'">
              菜单
            </template>
            <template v-else-if="scope.row[column.value] == '2'">
              按钮
            </template>
          </template>
          <template v-else>
            {{ scope.row[column.value] }}
          </template>
          <!-- {{ scope.row[column.value] }} -->
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button  type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" v-on:click="handleDelete(scope.index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
      
    </el-table>
  </d2-container>
</template>

<script>
import util from "@/libs/util.js";
import qs from "qs";
import treeToArray from "@/libs/eval.js";
export default {
  name: "menu",
  data() {
    return {
      menus: [],
      addDialogVisible: false,
      searchText: "",
      menu: { menuId: 0, name: "", type: "0", url: "",perms:"",parentId:"-1",parentName:"一级菜单",icon:"",orderNum:0 },

      data2: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuTreeDialog:false,
      currentNode:{},
      props:{
        expandAll: {
          type: Boolean,
          default: false
        }
      },
      attrs:[
        {
          text: '菜单ID',
          value: 'menuId',
          width: 180
        },
        {
          text: '名称',
          value: 'name',
          width: 180
        },
        {
          text: '类型',
          value: 'type'
        },
        {
          text: '菜单URL',
          value: 'url'
        },
        {
          text: '权限标识',
          value: 'perms'
        },
        {
          text: '排序号',
          value: 'orderNum'
        }
      ]

    };
  },
  computed: {
   
  },
  mounted(){
    this.getMenus();
  },
  methods: {
    clickAddBT(){
      this.addDialogVisible=true
      this.menu={ menuId: 0, name: "", type: "0", url: "",perms:"",parentId:"-1",parentName:"一级菜单",icon:"",orderNum:0 }

    },
    getMenus: function(event) {
      var that = this;
      var sid = util.cookies.get("sessionId");
      console.log("sessionid==" + sid);
      this.$axios({
        method: "post",
        url: "/sysmenu/getTree",
        headers: { token: sid },
        data: qs.stringify({ searchText: that.searchText,menuId:"-1" })
      })
        .then(res => {
          console.log(res.data);
          if(res.data.code == 444){
            that.$message({
              message: '登录过期，即将跳转登录页面',
              type: 'warning',
              duration:5000,
              onClose:function(){
                window.location.href = "http://localhost:8081/mt#/login"
              }
            });
          }else{
            that.menus = res.data.children;
            that.menus = that.formatData()
          }
          
        })
        .catch(err => {
          console.log("err: ", err,err.response.data.message);
          if(err.response.data.message.includes("Subject does not have permission")){
             this.$message({
                message: '警告，没有操作权限',
                type: 'warning'
             });
          }

        });


    },
    addRole: function(event) {
      var that = this;
      var sid = util.cookies.get("sessionId");
      console.log("sessionid==" + sid, that.menu);
      this.$axios({
        method: "post",
        url: "/sysmenu/add",
        headers: { token: sid },
        data: qs.stringify(that.menu)
      })
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            that.getMenus();
            that.addDialogVisible = false;
            that.$message({
              message: '操作成功！',
              type: 'success'
            });
          }
        })
        .catch(err => {
          console.log("err: ", err);
        });
    },
    handleDelete: function(index, row) {
      var that = this;
      var sid = util.cookies.get("sessionId");
      console.log(index, row, row.menuId, sid);

      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .$axios({
              method: "post",
              url: "/sysmenuDelete",
              headers: { token: sid },
              data: qs.stringify({ id: row.menuId})
            })
            .then(res => {
              console.log(res);
              if (res.data.status == 200) {
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
                that.getMenus();
              }else if(res.data.status == 201){
                that.$message({
                  type: "info",
                  message: "不是子节点不能删除!"
                });
              }
            })
            .catch(err => {
              console.group("结果..");
              console.log("err: ", err);
            });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showMenuTree:function(){
      var that = this;
      var sid = util.cookies.get("sessionId");
      console.log("sessionid==" + sid);
      this.$axios({
        method: "post",
        url: "/sysmenu/getTree",
        headers: { token: sid },
        data: qs.stringify({ searchText: that.searchText,menuId:"-1" })
      })
        .then(res => {
          console.log(res.data);
          that.data2 = [res.data];
          that.menuTreeDialog = true
        })
        .catch(err => {
          console.log("err: ", err,err.response.data.message);
          if(err.response.data.message.includes("Subject does not have permission")){
            this.$message({
                message: '警告，没有操作权限',
                type: 'warning'
            });
          }

        });
      
    },
    saveParentMenu:function(){
      this.currentNode = this.$refs.tree.getCurrentNode()
      this.menuTreeDialog = false
      console.log(this.currentNode)
      this.menu.parentId = this.currentNode.menuId
      this.menu.parentName = this.currentNode.name
    },
    toggleExpanded:function(trIndex) {
      console.log(trIndex)
      const record = this.menus[trIndex]
      record._expanded = !record._expanded
      console.log(this.menus)
    },
     // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.menus)) {
        tmp = [this.menus]
      } else {
        tmp = this.menus
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      console.log("formatData....")
      console.log(args)
      return func.apply(null, args)
    },
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
    changeType(){
      console.log(this.menu.type)
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>