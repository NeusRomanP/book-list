<script setup>
  import booksData from './assets/books.json'
  import BookCard from './components/BookCard.vue';
  let books = booksData.library;
  let books_count = books.length;
  let reading_books = [];
</script>

<template>
  <main>
    <h2> {{ books_count }} libros disponibles</h2>
    <div class="available-books">
      <BookCard 
        v-for="book in books" 
        :key="book.book.ISBN" 
        :book="book.book"
      />
    </div>
  </main>
  <aside>
    <div>
      <h2>Lista de lectura</h2>
      <div
        v-for="book in reading_books"
        :key="'rb-'+book.book.ISBN"
      >
        {{ book.book.title }}
      </div>
    </div>
  </aside>
</template>

<style scoped>

.available-books{
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
