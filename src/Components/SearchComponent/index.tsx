import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAll, search, update } from "../../BooksAPI";
import Book from "../BookComponent";
import {
  BookType,
  OnShelfChangeType,
  SearchResultType,
  ShelfType,
} from "../types/type";

const updateResultSearch: (result: BookType[]) => Promise<BookType[]> = async (
  result
) => {
  let updated: BookType[] = result;
  // Fetch the user's book collection
  const shelves = await getAll();
  shelves.forEach((book: BookType, index: number) => {
    result.forEach((rowBook: BookType, index2: number) => {
      if (rowBook.id === book.id) updated[index2] = shelves[index];
    });
  });
  // Return the updated search result
  return updated;
};

const Search: () => JSX.Element = () => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<BookType[]>([]);

  useEffect(() => {
    // Get search results whenever user enter new search term
    let didCancel = false;

    const getSearchResults = async (query: string) => {
      if (query) {
        const result: SearchResultType = await search(query);
        if (!didCancel) {
          if (Array.isArray(result)) {
            let updated = await updateResultSearch(result);
            setResult(updated);
            return;
          }
          setResult([]);
        }
      } else {
        setResult([]);
      }
    };
    getSearchResults(query);
    return () => {
      didCancel = true;
    };
  }, [query]);

  const onUserInput: (e: ChangeEvent<HTMLInputElement>) => Promise<void> =
    useCallback(async (e) => {
      // Update the query state variable with the current input value
      setQuery(e.target.value || "");
    }, []);

  const onShelfChange: OnShelfChangeType = useCallback(
    async (e, book, index) => {
      // Get the new shelf value from the event target
      const value: "currentlyReading" | "read" | "wantToRead" | "none" = e
        .target.value as ShelfType;

      // Update the book's shelf value in the back-end
      await update(book, value);
      if (index !== undefined) {
        setResult((prevResult: BookType[]) => {
          const updatedResult: BookType[] = [...prevResult];
          updatedResult[index].shelf = value;
          return updatedResult;
        });
      }
    },
    []
  );

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title or author"
            onChange={onUserInput}
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {result && result.length > 0 ? (
            result.map((book: BookType, index: number) => {
              return (
                <Book
                  key={book.id}
                  book={book}
                  onShelfChange={onShelfChange}
                  index={index}
                />
              );
            })
          ) : (
            <>
              <h1>
                No search result! What about searching for one of the following
                terms?
              </h1>
              <div className="break"></div>
            </>
          )}
        </ol>
      </div>
      <div className="open-search">
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default Search;
