//TestSong page

import SongSearch from "@/components/song-search";
import React, { useState } from "react";
import ArchiveBookSearch from "@/components/archive-book-search";

const TestSong = () => {
  const [newUrl, setNewUrl] = useState<any>(null);

  return (
    <div>
      <ArchiveBookSearch setNewUrl={setNewUrl} />
      {newUrl && (
        <div>
          <h2>Selected Book</h2>
          <p>Title: {newUrl.title}</p>
          <p>Creator: {newUrl.creator}</p>
          <p>
            <a
              href={`https://archive.org/details/${newUrl.identifier}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default TestSong;
