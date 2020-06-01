export default {
  computed: {
    currentUserId () {
      return this.isLoggedIn ? this.$auth.user.data._id : ''
    },
    isLoggedIn () {
      return this.$auth.loggedIn
    }
  }
}
