<script setup>

defineProps({
  book: Object,
});

</script>

<template>
  <img 
    class="cover" 
    :src="book.cover" 
    :alt="book.title"
  >
</template>

<style scoped>
.cover{
  object-fit: cover;
  width: 200px;
  aspect-ratio: 2/3;
}

</style>
