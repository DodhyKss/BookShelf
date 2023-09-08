const KEY = "BOOKSHELFS";
const listBooks = [];

//mengambil nilai dari inputan dan melakuakn penambahan buku pada listBooks
function generateNewBookList() {
  listBooks.push({
    booksId: +new Date(),
    booksTitle:document.getElementById("inputBookTittle").value,
    booksAuthor:document.getElementById("inputBookAuthor").value,
    booksYear:document.getElementById("inputBookYear").value,
    isCompleteRead:checkStatusBookRead(),
  });
  document.dispatchEvent(new Event("booksChange"));
  saveDataToLocalStorage();
}

document.addEventListener("DOMContentLoaded", () => {
  const submitBooks = document.getElementById("input-form");
  submitBooks.addEventListener("submit", (e) => {
    e.preventDefault();
    generateNewBookList();
    e.target.reset();
  }); 
  if (checkWebStorage() == true) {
    const dataFromLocalStorage = localStorage.getItem(KEY);
    let dataParse = JSON.parse(dataFromLocalStorage);
    if (dataParse !== null) {
      for (const book of dataParse) {
        listBooks.push(book);
      }
    }
    document.dispatchEvent(new Event("booksChange"));
  }
});

// event untuk menambahkan buku ke rak sudah dibaca atau belum dibaca
document.addEventListener("booksChange", () => {
  const newBookList = document.getElementById("unreadBooksItems");
  newBookList.innerHTML = "";
  const readBookList = document.getElementById("readBooksItems");
  readBookList.innerHTML = "";
  for (const bookItem of listBooks) {
    const bookList = addNewElementBookList(bookItem);
    if (bookItem.isCompleteRead) {
      readBookList.append(bookList);
    } else {
      newBookList.append(bookList);
    }
  }
});

// menambahkan element pada undone completeRead book dan done completeRead book 
function addNewElementBookList(newAddBook) {
  // membuat element untuk judul buku
  const titleOfBook = document.createElement("h3");
  titleOfBook.innerText = `Book Tittle: ${newAddBook.booksTitle}`;

  // membuat element untuk penulis buku
  const authorOfBook = document.createElement("p");
  authorOfBook.innerText = `Author: ${newAddBook.booksAuthor}`;

  // membuat element untuk tahun buku
  const bookYear = document.createElement("p");
  bookYear.innerText = `Year: ${newAddBook.booksYear}`;

  // membuat element untuk data buku, judul, penulis, dan tahun
  const booksContent = document.createElement("div");
  booksContent.append(titleOfBook, authorOfBook, bookYear);

  const bookItems = document.createElement("div");
  bookItems.classList.add("items", "list-books");
  bookItems.append(booksContent);
  bookItems.setAttribute("id", `book-${newAddBook.booksId}`);

  // cek buku sudah dibaca atau belum dibaca
  if (newAddBook.isCompleteRead) {
    // undo buku belum dibaca ke sudah dibaca
    const buttonUndo = document.createElement("button");
    buttonUndo.classList.add("read-button");
    buttonUndo.innerText = "Undone";
    buttonUndo.addEventListener("click", () => {
        undoBookRead(newAddBook.booksId);
    });

    // hapus buku belum dibaca
    const buttonRemove = document.createElement("button");
    buttonRemove.classList.add("delete-button");
    buttonRemove.innerText = "Delete"
    buttonRemove.addEventListener("click", () => { 
        deleteBook(newAddBook.booksId);
    });

    bookItems.append(buttonUndo, buttonRemove);
  } else {
    //ceklis buku yang sudah dibaca untuk dipindahkan ke buku belum dibaca 
    const buttonCheckRead = document.createElement("button");
    buttonCheckRead.classList.add("unread-button");
    buttonCheckRead.innerText = "Done";
    buttonCheckRead.addEventListener("click", () => { 
        addBookRead(newAddBook.booksId);
    });

    // hapus buku sudah dibaca
    const buttonRemove = document.createElement("button");
    buttonRemove.classList.add("delete-button");
    buttonRemove.innerText = "Delete";
    buttonRemove.addEventListener("click", () => {
        deleteBook(newAddBook.booksId);
    });

    // append buttonChcekRead dan buttonRemove to bookItems
    bookItems.append(buttonCheckRead, buttonRemove);
  }
  return bookItems;
}

//fungsi memindahkan buku ke sudah dibaca
function addBookRead(id) {
  const bookTarget = findBookIdFromlistBooks(id);
  if (bookTarget == null) return;
  bookTarget.isCompleteRead = true;
  document.dispatchEvent(new Event("booksChange"));
  saveDataToLocalStorage();
}
//fungsi memindahkan buku ke belum dibaca
function undoBookRead(id) {
  const bookTarget = findBookIdFromlistBooks(id);
  if (bookTarget == null) return;
  bookTarget.isCompleteRead = false;
  document.dispatchEvent(new Event("booksChange"));
  saveDataToLocalStorage();
}
//fungsi mengapus buku
function deleteBook(id) {
  const bookTarget = filterBooksIdToDelete(id);
  if (bookTarget === -1) return;
  listBooks.splice(bookTarget, 1);
  document.dispatchEvent(new Event("booksChange"));
  saveDataToLocalStorage();
}

function filterBooksIdToDelete(id) {
  for (const i in listBooks) {
    if (listBooks[i].booksId === id) {
      return i;
    }
  }
  return -1;
}
function findBookIdFromlistBooks(id) {
  for (const items of listBooks) {
    if (items.booksId === id) {
      return items;
    }
  }
  return null;
}

//fungsi menyimpan data listBooks yang sudah diparsing ke local storage
function saveDataToLocalStorage() {
  if (checkWebStorage()) {
    const parsedData = JSON.stringify(listBooks);
    localStorage.setItem(KEY, parsedData);
    document.dispatchEvent(new Event("booksSave"));
  }
}

// cek support web storage dari browser
function checkWebStorage() {
  if (typeof Storage === undefined) {
    return false;
  }
  return true;
}

//cek apakah buku sudah dibaca atau belum dibca kembalikan nilai bool
function checkStatusBookRead(){
  var checkBook = document.getElementById("isRead").checked;
  return checkBook;
}