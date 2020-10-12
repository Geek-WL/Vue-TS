<template>
  <el-form ref="form" :model="registerData" :rules="registerRules" label-width="0px">
    <el-form-item label="" prop="username">
      <el-input v-model="registerData.username" prefix-icon="el-icon-user"></el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input type="password" v-model="registerData.password" prefix-icon="el-icon-lock"></el-input>
    </el-form-item>
    <el-form-item label="" prop="captcha">
      <el-row>
        <el-col :span="18">
          <el-input v-model="registerData.captcha" prefix-icon="el-icon-lock"></el-input>
        </el-col>
        <el-col :span="6">
          <img src="http://127.0.0.1:7001/imageCode" ref="captchaImage" alt="" @click="updateCaptcha">
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" style="width: 100%">注册</el-button>
    </el-form-item>
    <el-form-item prop="checked">
      <el-checkbox v-model="registerData.checked">
        <p>阅读并接受 <a href="#">《管理系统用户协议》</a>及<a href="#">《系统隐私权保护声明》</a></p>
      </el-checkbox>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {Vue, Component, Ref} from 'vue-property-decorator'
import {ElForm} from "element-ui/types/form";
import {registerUser} from '@/api/index'

@Component({
  name: 'NormalForm'
})
export default class NormalForm extends Vue{
  private registerData = {
    username: '',
    password: '',
    captcha: '',
    type: 'normal',
    checked: true
  };
  private registerRules = {
    username: [
      { validator: this.validateUsername, trigger: 'blur' }
    ],
    password: [
      { validator: this.validatePassword, trigger: 'blur' }
    ],
    captcha: [
      { validator: this.validateCaptcha, trigger: 'blur' }
    ],
    checked: [
      { validator: this.validateChecked, trigger: 'change'}
    ]
  };
  private validateUsername(rule: any, value: string, callback: any) {
    // console.log(rule, value, callback)
    const reg = /^[a-zA-Z0-9]{6,}$/;
    if(!value) {
      callback(new Error('请填写用户名'));
    }else if(value.length < 6) {
      callback(new Error('用户名至少6位'));
    }else if(!reg.test(value)) {
      callback(new Error('用户名只能是字母数字组合'));
    }else{
      callback()
    }
  };
  private validatePassword(rule: any, value: string, callback: any) {
    // console.log(rule, value, callback)
    const reg = /^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,\.#%'\+\*\-:;^_`].*))[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,}$/;
    if(!value) {
      callback(new Error('务必填写密码'));
    }else if(value.length < 6) {
      callback(new Error('密码至少8位'));
    }else if(!reg.test(value)) {
      callback(new Error('密码必须包含字母数字和特殊字符'));
    }else{
      callback()
    }
  };
  private validateCaptcha(rule: any, value: string, callback: any) {
    // 验证码必须是数字字母组合
    const reg = /^[A-Za-z0-9]{4}$/;
    if(!value) {
      callback(new Error('请填写验证码'));
    }else if(value.length < 4) {
      callback(new Error('验证码不完整'));
    }else if(!reg.test(value)) {
      callback(new Error('验证码必须是数字字母组合'));
    }else{
      callback()
    }
  };
  private validateChecked(rule: any, value: string, callback: any) {
    if(!value) {
      callback(new Error('请同意用户服务协议'));
    }else{
      callback();
    }
  };

  // ! 表示一定有此标签
  @Ref() readonly captchaImage!: HTMLImageElement;
  private updateCaptcha() {
    // 虽然可以通过类型断言来解决错误，但是与ts强类型语言思想不符
    // (this.$refs.captchaImage as any).src = `http://127.0.0.1:7001/imageCode?r=${Math.random()}`
    this.captchaImage.src = `http://127.0.0.1:7001/imageCode?r=${Math.random()}`;
  }

  @Ref() readonly form !: ElForm;
  private onSubmit() {
    this.form.validate((flag) => {
      if(flag) {
        // alert('注册成功');
        registerUser(this.registerData)
          .then((data: any) => {
            if(data.status === 200) {
              this.$router.push('/login');
              (this as any).$message.success('注册成功');
            }else{
              this.updateCaptcha();
              (this as any).$message.error(data.data.msg);
            }
          })
          .catch((err) => {
            this.updateCaptcha();
            (this as any).$message.error(err.response.data.msg);
          })
      }else{
        // alert('数据格式不正确');
        (this as any).$message.error('请完善注册信息');
      }
    })
  };
  public resetForm() {
    this.form.resetFields();
  };
}
</script>

<style lang="scss" scoped>
  a {
    text-decoration: none;
  }
</style>
