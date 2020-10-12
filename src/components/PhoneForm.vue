<template>
  <el-form ref="form" :model="registerData" :rules="registerRules" label-width="0px">
    <el-form-item label="" prop="phone">
      <el-input v-model="registerData.phone" prefix-icon="el-icon-message"></el-input>
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
          <el-button @click="sendSmsCode">发送验证码</el-button>
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
import {registerUser,sendCode2Phone} from '@/api/index'

@Component({
  name: 'PhoneForm'
})
export default class PhoneForm extends Vue{
  private registerData = {
    phone: '',
    password: '',
    captcha: '',
    type: 'phone',
    checked: true
  };
  private registerRules = {
    phone: [
      { validator: this.validatePhone, trigger: 'blur' }
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
  private validatePhone(rule: any, value: string, callback: any) {
    // console.log(rule, value, callback)
    const reg = /^1[3456789]\d{9}$/;
    if(!value) {
      callback(new Error('请填写手机号'));
    }else if(!reg.test(value)) {
      callback(new Error('手机号格式不正确'));
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

  private sendSmsCode() {
    sendCode2Phone({phone: this.registerData.phone})
    .then((data:any) => {
      if(data.status === 200) {
        (this as any).$message.success('验证码已发送');
      }else{
        (this as any).$message.error(data.data.msg);
      }
    })
    .catch(err => {
      (this as any).$message.error(err.response.data.msg);
    })
  }

  @Ref() readonly form !: ElForm;
  private onSubmit() {
    this.form.validate((flag) => {
      if(flag) {
        // alert('注册成功');
        registerUser(this.registerData)
          .then((data: any) => {
            if(data.status === 200) {
              (this as any).$message.success(data.data.msg);
              this.$router.push('/login')
            }else{
              (this as any).$message.error(data.data.msg);
            }
          })
          .catch((err) => {
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
  }
}
</script>

<style lang="scss" scoped>
  a {
    text-decoration: none;
  }
</style>
