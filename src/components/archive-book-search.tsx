import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";

// Define types for book and API response
interface Book {
  identifier: string;
  title: string;
  creator?: string;
  description?: string;
  date?: string;
}

interface ApiResponse {
  response: {
    docs: Book[];
  };
}

interface ArchiveBookSearchProps {
  chooseBook: any;
}

const ArchiveBookSearch: React.FC<ArchiveBookSearchProps> = ({
  chooseBook,
}) => {
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Perform search when chooseBook changes
  useEffect(() => {
    if (chooseBook && chooseBook.title) {
      handleSearch();
    }
  }, [chooseBook]);

  const handleSearch = async () => {
    if (!chooseBook) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<ApiResponse>(
        `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
          chooseBook.title
        )} AND mediatype:(texts) AND (format:(epub) OR format:(txt))&fl[]=identifier,creator,title,date,description&rows=5&page=1&output=json`
      );

      setResults(response.data.response.docs);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleBack = () => {
    setSelectedBook(null);
  };

  return (
    <div className="p-4">
      {selectedBook ? (
        <div>
          <Button onClick={handleBack} className="mb-4 bg-gray-500 text-white p-2 rounded">
            Back to List
          </Button>
          <iframe
            src={`https://archive.org/embed/${selectedBook.identifier}`}
            width="100%"
            height="600"
            className="border-0"
            allowFullScreen={true}
          ></iframe>
        </div>
      ) : (
        <div>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="mt-4 max-h-[500px] overflow-y-auto bg-white border border-gray-300 rounded">
            {results.length === 0 && !loading && !error && (
              <p className="p-2 text-gray-500">No results found</p>
            )}
            {results.map((book) => (
              <div
                key={book.identifier}
                className={`border-b last:border-b-0 p-2 flex items-start space-x-4 cursor-pointer ${
                  selectedBook?.identifier === book.identifier
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleSelectBook(book)}
              >
                <div>
                  <h2 className="text-lg font-bold">{book.title}</h2>
                  {book.creator && (
                    <p className="text-sm text-gray-600">by {book.creator}</p>
                  )}
                  {book.date && (
                    <p className="text-sm text-gray-500">
                      Published in {book.date}
                    </p>
                  )}
                  {book.description && (
                    <p className="text-sm text-gray-500">{book.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveBookSearch;
