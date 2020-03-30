<template>
  <div>
    <div>
      <label>Username</label>
      <input
        v-model="login.email"
        type="text"
      >
    </div>
    <div>
      <label>Password</label>
      <input
        v-model="login.password"
        type="text"
      >
    </div>
    <div>
      <button
        type="submit"
        @click="submitLogin()"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script>
import userMixin from '~/mixins/userMixin'
export default {
  mixins: [userMixin],
  data () {
    return {
      login: {
        email: '',
        password: ''
      }
    }
  },
  created () {
    if (this.isLoggedIn) {
      this.$router.push('/')
    }
  },
  methods: {
    async submitLogin () {
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.login.email,
            password: this.login.password
          }
        })
        this.$router.push('/')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }
  }
}
</script>
