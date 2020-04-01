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
        <span
          v-if="isUpdate"
        >
          Update Review
        </span>
        <span
          v-else
        >
          Submit Review
        </span>
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
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    reviewId: {
      type: Number,
      default: 0
    },
    reviewDescription: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      description: this.reviewDescription ? this.reviewDescription : ''
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

      if (this.isUpdate) {
        const patchUrl = `/reviews/${this.reviewId}`
        this.$axios.patch(patchUrl, data)
          .then(function (response) {
            self.$emit('retriveReviewsAfterPatch')
            self.$emit('hideUpdateFormAfterPatch')
            alert('Review Updated')
          })
          .catch(function (error) {
            alert(error)
          })
      } else {
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
}
</script>
