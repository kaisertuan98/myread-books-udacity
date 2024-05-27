import { ChangeEvent, ReactNode } from "react";
import { BookPropsTypes } from "../types/type";

const Book: (
  props: BookPropsTypes & { children?: ReactNode }
) => JSX.Element = (props: BookPropsTypes & { children?: ReactNode }) => {
  const { book, onShelfChange, index } = props;

  const { shelf, imageLinks, title, authors } = book;

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 193,
            backgroundImage: `url("${
              imageLinks && imageLinks.smallThumbnail
            }")`,
          }}
        ></div>
        <div className="book-shelf-changer">
          <select
            value={shelf || "none"}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onShelfChange(e, book, index)
            }
          >
            <option value="move" disabled>
              Move to...
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{title}</div>
      {authors &&
        authors.map((author) => (
          <div className="book-authors" key={author}>
            {author}
          </div>
        ))}
    </div>
  );
};

export default Book;
