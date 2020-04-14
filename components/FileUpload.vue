<template>
  <div class="py-3">
    <v-row
      no-gutters
    >
      <v-col
        v-if="files"
        ma-auto
      >
        <v-row>
          <v-col
            v-for="(file, key) in files"
            :key="key"
            xs="12"
            sm="6"
            md="2"
            cols="12"
          >
            <v-img
              :src="filesUrl[key]"
              aspect-ratio="1"
            />
            <span
              class="caption"
            >
              {{ file.name | truncate(15) }}
            </span>
            <span
              @click="removeFile(key)"
            >
              <v-icon
                class="caption pointer"
              >
                mdi-delete
              </v-icon>
            </span>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
      >
        <v-btn @click="$refs.files.click()">
          Upload Image
        </v-btn>
      </v-col>
    </v-row>
    <input
      ref="files"
      type="file"
      class="hidden-lg-and-down"
      multiple
      @change="sendPreview"
    >
  </div>
</template>
<script>
export default {
  props: {
    urlLink: {
      type: String,
      required: true
    },
    imageName: {
      type: String,
      default: ''
    },
    clearImages: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileName: '',
      files: [],
      filesUrl: []
    }
  },
  watch: {
    clearImages (val) {
      if (val === true) {
        this.files = []
        this.filesUrl = []
        this.clearImages = false
      }
    }
  },
  methods: {
    sendPreview (event) {
      const uploadedFiles = this.$refs.files.files
      for (let i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i])
        this.filesUrl.push(URL.createObjectURL(uploadedFiles[i]))
      }
      this.$emit('preview', this.files)
    },
    removeFile (key) {
      this.files.splice(key, 1)
    }
  }
}
</script>
