import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import { Card, CardHeader } from "@/components/ui/card";
import { user } from "@/services/gun";
import ReactPlayer from "react-player";
import { Document, Page } from 'react-pdf';
import EPUBJS from 'epubjs';

import { fetchUserFavorites } from "@/services/get-user-data.service";

interface Item {
  id: number;
  url: any;
}
interface AudioPlayerProps {
  url: string;
}
const AudioPlayer: React.FC<AudioPlayerProps> = ({ url }) => {
  const isVideoUrl = ReactPlayer.canPlay(url) && !url.endsWith(".mp3");

  return (
    <ReactPlayer
      url={url}
      playing={false}
      controls={true}
      width="100%"
      height={isVideoUrl ? "200px" : "50px"}
      config={{
        file: {
          forceAudio: true, // Always render an <audio> element
          attributes: {
            poster: isVideoUrl ? "https://via.placeholder.com/400" : undefined, // Placeholder for video thumbnail
          },
        },
      }}
    />
  );
};

const VideoPlayer: React.FC<{ url: string }> = ({ url }) => (
  <ReactPlayer
    url={url}
    playing={false}
    controls={true}
    width="100%"
    height="200px"
  />
);

const FindUser: React.FC = () => {
  const [findUser, setFindUser] = useState<string>("");
  const [images, setImages] = useState<Item[]>([]);
  const [books, setBooks] = useState<Item[]>([]);
  const [songs, setSongs] = useState<Item[]>([]);
  const [videos, setVideos] = useState<Item[]>([]);

  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth.username);
  const password = useSelector(
    (state: RootState) => state.auth.encryptedPassword
  );

  useEffect(() => {
    if (username && password) {
      user.auth(username, password, async (ack: any) => {
        if (ack.err) {
          console.error("Error logging in:", ack.err);
        } else {
          console.log("Logged in successfully");
          //   dispatch({ type: "SET_USERNAME", payload: username });
        }
      });
    }
  }, [username, password]);

  const handleSearch = async () => {
    try {
      console.log("Find user:", findUser);
      const data = await fetchUserFavorites(findUser);
      if (data) {
        setImages(data.images ? JSON.parse(data.images) : Array.from({ length: 5 }, (_, id) => ({ id, url: "" })));
        setBooks(data.books ? JSON.parse(data.books) : Array.from({ length: 5 }, (_, id) => ({ id, url: "" })));
        setSongs(data.songs ? JSON.parse(data.songs) : Array.from({ length: 5 }, (_, id) => ({ id, url: "" })));
        setVideos(data.videos ? JSON.parse(data.videos) : Array.from({ length: 5 }, (_, id) => ({ id, url: "" })));
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error);
    }
  };

  const renderSection = (type: string, items: Item[]) => (
    <div>
      <div className="text-xl font-semibold mb-4">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>      <div className="grid grid-cols-5 gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              {type === "songs" && item.url ? (
                <AudioPlayer url={item.url} />
              ) : type === "books" && item.url ? (
                <>
                  {item.url && (
                    <div>
                      <img
                        src={`https://covers.openlibrary.org/b/id/${item.url.cover}-M.jpg`}
                        alt={`Book cover ${item.id}`}
                        className="w-200 h-200 object-cover"
                      />
                    </div>
                  )}
                </>
              ) : type === "videos" && item.url ? (
                <VideoPlayer url={item.url} />
              ) : (
                <img
                  src={item.url || "https://via.placeholder.com/400"}
                  alt={`${type.slice(0, -1)} ${item.id}`}
                  className="w-200 h-200 object-cover"
                />
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Find User</h1>
      <div className="mb-4">
        <Input
          type="text"
          value={findUser}
          onChange={(e) => setFindUser(e.target.value)}
          placeholder="Search user"
          className="mr-2"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {renderSection("images", images)}
      {renderSection("books", books)}
      {renderSection("songs", songs)}
      {renderSection("videos", videos)}
    </div>
  );
};

export default FindUser;
