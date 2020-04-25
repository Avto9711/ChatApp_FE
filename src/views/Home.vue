<template>
  <div class="home">
    <div id="nav">
      <!-- <router-link @click="" to="/">Log Out</router-link>  -->
      <a  @click="logOut">Log Out</a>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import CONSTANTS from '../utils/Constants';

export default {
  name: 'Home',
  components: {
  },
  methods:{
    logOut(){
        this.$store.dispatch(CONSTANTS.LOGOUT_DISPATCHER).then(()=>{
              this.$router.push({name:'Login'})
        })
    }
  }
}
</script>
