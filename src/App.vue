<script setup>
  import { ref, watch } from 'vue';
  import booksData from './assets/books.json'
  import BookCard from './components/BookCard.vue';
  const books = booksData.library;
  const books_count = books.length;
  const reading_books = ref([]);

  const addToReadingBooks = (id) =>{
    let book_to_add = books.filter((book) => {
      return book.book.ISBN === id;
    });

    reading_books.value.push(book_to_add);

    console.log(reading_books);
  }

  watch(reading_books, (newVal) =>{
    console.log('newval', newVal);
  }, {deep:true})

</script>

<template>
  <main>
    <h2> {{ books_count }} libros disponibles</h2>
    <div class="available-books">
      <BookCard 
        @click="addToReadingBooks(book.book.ISBN)"
        v-for="book in books" 
        :key="book.book.ISBN" 
        :book="book.book"
      />
    </div>
  </main>
  <aside>
    <div>
      <h2>Lista de lectura</h2>
      <div v-if="reading_books.length > 0">
        <BookCard 
          v-for="book in reading_books" 
          :key="book[0].book.ISBN" 
          :book="book[0].book"
        />
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
</style>
