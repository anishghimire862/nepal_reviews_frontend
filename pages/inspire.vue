<template>
  <div>
    <div>
      <label>Email</label>
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
        @click="userLogin"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      login: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async userLogin () {
      try {
        const response = await this.$auth.loginWith('local', { data: this.login })
        // eslint-disable-next-line no-console
        console.log(response)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    }
  }
}
</script>
