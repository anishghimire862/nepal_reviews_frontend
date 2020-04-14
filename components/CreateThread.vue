<template>
  <v-dialog
    v-model="createThreadSheet"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
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
      <v-sheet>
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
            <FileUpload
              :url-link="url"
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
    </v-card>
  </v-dialog>
</template>
<script>
import FileUpload from '~/components/FileUpload.vue'
export default {
  components: {
    FileUpload
  },
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
      category: null,
      url: '',
      file: '',
      images: [],
      clearImages: false
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
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description)
        formData.append('category', data.category)
        for (let i = 0; i < this.images.length; i++) {
          formData.append('image', this.images[i])
        }
        this.$axios.post(url, formData)
          .then(function (response) {
            self.title = ''
            self.description = ''
            self.category = null
            self.clearImages = true
            self.$emit('emitClose')
            self.$emit('refreshThread')
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
    },
    openPreview (files) {
      for (let i = 0; i < files.length; i++) {
        this.images.push(files[i])
      }
      // // this.url = URL.createObjectURL(files[0])
      // console.log(this.url)
    }
  }
}
</script>
