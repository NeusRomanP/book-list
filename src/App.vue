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

  const current_genre = ref('Todos');

  onBeforeMount(() => {
    reading_books.value = JSON.parse(localStorage.getItem('reading-books')) ?? reading_books.value;
    books_count.value = books.value.length - reading_books.value.length;
  });

  const filterByName = (e) => {
    const name = document.getElementById('name').value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if(e){
      filterByGenre();
    }

    books.value = books.value.filter((book)=> {
      return book.book.title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .includes(name);
    })

  }

  const getNewCounter = () => {

    let filtered_books_ISBN = books.value.map((book) => {
      return book.book.ISBN;
    })

    let reading_books_filtered = reading_books.value.filter((book) => {
      if (!filtered_books_ISBN.includes(book[0].book.ISBN)) return false;
      return ((book[0].book.genre === current_genre.value || current_genre.value === 'Todos') &&
        book[0].book.title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .includes(name));
    })
    
    return books.value.length - reading_books_filtered.length;
  }

  const filterByGenre = (e) => {
    current_genre.value = document.getElementById('genre').value;

    if (current_genre.value === 'Todos') {
      books.value = booksData.library;
    }else{
      books.value = booksData.library.filter((book) => {
        return book.book.genre === current_genre.value;
      })
    }

    if(e){
      filterByName();
    }
  }

  const addToReadingBooks = (id) => {
    let book_to_add = books.value.filter((book) => {
      return book.book.ISBN === id;
    });

    reading_books.value.push(book_to_add);

    books_count.value = books.value.length - reading_books.value.length;

    books_count.value = getNewCounter();
  }

  const removeFromReadingBooks = (id) => {
    reading_books.value = reading_books.value.filter((book) => {
      return book[0].book.ISBN !== id;
    });

    books_count.value = books.value.length - reading_books.value.length;
  }

  const isAdded = (id) => {
    return reading_books.value.some((book) => {
      return book[0].book.ISBN === id;
    })
  }

  watch(reading_books, (newVal) =>{
    localStorage.setItem('reading-books', JSON.stringify(newVal));

    books_count.value = getNewCounter();
  }, {deep:true});

  watch(books, () =>{
    books_count.value = getNewCounter();
  }, {deep:true});

  watch(current_genre, () =>{
    books_count.value = getNewCounter();
    
  }, {deep:true});

  

  window.addEventListener('storage', () =>{
    reading_books.value = JSON.parse(localStorage.getItem('reading-books')) ?? reading_books.value;
  });

</script>

<template>
  <div class="books-wrapper">
    <main class="main">
      <header class="header">
        <form 
          class="flex-column gap-10"
          @submit.prevent="(e) => { e.preventDefault(); }"
        >
          <div>
            <label for="genre">Genero: </label>
            <select 
              name="genre" 
              id="genre" 
              @change="filterByGenre"
            >
              <option value="Todos">
                Todos
              </option>
              <option 
                v-for="(genre, index) in genres" 
                :key="'g-' + (index + 1)" 
                :value="genre"
              >
                {{ genre }}
              </option>
            </select>
          </div>
          <input
            class="search-title-input"
            type="text"
            id="name"
            placeholder="Buscar por título"
            @input="filterByName"
          >
        </form>
        <h2> {{ books_count }} libros disponibles</h2>
        <h3>{{ reading_books.length }} libros en la lista de lectura</h3>
      </header>
      <section class="available-books">
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
      </section>
    </main>
    <div class="aside-wrapper">
      <aside class="aside">
        <div>
          <h2>Lista de lectura</h2>
          <section class=" scroll reading-books-scroll">
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
          </section>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>

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
