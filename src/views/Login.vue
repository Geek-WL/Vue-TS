<template>
  <div class="login-container">
<!--    <vue-particle-line>-->
      <div class="login-box">
        <h2>通用后台管理系统</h2>
<!--        <p>TS+Vue联合打造</p>-->
        <el-form ref="form" :model="loginData" :rules="loginRules" label-width="0px">
          <el-form-item label="" prop="username">
            <el-input v-model="loginData.username" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input type="password" v-model="loginData.password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item label="" prop="captcha">
            <el-row>
              <el-col :span="14">
                <el-input v-model="loginData.captcha" prefix-icon="el-icon-lock"></el-input>
              </el-col>
              <el-col :span="10">
                <img src="http://127.0.0.1:7001/imageCode" ref="captchaImage" alt="" @click="updateCaptcha">
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" style="width: 100%;">登录</el-button>
          </el-form-item>
        </el-form>
        <ul class="auth-box">
          <li class="iconfont icon-qq" style="color: deepskyblue"></li>
          <li class="iconfont icon-weixin" style="color: greenyellow"></li>
          <li class="iconfont icon-weibo" style="color: red"></li>
          <li class="iconfont icon-github" style="color: #000">
            <a href="http://127.0.0.1:7001/passport/github"></a>
          </li>
        </ul>
      </div>
<!--    </vue-particle-line>-->
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Ref} from 'vue-property-decorator'
  import {loginUser} from "@/api";
  import {ElForm} from "element-ui/types/form";
  @Component({
  name: 'Login',
  components: {
  }
})
export default class Login extends Vue{
  loginData = {
    username: '',
    email: '',
    phone: '',
    password: '',
    captcha: '',
    type: 'normal',
  };
  loginRules = {
    username: [
      { validator: this.validateUsername, trigger: 'blur' }
    ],
    password: [
      { validator: this.validatePassword, trigger: 'blur' }
    ],
    captcha: [
      { validator: this.validateCaptcha, trigger: 'blur' }
    ],
  };
  private validateUsername(rule: any, value: string, callback: any) {
    // console.log(rule, value, callback)
    const normalReg = /^[a-zA-Z0-9]{6,}$/;
    const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    const phoneReg = /^1[3456789]\d{9}$/;
    if(!value) {
      callback(new Error('请填写用户名'));
    }else if(emailReg.test(value)) {
      this.loginData.email = this.loginData.username;
      // this.loginData.username = '';
      this.loginData.type = 'email';
      callback();
    }else if(phoneReg.test(value)){
      this.loginData.phone = this.loginData.username;
      // this.loginData.username = '';
      this.loginData.type = 'phone';
      callback()
    }else if(normalReg.test(value)){
      this.loginData.type = 'normal';
      callback()
    }else{
      callback(new Error('用户名不正确'));
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

  @Ref() readonly form!: ElForm;
  onSubmit() {
    this.form.validate(flag => {
      if(flag) {
        loginUser(this.loginData)
        .then((res: any) => {
          if(res.status === 200) {
            (this as any).$message.success(res.data.msg);
            sessionStorage.setItem('userInfo', JSON.stringify(res.data.data));
            // console.log(res);
            this.$router.push('/admin')
          }else{
            (this as any).$message.error(res.data.msg)
          }
        })
        .catch(err => {
          (this as any).$message.error(err.response.data.msg)
        })
      }else{
        (this as any).$message.error('请完善登录信息')
      }
    })
  }
  // ! 表示一定有此标签
  @Ref() readonly captchaImage!: HTMLImageElement;
  private updateCaptcha() {
    // 虽然可以通过类型断言来解决错误，但是与ts强类型语言思想不符
    this.captchaImage.src = `http://127.0.0.1:7001/imageCode?r=${Math.random()}`;
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    width: 100%;
    height: 100%;
    background: url("../assets/bg.jpg") no-repeat;
    background-size: 100% 100%;
    /*background: #000;*/
    position: relative;
    .login-box {
      width: 400px;
      height: 365px;
      border-radius: 10px;
      /*background: transparent;*/
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      background: #fff;
      z-index: 666;
      padding: 0 20px;
      box-sizing: border-box;
      h2 {
        color: #d8d8d8;
      }
      /*P {*/
      /*  color: #acacac;*/
      /*  text-align: center;*/
      /*}*/
      .el-form {
        margin: 0 auto;
        width: 300px;
        .el-form-item {
          height: 38px;
          /*text-align: center;*/
          .el-col {
            height: 40px;
          }
          .el-button {
            margin-top: 10px;
          }
        }
      }
      .auth-box {
        display: flex;
        justify-content: space-around;
        list-style: none;
        padding: 0;
        li {
          text-decoration: none;
          font-size: 28px;
          position: relative;
          a {
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }
      h2 {
        text-align: center;
      }
    }
  }
</style>
