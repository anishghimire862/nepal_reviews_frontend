<template>
  <v-card
    class="mb-1 pa-2"
  >
    <v-textarea
      v-model="description"
      label="Write your review here..."
      no-resize
      rows="2"
    />
    <div
      class="text-right"
    >
      <Rating />
      <v-btn
        class="ma-2"
        outlined
        color="indigo"
        @click="submit"
      >
        Submit Review
      </v-btn>
    </div>
  </v-card>
</template>
<script>
import Rating from '~/components/Rating'
export default {
  components: {
    Rating
  },
  props: {
    threadId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      description: ''
    }
  },
  methods: {
    submit () {
      const threadId = this.threadId
      const url = '/reviews'
      const self = this

      const data = {
        description: this.description,
        threadId
      }

      this.$axios.post(url, data)
        .then(function (response) {
          self.description = ''
          self.$emit('refreshReviews')
          alert('Review created.')
        })
        .catch(function (error) {
          alert(error)
        })
    }
  }
}
</script>
