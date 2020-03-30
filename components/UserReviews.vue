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
        v-for="review in reviews"
        :key="review.id"
      >
        <template v-slot:icon>
          <v-avatar>
            <img src="http://i.pravatar.cc/64">
          </v-avatar>
        </template>

        <v-card class="elevation-3 mr-2">
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
export default {
  props: {
    reviews: {
      type: Array,
      default: () => []
    }
  }
}
</script>>
