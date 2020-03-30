<template>
  <div class="text-center">
    <v-rating v-model="rating" />
  </div>
</template>
<script>
export default {
  data: () => ({
    rating: 0
  })
}
</script>
