<template>
  <v-card
    color="#f5f5f5"
    :max-width="listView ? '360' : ''"
    :height="listView ? '370': '100%'"
    class="elevation-3"
  >
    {{ dialog }}
    <v-img
      :aspect-ratio="16/9"
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      height="200px"
    >
      <v-row
        align="start"
        justify="end"
        class="lightbox white--text pa-5"
      >
        <span
          v-if="currentUserEmail === creator"
          class="white--text"
        >
          <v-icon
            dark
            @click="$emit('updateThread', threadId)"
          >
            mdi-pencil
          </v-icon>
          <v-dialog
            v-model="dialog"
            width="290"
          >
            <template v-slot:activator="{ on }">
              <v-icon
                dark
                v-on="on"
              >
                mdi-delete
              </v-icon>
            </template>

            <v-card>
              <v-card-text
                class="pa-3"
              >
                Are you sure you want to delete this thread '{{ title }}' ?
              </v-card-text>

              <v-divider />

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  text
                  @click="dialog = false"
                >
                  I accept
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </span>
      </v-row>
    </v-img>

    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-3">
          <v-img
            class="elevation-6"
            src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            class="blue--text pointer"
          >
            {{ creator }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ getHumanDate(createdOn) }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-row
          align="center"
          justify="end"
        >
          <v-icon class="mr-1">
            mdi-share-variant
          </v-icon>
        </v-row>
      </v-list-item>
    </v-card-actions>

    <v-divider />

    <v-card-title
      :class="['body-1', (listView ? 'pointer blue--text' : '')]"
      @click="$emit('emitRedirectToThread')"
    >
      {{ title }}
      <span>
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

    <v-card-subtitle
      class="caption"
    >
      {{ description }}
    </v-card-subtitle>
    <slot
      name="threadReviews"
    />
  </v-card>
</template>
<script>
import moment from 'moment'
import userMixin from '~/mixins/userMixin'

export default {
  mixins: [userMixin],
  props: {
    threadId: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    creator: {
      type: String,
      default: ''
    },
    createdOn: {
      type: Date,
      default: Date.now()
    },
    listView: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getHumanDate (date) {
      const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
      return moment(formattedDate).fromNow()
    }
  }
}
</script>
