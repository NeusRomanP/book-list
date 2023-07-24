<script setup>
  import { onBeforeMount, onMounted, ref, watch } from 'vue';
  import booksData from './assets/books.json'
  import BookCard from './components/BookCard.vue';
  const books = ref(booksData.library);
  const booksCount = ref(books.value.length);
  const readingBooks = ref([]);
  const pagesNum = ref(0);
  const genres = Array.from(new Set(booksData.library.map((book) => {
    return book.book.genre;
  })));

  const currentGenre = ref('Todos');
  const draggedBook = ref(null);

  const avoidScroll = (e) => {
    e.scroll= false;
  }

  const handleDragStart = (index) => {
    draggedBook.value = index;
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleDragEnd = () => {
    draggedBook.value = null;
  }

  const handleDrop = (index) => {
    const droppedBook = readingBooks.value.splice(draggedBook.value, 1)[0];
    readingBooks.value.splice(index, 0, droppedBook);
    draggedBook.value = null;
  }

  onBeforeMount(() => {
    readingBooks.value = JSON.parse(localStorage.getItem('reading-books')) ?? readingBooks.value;
    booksCount.value = books.value.length - readingBooks.value.length;
  });

  onMounted(() => {
    pagesNum.value = parseInt(document.getElementById('pages').value);
  });

  const filterByName = (e) => {
    const name = document.getElementById('name').value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if(e){
      filterByGenre();
      filterByPages();
    }

    books.value = books.value.filter((book)=> {
      return book.book.title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .includes(name);
    })

  }

  const getNewCounter = () => {

    let filteredBooksISBN = books.value.map((book) => {
      return book.book.ISBN;
    })

    let readingBooksFiltered = readingBooks.value.filter((book) => {
      if (!filteredBooksISBN.includes(book[0].book.ISBN)) return false;
      return ((book[0].book.genre === currentGenre.value || currentGenre.value === 'Todos') &&
        book[0].book.title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .includes(name));
    })
    
    return books.value.length - readingBooksFiltered.length;
  }

  const filterByPages = (e) => {
    pagesNum.value = parseInt(document.getElementById('pages').value);

    if(e){
      filterByGenre();
    }
    
    books.value = books.value.filter((book) => {
      return book.book.pages >= pagesNum.value;
    });
  }

  const filterByGenre = (e) => {
    currentGenre.value = document.getElementById('genre').value;

    if (currentGenre.value === 'Todos') {
      books.value = booksData.library;
    }else{
      books.value = booksData.library.filter((book) => {
        return book.book.genre === currentGenre.value;
      })
    }

    if(e){
      filterByName();
      filterByPages();
    }
  }

  const addToReadingBooks = (id) => {
    let bookToAdd = books.value.filter((book) => {
      return book.book.ISBN === id;
    });

    readingBooks.value.push(bookToAdd);

    booksCount.value = books.value.length - readingBooks.value.length;

    booksCount.value = getNewCounter();
  }

  const removeFromReadingBooks = (id) => {
    readingBooks.value = readingBooks.value.filter((book) => {
      return book[0].book.ISBN !== id;
    });

    booksCount.value = books.value.length - readingBooks.value.length;
  }

  const isAdded = (id) => {
    return readingBooks.value.some((book) => {
      return book[0].book.ISBN === id;
    })
  }

  watch(readingBooks, (newVal) =>{
    localStorage.setItem('reading-books', JSON.stringify(newVal));

    booksCount.value = getNewCounter();
  }, {deep:true});

  watch(books, () =>{
    booksCount.value = getNewCounter();
  }, {deep:true});

  watch(currentGenre, () =>{
    booksCount.value = getNewCounter();
    
  }, {deep:true});

  watch(pagesNum, () => {
    booksCount.value = getNewCounter();
  });

  window.addEventListener('storage', () =>{
    readingBooks.value = JSON.parse(localStorage.getItem('reading-books')) ?? readingBooks.value;
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
            <label
              for="genre"
              class="genre-label"
            >Genero: </label>
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
          <label for="pages">Filtrar por número de páginas</label>
          <span>({{ pagesNum }})</span>
          <input
            class="pages-num-input"
            name="pages"
            id="pages"
            type="range"
            min="0"
            max="1500"
            step="10"
            value="0"
            @change="filterByPages"
          >
        </form>
        <h2> {{ booksCount }} libros disponibles</h2>
        <h3>{{ readingBooks.length }} libros en la lista de lectura</h3>
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
              v-if="readingBooks.length > 0"
            >
              <div
                class="book"
                v-for="(book, index) in readingBooks" 
                :key="book[0].book.ISBN" 
                :draggable="true"
                @touchstart="avoidScroll"
                @dragstart="handleDragStart(index)"
                @dragover="handleDragOver"
                @drop="handleDrop(index)"
                @dragend="handleDragEnd"
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
  border-radius: 0 0 5px 5px;
}

button:hover{
  border: none;
}

button:focus{
  outline: none;
}

</style>
