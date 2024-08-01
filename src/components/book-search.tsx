import React, { useState } from "react";
import axios from "axios";

// Define types for book and API response
interface Book {
  key: string;
  title: string;
  cover_i?: number;
  author_name?: string[];
  first_publish_year?: number;
}

interface ApiResponse {
  docs: Book[];
}
interface BookSearchProps {
  setNewUrl: (url: any) => void;
}

const BookSearch: React.FC<BookSearchProps> = ({ setNewUrl }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<ApiResponse>(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          query
        )}&fields=*,availability&limit=5`
      );

      setResults(response.data.docs);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (book: Book) => {
    console.log("Selected book:", book.title);
    console.log("Selected book:", book.author_name);
    console.log("Selected book:", book.cover_i);
    const bookObject = {
      title: book.title,
      book: book.author_name,
      cover: book.cover_i,
    };
    setNewUrl(bookObject);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books"
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4 max-h-[500px] overflow-y-auto bg-white border border-gray-300 rounded">
        {results.length === 0 && !loading && !error && (
          <p className="p-2 text-gray-500">No results found</p>
        )}
        {results.map((book) => (
          <div
            key={book.key}
            className="border-b last:border-b-0 p-2 flex items-start space-x-4 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelectBook(book)}
          >
            {book.cover_i && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="w-16 h-24 object-cover"
              />
            )}
            <div>
              <h2 className="text-lg font-bold">{book.title}</h2>
              {book.author_name && (
                <p className="text-sm text-gray-600">
                  by {book.author_name.join(", ")}
                </p>
              )}
              {book.first_publish_year && (
                <p className="text-sm text-gray-500">
                  First published in {book.first_publish_year}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSearch;
