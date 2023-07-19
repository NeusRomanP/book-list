<script setup>
  import { onBeforeMount, ref, watch } from 'vue';
  import booksData from './assets/books.json'
  import BookCard from './components/BookCard.vue';
  const books = ref(booksData.library);
  const books_count = ref(books.value.length);
  const reading_books = ref([]);
  const genres = Array.from(new Set(booksData.library.map((book) => {
    return book.book.genre;
  })));

  onBeforeMount(() => {
    reading_books.value = JSON.parse(localStorage.getItem('reading-books')) ?? reading_books.value;
  });

  const filterByGenre = () => {
    const genre = document.getElementById('genre').value;
    if (genre === 'Todos') {
      books.value = booksData.library;
    }else{
      books.value = booksData.library.filter((book) => {
        return book.book.genre === genre;
      })
    }
  }

  const addToReadingBooks = (id) => {
    let book_to_add = books.value.filter((book) => {
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
    localStorage.setItem('reading-books', JSON.stringify(newVal));
    const genre = document.getElementById('genre').value;
    if(genre === 'Todos'){
      books_count.value = books.value.length - reading_books.value.length;
    }else{
      let genre_reading_books = reading_books.value.filter((book) => {
        return book[0].book.genre === genre;
      })
      books_count.value = books.value.length - genre_reading_books.length;
    }
  }, {deep:true});

  watch(books, () =>{
    const genre = document.getElementById('genre').value;
    if(genre === 'Todos'){
      books_count.value = books.value.length - reading_books.value.length;
    }else{
      let genre_reading_books = reading_books.value.filter((book) => {
        return book[0].book.genre === genre;
      })
      books_count.value = books.value.length - genre_reading_books.length;
    }
    
  }, {deep:true});

  window.addEventListener('storage', () =>{
    reading_books.value = JSON.parse(localStorage.getItem('reading-books')) ?? reading_books.value;
  });

</script>

<template>
  <div>
    <select 
      name="genre" 
      id="genre" 
      @change="filterByGenre"
    >
      <option value="Todos">Todos</option>
      <option 
        v-for="(genre, index) in genres" 
        :key="'g-'+(index + 1)" 
        :value="genre"
      >
        {{ genre }}
      </option>
    </select>
  </div>
  <main>
    <h2> {{ books_count }} libros disponibles</h2>
    <h3>{{ reading_books.length }} libros en la lista de lectura</h3>
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
