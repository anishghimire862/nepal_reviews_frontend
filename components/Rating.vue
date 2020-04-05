<template>
  <div class="text-center">
    <v-rating
      v-model="rating"
      @input="submitRating"
    />
  </div>
</template>
<script>
import userMixin from '~/mixins/userMixin'

export default {
  mixins: [userMixin],
  props: {
    threadId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      rating: 0
    }
  },
  mounted () {
    this.getRatingOfCurrentUser()
  },
  methods: {
    getRatingOfCurrentUser () {
      const userId = this.currentUserId
      const url = `/current-user-star/${this.threadId}/${userId}`
      const self = this
      this.$axios.get(url)
        .then(function (response) {
          self.rating = response.data.star
        })
    },
    submitRating (val) {
      const url = '/ratings'
      const data = {
        star: val,
        threadId: this.threadId
      }
      const self = this
      this.$axios.post(url, data)
        .then(function (response) {
          self.$emit('refreshReviews')
          alert('Rating Updated.')
        })
        .catch(function (error) {
          alert(error)
        })
    }
  }
}
</script>
