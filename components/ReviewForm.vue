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
      <div>
        <Rating
          v-if="isUpdate"
          :thread-id="threadId"
          @userRating="userRating"
        />
      </div>
      <div>
        <file-upload
          :clear-images="clearImages"
          @preview="openPreview"
        />
      </div>
      <div
        v-if="!isUpdate"
      >
        <Rating
          :thread-id="threadId"
          @userRating="userRating"
        />
      </div>
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
      type: String,
      default: ''
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    reviewId: {
      type: String,
      default: ''
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
      clearImages: false,
      rating: null
    }
  },
  methods: {
    userRating (value) {
      this.rating = value
    },
    submit () {
      const threadId = this.threadId
      const url = '/reviews'
      const self = this

      const data = {
        description: this.description,
        threadId,
        rating: this.rating
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
