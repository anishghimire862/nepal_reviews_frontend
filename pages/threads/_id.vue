<template>
  <div>
    <v-row
      v-if="loading"
      dense
    >
      <v-col>
        <v-skeleton-loader
          transition="fade-transition"
          type="card"
        />
      </v-col>
    </v-row>
    <v-row
      v-else
      dense
    >
      <v-col
        xs="12"
        sm="12"
        md="12"
      >
        <!--
          :created-on="new Date(thread.createdAt)"
        -->
        <Thread
          :title="thread.title"
          :description="thread.description"
          :creator="thread.user._id"
          :creator-name="thread.user.username"
          :thread-images="thread.images"
          :ratings="formRatingArray(thread.reviews)"
          :list-view="false"
          @updateThread="updateThread"
          @deleteThread="deleteThread"
        >
          <template
            v-slot:threadReviews
          >
            <review-form
              v-if="isLoggedIn && !hasReviewed"
              :thread-id="threadId"
              @retriveReviewsAfterPatch="getThread()"
              @refreshReviews="getThread()"
              @refreshAverageRating="getThread()"
            />
            <v-divider
              v-if="!isLoggedIn"
            />
            <user-reviews
              :reviews="reviews"
              @retriveReviewsAfterPatchFromParent="getThread()"
              @deleteReview="deleteReview"
              @refreshReviewsAfterImageDelete="getReviews()"
            />
          </template>
        </Thread>
      </v-col>
    </v-row>
    <create-thread
      :create-thread-sheet="createThreadSheet"
      :form-title="'Update Thread'"
      :thread-id="threadId"
      :update-thread="updateThreadInFullPage"
      @emitClose="closeBottomSheet()"
      @refreshThread="getThread()"
      @emitRefreshThreadAfterImageDeletion="getThread()"
    />
  </div>
</template>

<script>
import Thread from '~/components/Thread.vue'
import CreateThread from '~/components/CreateThread.vue'
import UserReviews from '~/components/UserReviews'
import ReviewForm from '~/components/ReviewForm'
import userMixin from '~/mixins/userMixin'

export default {
  auth: false,
  components: {
    Thread,
    CreateThread,
    UserReviews,
    ReviewForm
  },
  mixins: [userMixin],
  data () {
    return {
      threadId: '',
      thread: {},
      reviews: [],
      createThreadSheet: false,
      loading: true,
      updateThreadInFullPage: false,
      hasReviewed: false
    }
  },
  mounted () {
    this.threadId = this.$route.params.id
    this.getThread()
  },
  methods: {
    formRatingArray (reviews) {
      const arr = []
      for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].review) {
          if (reviews[i].review.rating) {
            arr.push(reviews[i].review.rating)
          }
        }
      }
      return arr
    },
    getThread () {
      const id = this.threadId
      const url = `/threads/${id}`
      const self = this
      this.$axios.get(url)
        .then(function (response) {
          self.thread = response.data[0]
          self.getReviews()
          self.loading = false
        })
    },
    getReviews () {
      const id = this.threadId
      const url = `/reviews/${id}`
      const self = this
      this.$axios.get(url)
        .then(function (response) {
          self.reviews = response.data
          self.hasCurrentUserReviewed()
          self.loading = false
        })
    },
    hasCurrentUserReviewed () {
      this.hasReviewed = this.reviews.some(review => review.user_id === this.currentUserId)
      return this.hasReviewed
    },
    updateThread (threadId) {
      this.updateThreadInFullPage = true
      this.createThreadSheet = true
    },
    closeBottomSheet () {
      this.createThreadSheet = !this.createThreadSheet
      this.updateThreadInFullPage = false
    },
    deleteThread () {
      const url = `/threads/${this.threadId}`
      const self = this
      this.$axios.delete(url)
        .then(function (response) {
          alert('Thread Deleted')
          self.$router.push('/')
        })
        .catch(function (error) {
          alert(error)
        })
    },
    deleteReview (reviewId) {
      const url = `/reviews/${reviewId}`
      const self = this
      this.$axios.delete(url)
        .then(function (response) {
          alert('Review Deleted')
          self.getReviews()
        })
        .catch(function (error) {
          alert(error)
        })
    }
  }
}
</script>
