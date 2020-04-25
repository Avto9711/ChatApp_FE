<template>
  <div style="center">
    <div class="container login-container">
      <div class="row">
        <div class="col-md-6 offset-3 login-form-2">
          <h3>ChatApp Login</h3>
          <form>
            <div class="form-group">
              <input v-model="model.userName" type="text" class="form-control" placeholder="Your username *" value />
            </div>
            <div class="form-group">
              <input v-model="model.password" type="password" class="form-control" placeholder="Your Password *" value />
            </div>
            <div class="form-group">
              <input @click="handleLogin" type="button" class="btnSubmit" value="Login" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import Constants from '../utils/Constants'

@Component({})
export default class Login extends Vue {
  public model = {
    userName: null,
    password: null
  };

  async handleLogin () {
    try {
      const result = await this.$store.dispatch(Constants.LOGIN_DISPATCHER, { ...this.model })
      this.$router.push({name:'ChatRoom'})
    } catch (error) {
      alert(error);
      throw error
    }
    console.log('login pressed')
  }
}
</script>

<style scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  margin-top: 5%;
  margin-bottom: 5%;
}
.login-form-1 {
  padding: 5%;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
}
.login-form-1 h3 {
  text-align: center;
  color: #333;
}
.login-form-2 {
  padding: 5%;
  background: #0062cc;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
}
.login-form-2 h3 {
  text-align: center;
  color: #fff;
}
.login-container form {
  padding: 10%;
}
.btnSubmit {
  width: 50%;
  border-radius: 1rem;
  padding: 1.5%;
  border: none;
  cursor: pointer;
}
.login-form-1 .btnSubmit {
  font-weight: 600;
  color: #fff;
  background-color: #0062cc;
}
.login-form-2 .btnSubmit {
  font-weight: 600;
  color: #0062cc;
  background-color: #fff;
}
.login-form-2 .ForgetPwd {
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.login-form-1 .ForgetPwd {
  color: #0062cc;
  font-weight: 600;
  text-decoration: none;
}
</style>
