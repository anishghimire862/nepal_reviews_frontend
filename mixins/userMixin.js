export default {
  computed: {
    currentUserId () {
      return this.isLoggedIn ? this.$auth.user.data.id : ''
    },
    isLoggedIn () {
      return this.$auth.loggedIn
    }
  }
}
