<template>
  <div>
    <p
      v-if="reviews.length>0"
      class="pa-4 body-2"
    >
      User Reviews
    </p>
    <v-timeline
      v-if="reviews.length>0"
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
            :thread-id="review.thread_id"
            :review-id="review._id"
            :review-description="reviewDescription"
            :is-update="true"
            @retriveReviewsAfterPatch="$emit('retriveReviewsAfterPatchFromParent')"
            @hideUpdateFormAfterPatch="showUpdateReviewForm = false"
            @refreshAverageRating="$emit('refreshAverageRating')"
          />
        </div>
        <v-card
          v-else
          class="elevation-3 mr-2"
        >
          <v-card-title class="body-2 pointer blue--text pa-2">
            {{ review.user[0].username }}
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
                v-if="review.rating"
                class="body-2 black--text"
              >
                {{ review.rating }}
              </span>
              <span
                v-else
                class="black--text"
              >
                N/A
              </span>
            </span>
            <v-spacer />
            <span
              v-if="currentUserId === review.user[0]._id"
            >
              <v-icon
                class="body-2"
                @click="updateReview(review._id), showUpdateReviewFormId = index, reviewId = review._id, reviewDescription = review.description, $emit('getUpdateDetails')"
              >
                mdi-pencil
              </v-icon>
              <v-dialog
                v-model="dialog"
                width="290"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    class="body-2"
                    v-on="on"
                  >
                    mdi-delete
                  </v-icon>
                </template>

                <v-card>
                  <v-card-text
                    class="pa-3"
                  >
                    Are you sure you want to delete this review ?
                  </v-card-text>

                  <v-divider />

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      text
                      @click="$emit('deleteReview', review._id), dialog = false"
                    >
                      Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </span>
          </v-card-title>
          <v-card-subtitle class="caption pa-2">
            {{ review.description }}
            <v-row
              v-if="review.images !== null"
            >
              <v-col
                v-for="(image, key) in review.images"
                :key="key"
                xs="12"
                sm="6"
                md="2"
                cols="12"
              >
                <v-img
                  :src="'http://localhost:8082/' +image"
                  aspect-ratio="1"
                />
                <!-- <span
                  class="caption"
                >
                  {{ image | truncate(15) }}
                </span> -->
                <!-- <span
                  v-if="currentUserId === image.userId"
                  @click="deleteImage(image.id, key)"
                >
                  <v-icon
                    class="caption pointer"
                  >
                    mdi-delete
                  </v-icon>
                </span> -->
              </v-col>
            </v-row>
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
      reviewId: '',
      reviewDescription: '',
      showUpdateReviewFormId: null,
      showUpdateReviewForm: false,
      dialog: false
    }
  },
  methods: {
    updateReview (reviewId) {
      this.showUpdateReviewForm = true
    },
    deleteImage (imageId, key) {
      const url = `/review-image/${imageId}`
      const self = this
      this.$axios.delete(url)
        .then(function (response) {
          self.$emit('refreshReviewsAfterImageDelete')
          alert('Review Image Deleted')
        })
        .catch(function (error) {
          alert(error)
        })
    }
  }
}
</script>>
