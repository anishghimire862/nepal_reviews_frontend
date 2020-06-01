<template>
  <div class="text-center">
    <v-rating
      v-model="rating"
      @input="$emit('userRating', rating)"
    />
  </div>
</template>
<script>
import userMixin from '~/mixins/userMixin'

export default {
  mixins: [userMixin],
  props: {
    threadId: {
      type: String,
      default: ''
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
          self.rating = response.data.rating.rating
        })
    }
  }
}
</script>
