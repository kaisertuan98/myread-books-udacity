import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookShelf from "../BookShelf";
import { getAll, update } from "../../BooksAPI";
import { BookType, OnShelfChangeType, OrderedBooksType } from "../types/type";

// Define a function getAllBooks that returns a Promise of type OrderedBooksType
const getAllBooks: () => Promise<OrderedBooksType> = async () => {
  // Retrieve all books as an array of BookType objects by calling the getAll() function
  const books: BookType[] = await getAll();

  // Create an orderedBooks object to store books categorized by their shelf
  const orderedBooks = {
    // Filter books that have a shelf value of "currentlyReading"
    currentlyReading: books.filter(
      (book: BookType) => book.shelf === "currentlyReading"
    ),
    // Filter books that have a shelf value of "wantToRead"
    wantToRead: books.filter((book: BookType) => book.shelf === "wantToRead"),
    // Filter books that have a shelf value of "read"
    read: books.filter((book: BookType) => book.shelf === "read"),
  };

  // Return the orderedBooks object containing the categorized books
  return orderedBooks;
};

const initialOrderedBook: OrderedBooksType = {
  wantToRead: [],
  read: [],
  currentlyReading: [],
};

const Home: () => JSX.Element = () => {
  const [orderedBooks, setOrderedBooks] =
    useState<OrderedBooksType>(initialOrderedBook);

  const updateBookCollections: () => Promise<void> = useCallback(async () => {
    // Fetch the ordered books collection using the getAllBooks function
    const ordBooks = await getAllBooks();
    // Update the state variable with the fetched books collection
    setOrderedBooks(ordBooks);
  }, []);

  useEffect(() => {
    // Fetch initial data and update the state variable when the component mounts
    updateBookCollections();
  }, [updateBookCollections]);

  const onShelfChange: OnShelfChangeType = useCallback(
    async (e, book) => {
      const value: string = e.target.value;
      await update(book, value);
      await updateBookCollections();
    },
    [updateBookCollections]
  );

  return (
    <div className="list-books">
      <div className="list-books-content">
        <div>
          <BookShelf
            title="Currently Reading"
            books={orderedBooks.currentlyReading}
            onShelfChange={onShelfChange}
          />

          <BookShelf
            title="Want to Read"
            books={orderedBooks.wantToRead}
            onShelfChange={onShelfChange}
          />

          <BookShelf
            title="Read"
            books={orderedBooks.read}
            onShelfChange={onShelfChange}
          />
        </div>
      </div>
      <div className="open-search">
        <Link to="/search">Add New </Link>
      </div>
    </div>
  );
};

export default Home;
