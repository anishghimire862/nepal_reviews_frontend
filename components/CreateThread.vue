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
            <span
              v-if="threadId !== null && threadImages.length > 0"
              class="caption"
            >
              Existing images...
            </span>
            <v-row
              v-if="threadId !== null"
            >
              <v-col
                v-for="(image, key) in threadImages"
                :key="key"
                xs="12"
                sm="6"
                md="2"
                cols="12"
              >
                <v-img
                  :src="'http://localhost:8080/' +image.image"
                  aspect-ratio="1"
                />
                <span
                  class="caption"
                >
                  {{ image.image | truncate(15) }}
                </span>
                <span
                  v-if="currentUserId === image.userId"
                  @click="deleteImage(image.id, key)"
                >
                  <v-icon
                    class="caption pointer"
                  >
                    mdi-delete
                  </v-icon>
                </span>
              </v-col>
            </v-row>
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
import userMixin from '~/mixins/userMixin'

export default {
  components: {
    FileUpload
  },
  mixins: [userMixin],
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
      clearImages: false,
      threadImages: []
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
    },
    createThreadSheet (val) {
      if (val === false) {
        this.clearImages = true
        this.title = ''
        this.description = ''
        this.category = ''
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

      const formData = new FormData()

      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value)
      }

      if (this.images.length > 0) {
        for (let i = 0; i < this.images.length; i++) {
          formData.append('image', this.images[i])
        }
      }

      if (this.threadId === null) {
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
        this.$axios.patch(patchUrl, formData)
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
          self.threadImages = response.data.thread_images
        })
    },
    openPreview (files) {
      for (let i = 0; i < files.length; i++) {
        this.images.push(files[i])
      }
    },
    deleteImage (imageId, key) {
      const url = `/thread-image/${imageId}`
      const self = this
      this.$axios.delete(url)
        .then(function (response) {
          self.threadImages.splice(key, 1)
          alert('Thread Image Deleted')
          self.$emit('emitRefreshThreadAfterImageDeletion')
        })
        .catch(function (error) {
          alert(error)
        })
    }
  }
}
</script>
