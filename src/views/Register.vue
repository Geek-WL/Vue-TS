<template>
  <div class="register-container">
    <div class="register-box">
      <h2>欢迎注册</h2>
      <el-tabs tab-position="left" style="height: 350px;" @tab-click="handleClick">
        <el-tab-pane label="用户名注册">
          <NormalForm ref="normalForm"/>
        </el-tab-pane>
        <el-tab-pane label="邮箱注册">
          <EmailForm ref="emailForm"></EmailForm>
        </el-tab-pane>
        <el-tab-pane label="手机号注册">
          <PhoneForm ref="phoneForm"></PhoneForm>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Ref} from 'vue-property-decorator'
import NormalForm from "@/components/NormalForm.vue";
import EmailForm from "@/components/EmailForm.vue";
import PhoneForm from "@/components/PhoneForm.vue";
  // import {ElForm} from "element-ui/types/form";
@Component({
  name: 'Register',
  components: {
    NormalForm,
    EmailForm,
    PhoneForm
  }
})
export default class Register extends Vue{
  @Ref() readonly normalForm!: NormalForm;
  @Ref() readonly emailForm!: EmailForm;
  @Ref() readonly phoneForm!: PhoneForm;
  private handleClick() {
    this.normalForm.resetForm();
    this.emailForm.resetForm();
    this.phoneForm.resetForm();
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  width: 100%;
  height: 100%;
  background: url("../assets/bg.jpg") no-repeat;
  background-size: 100% 100%;
  position: relative;
  .register-box {
    width: 600px;
    height: 425px;
    border-radius: 10px;
    background: #fff;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    padding: 0 20px;
    box-sizing: border-box;
    h2 {
      text-align: center;
    }
  }
}
</style>
