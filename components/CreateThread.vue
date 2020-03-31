<template>
  <v-card class="text-center">
    <v-bottom-sheet
      v-model="createThreadSheet"
      persistent
    >
      <v-toolbar
        color="primary"
        dense
        dark
      >
        <v-toolbar-title
          class="body-2"
        >
          {{ formTitle }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          text
          @click="$emit('emitClose')"
        >
          close
        </v-btn>
      </v-toolbar>
      <v-sheet height="300px">
        <div
          class="d-flex justify-center"
        >
          <v-form
            style="width: 70%"
          >
            <v-text-field
              v-model="title"
              label="Title of the thread"
              class="body-caption"
            />
            <v-textarea
              v-model="description"
              label="Description of the thread for which you want users' review..."
              no-resize
              rows="2"
            />
            <v-select
              v-model="category"
              :items="threadCategory"
              label="Please select appropriate category of the thread..."
              dense
            />
            <div
              class="text-right"
            >
              <v-btn
                class="ma-2"
                outlined
                color="indigo"
                @click="submitThread"
              >
                <span>
                  {{ threadId === null ? 'Create Thread' : 'Update Thread' }}
                </span>
              </v-btn>
            </div>
          </v-form>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </v-card>
</template>
<script>
export default {
  props: {
    createThreadSheet: {
      type: Boolean,
      default: false
    },
    formTitle: {
      type: String,
      default: ''
    },
    updateThread: {
      type: Boolean,
      default: false
    },
    threadId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      threadCategory: ['Movie', 'Book', 'Place', 'Others'],
      title: '',
      description: '',
      category: null
    }
  },
  watch: {
    threadId (val) {
      if (val !== null) {
        this.getThread()
      }
    },
    updateThread (val) {
      if (val === true) {
        this.getThread()
      }
    },
    formTitle (val) {
      if (val === 'Create a Thread') {
        this.title = ''
        this.description = ''
        this.category = null
      }
    }
  },
  methods: {
    submitThread () {
      const url = '/threads/'
      const self = this

      const data = {
        title: this.title,
        description: this.description,
        category: this.category
      }

      if (this.threadId === null) {
        this.$axios.post(url, data)
          .then(function (response) {
            self.$emit('emitClose')
            self.$emit('refreshThreads')
            alert('Thread created.')
          })
          .catch(function (error) {
            alert(error)
          })
      } else {
        const patchUrl = `/threads/${this.threadId}`
        this.$axios.patch(patchUrl, data)
          .then(function (response) {
            self.title = ''
            self.description = ''
            self.category = null
            self.$emit('emitClose')
            self.$emit('refreshThread')
            alert('Thread updated.')
          })
          .catch(function (error) {
            alert(error)
          })
      }
    },
    getThread () {
      const id = parseInt(this.threadId)
      const url = `/threads/${id}`
      const self = this
      this.$axios.get(url)
        .then(function (response) {
          self.title = response.data.title
          self.description = response.data.description
          self.category = response.data.category
        })
    }
  }
}
</script>
