import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import { user } from "@/services/gun";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";
import { Document, Page } from "react-pdf";
import EPUBJS from "epubjs";
import BookSearch from "@/components/book-search";
import ArchiveBookSearch from "@/components/archive-book-search";
import { Book, Video, Image, Music } from "lucide-react";

interface Item {
  id: number;
  url: any;
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
      height={isVideoUrl ? "150px" : "40px"} // Adjusted for mobile view
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
    height="150px" // Adjusted for mobile view
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

  const [chooseBook, setChooseBook] = useState<any>(null);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isDialogBookOpen, setIsDialogBookOpen] = useState<boolean>(false);

  const fetchUserData = () => {
    user.get("favourites").on((data: any) => {
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
    });
  };

  useEffect(() => {
    if (user.is) {
      fetchUserData();
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

  const handleChooseBook = (book: any) => {
    setChooseBook(book);
    setIsDialogBookOpen(true);
  };

  const renderSection = (type: string, items: Item[]) => (
    <div className="mb-2">
      <div className="text-xl font-semibold mb-2">
        <div className="flex items-center mb-2 space-x-2">
          {type === "images" && <Image className="w-6 h-6" />}
          {type === "books" && <Book className="w-6 h-6" />}
          {type === "songs" && <Music className="w-6 h-6" />}
          {type === "videos" && <Video className="w-6 h-6" />}
          <span className="text-xl font-semibold capitalize">{type}</span>
        </div>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar">
        {items.map((item) => (
          <Card key={item.id} className="w-40 sm:w-60 flex-shrink-0 relative mr-4">
            <CardHeader>
              {type === "songs" && item.url ? (
                <AudioPlayer url={item.url} />
              ) : type === "books" && item.url ? (
                <>
                  {item.url && (
                    <div onClick={() => handleChooseBook(item.url)}>
                      <img
                        src={`https://covers.openlibrary.org/b/id/${item.url.cover}-M.jpg`}
                        alt={`Book cover ${item.id}`}
                        className="w-full h-32 sm:h-40 object-cover"
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
                  className="w-full h-32 sm:h-40 object-cover"
                />
              )}
            </CardHeader>
            <CardContent>
              <Button
                className="absolute bottom-2 right-2 w-8 h-8 p-1"
                onClick={() => handleEdit(type, item.id)}
              >
                <UploadOutlined className="text-sm" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-2 w-full">
      {renderSection("images", images)}
      {renderSection("books", books)}
      {renderSection("songs", songs)}
      {renderSection("videos", videos)}

      {chooseBook && (
        <Dialog
          open={isDialogBookOpen}
          onOpenChange={() => setIsDialogBookOpen(false)}
        >
          <DialogContent className="bg-white p-8 rounded-xl shadow-2xl max-w-5xl mx-auto">
            <ArchiveBookSearch chooseBook={chooseBook} />
          </DialogContent>
        </Dialog>
      )}

      {editItem && (
        <Dialog open={true} onOpenChange={() => setEditItem(null)}>
          <DialogTrigger asChild>
            <Button>Edit {editItem.type.slice(0, -1)} URL</Button>
          </DialogTrigger>
          <DialogContent>
            {editItem.type === "books" && <BookSearch setNewUrl={setNewUrl} />}
            {editItem.type !== "books" && (
              <Input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={`Enter new ${editItem.type.slice(0, -1)} URL`}
              />
            )}
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
