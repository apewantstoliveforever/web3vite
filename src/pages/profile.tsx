import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import { user } from "@/services/gun";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { throttle } from "lodash";
import ReactPlayer from "react-player";
import { Document, Page } from 'react-pdf';
import EPUBJS from 'epubjs';

interface Item {
  id: number;
  url: string;
  audioUrl?: string;
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

const updateData = (type: string, items: Item[]) => {
  user.get("favourites").put({ [type]: JSON.stringify(items) });
};

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth.username);
  const password = useSelector(
    (state: RootState) => state.auth.encryptedPassword
  );

  const [images, setImages] = useState<Item[]>(
    Array.from({ length: 5 }, (_, id) => ({ id, url: "" }))
  );
  const [books, setBooks] = useState<Item[]>(
    Array.from({ length: 5 }, (_, id) => ({ id, url: "" }))
  );
  const [songs, setSongs] = useState<Item[]>(
    Array.from({ length: 5 }, (_, id) => ({ id, url: "" }))
  );
  const [videos, setVideos] = useState<Item[]>(
    Array.from({ length: 5 }, (_, id) => ({ id, url: "" }))
  );
  const [editItem, setEditItem] = useState<{ type: string; id: number } | null>(
    null
  );
  const [newUrl, setNewUrl] = useState<string>("");

  const fetchUserData = () => {
    user.get("favourites").on(
      throttle((data: any) => {
        console.log("Favourites Data:", data);
        if (data) {
          setImages(
            data.images
              ? JSON.parse(data.images)
              : Array.from({ length: 5 }, (_, id) => ({ id, url: "" }))
          );
          setBooks(
            data.books
              ? JSON.parse(data.books)
              : Array.from({ length: 5 }, (_, id) => ({ id, url: "" }))
          );
          setSongs(
            data.songs
              ? JSON.parse(data.songs)
              : Array.from({ length: 5 }, (_, id) => ({
                  id,
                  url: "",
                  audioUrl: "",
                }))
          );
          setVideos(
            data.videos
              ? JSON.parse(data.videos)
              : Array.from({ length: 5 }, (_, id) => ({ id, url: "" }))
          );
        }
      }, 1000)
    );
    // Throttle updates to once per second
  };

  useEffect(() => {
    if (user.is) {
      user.get("alias").once(() => {
        fetchUserData();
      });
    } else if (username && password) {
      user.auth(username, password, (ack: any) => {
        if (ack.err) {
          console.error("Error logging in:", ack.err);
        } else {
          console.log("Logged in successfully");
          fetchUserData();
        }
      });
    }
  }, [dispatch, username, password]);

  const handleEdit = (type: string, id: number) => {
    const item = {
      images,
      books,
      songs,
      videos,
    }[type]?.find((item) => item.id === id);

    if (item) {
      setEditItem({ type, id });
      setNewUrl(item.url);
    }
  };

  const handleSave = () => {
    if (editItem) {
      const { type, id } = editItem;
      const setItems = {
        images: setImages,
        books: setBooks,
        songs: setSongs,
        videos: setVideos,
      }[type];

      const items =
        {
          images,
          books,
          songs,
          videos,
        }[type] || [];

      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, url: newUrl } : item
      );

      if (setItems) {
        setItems(updatedItems);
        updateData(type, updatedItems);
      }

      setEditItem(null);
      setNewUrl("");
    }
  };

  const renderSection = (type: string, items: Item[]) => (
    <div>
      <div className="text-xl font-semibold mb-4">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
      <div className="grid grid-cols-5 gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              {type === "songs" && item.url ? (
                <AudioPlayer url={item.url} />
              ) : type === "books" && item.url ? (
                <>
                  {item.url && (
                    <Document file={item.url}>
                      <Page pageNumber={1} width={200} />
                    </Document>
                  )}
                  {item.url && (
                    <div>
                      <img
                        src={`https://covers.openlibrary.org/b/id/${item.id}-L.jpg`} // Placeholder, adjust as needed
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
            <CardContent>
              <Button onClick={() => handleEdit(type, item.id)}>
                Edit Link
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Profile: {username}</h1>
      {renderSection("images", images)}
      {renderSection("books", books)}
      {renderSection("songs", songs)}
      {renderSection("videos", videos)}

      {editItem && (
        <Dialog open={true} onOpenChange={() => setEditItem(null)}>
          <DialogTrigger asChild>
            <Button>Edit {editItem.type.slice(0, -1)} URL</Button>
          </DialogTrigger>
          <DialogContent>
            <Input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder={`Enter new ${editItem.type.slice(0, -1)} URL`}
            />
            <Button onClick={handleSave} className="mt-2">
              Save
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Profile;
