<template>
  <d2-container>
    <h1 class="d2-mt-0">角色管理</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input type="text" placeholder="角色名称" v-model="searchText"></el-input>
      </el-col>
      <el-col :span="18">
        <el-button v-on:click="getRoles">查询</el-button>
        <el-button type="primary" v-on:click="addDialogVisible=true">新增</el-button>
        <el-button type="primary" >修改</el-button>
        <el-button type="primary" >删除</el-button>
      </el-col>  
      
    </el-row>
    <el-dialog title="新增角色" :visible.sync="addDialogVisible">
       <el-form label-width="80px" size="mini">
        <el-form-item label="角色名称"  >
          <el-input  auto-complete="off" v-model="role.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"  >
          <el-input  auto-complete="off" v-model="role.remark"></el-input>
        </el-form-item>
       <el-form-item >
          <el-button type="primary" v-on:click="addRole">立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      :data="roles"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="roleId"
        label="角色ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="角色描述">
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button  type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
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
  name: "role",
  data() {
    return {
      roles: [],
      addDialogVisible: false,
      searchText: "",
      role: { roleName: "", remark: "", roleId: 0 }
    };
  },
  methods: {
    getRoles: function(event) {
      var that = this;
      var sid = util.cookies.get("sessionId");
      console.log("sessionid==" + sid, "  searchText=" + this.searchText);
      this.$axios({
        method: "post",
        url: "/roles",
        headers: { token: sid },
        data: qs.stringify({ searchText: that.searchText })
      })
        .then(res => {
          console.log(res.data);
          that.roles = res.data;
        })
        .catch(err => {
          console.log("err: ", err,err.response.data.message);
          if(err.response.data.message.includes("Subject does not have permission")){
             this.$message({
                message: '警告哦，没有操作权限',
                type: 'warning'
             });
          }

        });
    },
    addRole: function(event) {
      var that = this;
      var sid = util.cookies.get("sessionId");
       console.log("sessionid==" + sid, that.role);
      this.$axios({
        method: "post",
        url: "/roleAdd",
        headers: { token: sid },
        data: qs.stringify(that.role)
      })
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            that.getRoles();
            that.addDialogVisible = false;
          }
        })
        .catch(err => {
          console.log("err: ", err);
        });
    },
    handleDelete: function(index, row) {
      var that = this;
      var sid = util.cookies.get("sessionId");
      console.log(index, row, row.roleId, sid);

      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .$axios({
              method: "post",
              url: "/roleDelete",
              headers: { token: sid },
              data: qs.stringify({ roleId: row.roleId})
            })
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
                that.getRoles();
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
    }
  }
};
</script>
