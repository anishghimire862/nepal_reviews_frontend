import Vue from 'vue'

Vue.filter('truncate', function (value, limit) {
  return value.length > limit ? value.substring(0, (limit - 3)) + '...' : value
})
