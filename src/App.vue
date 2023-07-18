<script setup>
  import { ref, watch } from 'vue';
  import booksData from './assets/books.json'
  import BookCard from './components/BookCard.vue';
  const books = booksData.library;
  const books_count = books.length;
  const reading_books = ref([]);

  const addToReadingBooks = (id) => {
    let book_to_add = books.filter((book) => {
      return book.book.ISBN === id;
    });

    reading_books.value.push(book_to_add);
  }

  const removeFromReadingBooks = (id) => {
    reading_books.value = reading_books.value.filter((book) => {
      return book[0].book.ISBN !== id;
    })
  }

  const isAdded = (id) => {
    return reading_books.value.some((book) => {
      return book[0].book.ISBN === id;
    })
  }

  watch(reading_books, (newVal) =>{
    console.log('newval', newVal);
  }, {deep:true});

</script>

<template>
  <main>
    <h2> {{ books_count }} libros disponibles</h2>
    <div class="available-books">
      <div
        class="book"
        v-for="book in books" 
        :key="book.book.ISBN" 
      >
        <BookCard 
          :book="book.book"
        />
        <button 
          class="add"
          v-if="!isAdded(book.book.ISBN)"
          @click="addToReadingBooks(book.book.ISBN)"
        >
          Añadir
        </button>
        <button 
          class="added"
          v-else
        >
          Añadido
        </button>
      </div>
    </div>
  </main>
  <aside>
    <div>
      <h2>Lista de lectura</h2>
      <div 
        class="reading-books"
        v-if="reading_books.length > 0"
      >
        <div
          class="book"
          v-for="book in reading_books" 
          :key="book[0].book.ISBN" 
        >
          <BookCard 
            :book="book[0].book"
          />
          <button @click="removeFromReadingBooks(book[0].book.ISBN)">
            ❌
          </button>
        </div>
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

.reading-books{
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.book{
  width: fit-content;
  display: flex;
  flex-direction: column;
}

.book .added{
  color: #999;
  cursor: auto;
}

button{
  border: none;
}

button:hover{
  border: none;
}

button:focus{
  outline: none;
}



</style>
