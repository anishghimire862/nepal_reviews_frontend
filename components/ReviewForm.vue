<template>
  <div>
    <v-card
      class="mb-1 pa-2"
    >
      <v-textarea
        v-model="description"
        label="Write your review here..."
        no-resize
        rows="2"
      />
      <file-upload
        :clear-images="clearImages"
        @preview="openPreview"
      />
      <div
        class="text-right"
      >
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
    <div
      v-if="!isUpdate"
    >
      <Rating
        :thread-id="threadId"
        @refreshReviews="$emit('refreshReviews')"
        @refreshAverageRating="$emit('refreshAverageRating')"
      />
    </div>
  </div>
</template>
<script>
import FileUpload from '~/components/FileUpload'
import Rating from '~/components/Rating'
export default {
  components: {
    FileUpload,
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
      description: this.reviewDescription ? this.reviewDescription : '',
      reviewImages: [],
      clearImages: false
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

      const formData = new FormData()

      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value)
      }

      if (this.reviewImages.length > 0) {
        for (let i = 0; i < this.reviewImages.length; i++) {
          formData.append('image', this.reviewImages[i])
        }
      }

      if (this.isUpdate) {
        const patchUrl = `/reviews/${this.reviewId}`
        this.$axios.patch(patchUrl, formData)
          .then(function (response) {
            self.$emit('retriveReviewsAfterPatch')
            self.$emit('hideUpdateFormAfterPatch')
            alert('Review Updated')
          })
          .catch(function (error) {
            alert(error)
          })
      } else {
        this.$axios.post(url, formData)
          .then(function (response) {
            self.description = ''
            self.clearImages = true
            self.$emit('refreshReviews')
            alert('Review created.')
          })
          .catch(function (error) {
            alert(error)
          })
      }
    },
    openPreview (files) {
      for (let i = 0; i < files.length; i++) {
        this.reviewImages.push(files[i])
      }
    }
  }
}
</script>
