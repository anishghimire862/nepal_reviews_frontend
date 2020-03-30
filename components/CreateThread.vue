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
                Create Thread
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
  methods: {
    submitThread () {
      const url = '/threads/'
      const self = this

      const data = {
        title: this.title,
        description: this.description,
        category: this.category
      }

      this.$axios.post(url, data)
        .then(function (response) {
          self.$emit('emitClose')
          self.$emit('refreshThreads')
          alert('Thread created.')
        })
        .catch(function (error) {
          alert(error)
        })
    }
  }
}
</script>
