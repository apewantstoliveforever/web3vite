import React, { useState } from 'react';
import axios from 'axios';

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

const BookSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<ApiResponse>(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      setResults(response.data.docs);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
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

      <div className="mt-4">
        {results.map((book) => (
          <div key={book.key} className="border p-2 mb-2 rounded">
            {book.cover_i && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="w-24 h-32 object-cover"
              />
            )}
            <h2 className="text-lg font-bold">{book.title}</h2>
            {book.author_name && <p>by {book.author_name.join(', ')}</p>}
            {book.first_publish_year && <p>First published in {book.first_publish_year}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSearch;
