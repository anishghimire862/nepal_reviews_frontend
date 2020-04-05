<template>
  <div>
    <v-row
      v-if="loading"
      dense
    >
      <v-col
        v-for="i in 6"
        :key="i"
        xs="12"
        sm="6"
        md="4"
        class="pa-3"
      >
        <v-skeleton-loader
          transition="fade-transition"
          type="card"
        />
      </v-col>
    </v-row>
    <div
      v-else
    >
      <v-btn
        v-if="isLoggedIn"
        class="ma-2"
        outlined
        color="indigo"
        @click="createThreadSheet = !createThreadSheet"
      >
        Create Thread
      </v-btn>
      <v-alert
        v-else
        dense
        text
        type="info"
        class="ml-2 mr-3 mt-5"
      >
        Please login in order to create threads and give reviews.
      </v-alert>
      <v-row dense>
        <v-col
          v-for="thread in threads"
          :key="thread.id"
          xs="12"
          sm="6"
          md="4"
          class="pa-3"
        >
          <Thread
            :thread-id="thread.id"
            :title="thread.title"
            :description="thread.description"
            :creator="parseInt(thread.userId)"
            :creator-name="thread.users.name"
            :ratings="thread.ratings"
            :created-on="new Date(thread.createdAt)"
            @emitRedirectToThread="redirectToThread(thread.id)"
            @updateThread="updateThread"
            @deleteThread="deleteThread"
          />
        </v-col>
      </v-row>
    </div>
    <div
      v-if="threads.length === 0"
    >
      <v-alert
        dense
        text
        type="info"
        class="ml-2 mr-3 mt-5"
      >
        Be the first to create a thread and ask for reviews...
      </v-alert>
    </div>
    <create-thread
      :create-thread-sheet="createThreadSheet"
      :form-title="threadId === null ? 'Create a Thread' : 'Update Thread'"
      :thread-id="threadId"
      @emitClose="closeBottomSheet()"
      @refreshThread="getThreads()"
    />
  </div>
</template>

<script>
import Thread from '~/components/Thread.vue'
import CreateThread from '~/components/CreateThread.vue'
import userMixin from '~/mixins/userMixin'

export default {
  auth: false,
  components: {
    Thread,
    CreateThread
  },
  mixins: [userMixin],
  data () {
    return {
      threads: [],
      createThreadSheet: false,
      loading: true,
      threadId: null
    }
  },
  created () {
    this.getThreads()
  },
  methods: {
    redirectToThread (threadId) {
      const id = threadId
      this.$router.push(`/threads/${id}`)
    },
    getThreads () {
      const url = '/threads'
      const self = this
      this.$axios.get(url)
        .then(function (response) {
          self.threads = response.data
          self.loading = false
        })
    },
    updateThread (threadId) {
      this.threadId = threadId
      this.createThreadSheet = true
    },
    closeBottomSheet () {
      this.createThreadSheet = !this.createThreadSheet
      this.threadId = null
    },
    deleteThread (threadId) {
      const url = `/threads/${threadId}`
      const self = this
      this.$axios.delete(url)
        .then(function (response) {
          alert('Thread Deleted')
          self.getThreads()
        })
        .catch(function (error) {
          alert(error)
        })
    }
  }
}
</script>
