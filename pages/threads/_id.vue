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
        <Thread
          :title="thread.title"
          :description="thread.description"
          :creator="thread.creator"
          :created-on="new Date(thread.createdAt)"
          :list-view="false"
          @updateThread="updateThread"
        >
          <template
            v-slot:threadReviews
          >
            <review-form
              v-if="isLoggedIn"
              :thread-id="threadId"
              @refreshReviews="getReviews()"
            />
            <v-divider
              v-if="!isLoggedIn"
            />
            <user-reviews
              :reviews="reviews"
              :show-update-review-form="showUserReviewForm"
              @retriveReviewsAfterPatchFromParent="getReviews()"
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
      threadId: null,
      thread: {},
      createThreadSheet: false,
      reviews: [],
      loading: true,
      updateThreadInFullPage: false
    }
  },
  mounted () {
    this.threadId = parseInt(this.$route.params.id)
    this.getThread()
  },
  methods: {
    getThread () {
      const id = parseInt(this.threadId)
      const url = `/threads/${id}`
      const self = this
      this.$axios.get(url)
        .then(function (response) {
          self.thread = response.data
          self.getReviews()
        })
    },
    getReviews () {
      const id = parseInt(this.threadId)
      const url = `/reviews/${id}`
      const self = this
      this.$axios.get(url)
        .then(function (response) {
          self.reviews = response.data
          self.loading = false
        })
    },
    updateThread (threadId) {
      this.updateThreadInFullPage = true
      this.createThreadSheet = true
    },
    closeBottomSheet () {
      this.createThreadSheet = !this.createThreadSheet
      this.updateThreadInFullPage = false
    }
  }
}
</script>
