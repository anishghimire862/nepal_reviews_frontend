export default {
  computed: {
    currentUserEmail () {
      return this.isLoggedIn ? this.$auth.user.data.email : ''
    },
    isLoggedIn () {
      return this.$auth.loggedIn
    }
  }
}
