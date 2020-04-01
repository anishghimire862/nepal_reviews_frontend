<template>
  <div>
    <p
      v-if="reviews.length"
      class="pa-4 body-2"
    >
      User Reviews
    </p>
    <v-timeline
      v-if="reviews.length"
      dense
      class="mb-3"
    >
      <v-timeline-item
        v-for="(review, index) in reviews"
        :key="review.id"
      >
        <template v-slot:icon>
          <v-avatar>
            <img src="http://i.pravatar.cc/64">
          </v-avatar>
        </template>
        <div
          v-if="showUpdateReviewForm && showUpdateReviewFormId === index"
        >
          <ReviewForm
            :thread-id="review.threadId"
            :review-id="reviewId"
            :review-description="reviewDescription"
            :is-update="true"
            @retriveReviewsAfterPatch="$emit('retriveReviewsAfterPatchFromParent')"
            @hideUpdateFormAfterPatch="showUpdateReviewForm = false"
          />
        </div>
        <v-card
          v-else
          class="elevation-3 mr-2"
        >
          <v-card-title class="body-2 pointer blue--text pa-2">
            {{ review.creator }}
            <span
              class="body-2"
            >
              <v-icon
                dense
                small
                color="primary"
                class="mb-1 pl-1"
              >
                mdi-star
              </v-icon>
              <span
                class="body-2 black--text"
              >
                7.8
              </span>
            </span>
            <v-spacer />
            <span
              v-if="currentUserEmail === review.creator"
            >
              <v-icon
                class="body-2"
                @click="updateReview(review.id), showUpdateReviewFormId = index, reviewId = review.id, reviewDescription = review.description, $emit('getUpdateDetails')"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                class="body-2"
              >
                mdi-delete
              </v-icon>
            </span>
          </v-card-title>
          <v-card-subtitle class="caption pa-2">
            {{ review.description }}
          </v-card-subtitle>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <div
      v-else
      class="pa-4 caption"
    >
      No User Reviews Available.
    </div>
  </div>
</template>
<script>
import userMixin from '~/mixins/userMixin'
import ReviewForm from '~/components/ReviewForm'

export default {
  components: {
    ReviewForm
  },
  mixins: [userMixin],
  props: {
    reviews: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      reviewId: 0,
      reviewDescription: '',
      showUpdateReviewFormId: null,
      showUpdateReviewForm: false
    }
  },
  methods: {
    updateReview (reviewId) {
      this.showUpdateReviewForm = true
    }
  }
}
</script>>
