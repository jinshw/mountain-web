<template>
  <d2-container>
    <h1 class="d2-mt-0">管理员管理</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input type="text" placeholder="账号" v-model="searchText"></el-input>
      </el-col>
      <el-col :span="18">
        <el-button v-on:click="getUsers">查询</el-button>
        <el-button type="primary" v-on:click="addDialogVisible=true">新增</el-button>
        <el-button type="primary" >修改</el-button>
        <el-button type="primary" >删除</el-button>
      </el-col>  
      
    </el-row>
    <el-dialog title="新增用户" :visible.sync="addDialogVisible">
       <el-form label-width="80px" size="mini">
        <el-form-item label="登录账号"  >
          <el-input  auto-complete="off" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="登录密码"  >
          <el-input type="password"  auto-complete="off" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"  >
          <el-input type="email"  auto-complete="off" v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"  >
          <el-input auto-complete="off" v-model="user.mobile"></el-input>
        </el-form-item>
        <el-form-item label="状态"  >
          <el-input auto-complete="off" v-model="user.status"></el-input>
        </el-form-item>


       <el-form-item >
          <el-button type="primary" v-on:click="addUser">立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      :data="users"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="userId"
        label="主键"
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="账号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button  type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import util from "@/libs/util.js";
import qs from "qs";
export default {
  name: "admin",
  data() {
    return {
      users: [],
      addDialogVisible: false,
      searchText:"",
      user: { userId:0,username: "", password: "", email: "",mobile:"",status:"",deptId:"" }
    };
  },
  mounted(){
    this.getUsers();
  },
  methods: {
    getUsers: function(event) {
      var that = this;
      console.log("getUsers....");
      var sid = util.cookies.get("sessionId");
      console.log("sessionid==" + sid,"  searchText="+that.searchText);
      this.$axios({
        method: "post",
        url: "/users",
        headers: { token: sid },
        data: qs.stringify({searchText:that.searchText})
      })
        .then(res => {
          console.log(res);
          that.users = res.data;
        })
        .catch(err => {
          console.group("登陆结果..");
          console.log("err: ", err);
        });
    },
    addUser: function(event) {
      var that = this;
      console.log("addUser....");
      var sid = util.cookies.get("sessionId");
      console.log("sessionid==" + sid);
      this.$axios({
        method: "post",
        url: "/userAdd",
        headers: { token: sid },
        data: qs.stringify(that.user)
      })
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            that.getUsers();
            that.addDialogVisible = false;
          }
        })
        .catch(err => {
          console.group("登陆结果..");
          console.log("err: ", err);
        });
    },
    handleDelete: function(index, row) {
      var that = this;
      var sid = util.cookies.get("sessionId");
      console.log(index, row,row.userId,sid)

      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.$axios({
            method: "post",
            url: "/userDelete",
            headers: { token: sid },
            data: qs.stringify({ id: row.userId })
          })
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
                that.getUsers();
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
    handleUpdate: function(index, row) {
      var that = this;
      var sid = util.cookies.get("sessionId");
      console.log(index, row,row.userId,sid)
      console.log(JSON.stringify(row))

      delete row.createTime//删除createTime属性，后台不能转换这个属性string类型

      that.$axios({
        method: "post",
        url: "/userUpdate",
        headers: { token: sid },
        data: qs.stringify(row)
      })
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            that.$message({
              type: "success",
              message: "删除成功!"
            });
            that.getUsers();
          }
        })
        .catch(err => {
          console.group("结果..");
          console.log("err: ", err);
        });

          
       

    },
    
  }
};
</script>
