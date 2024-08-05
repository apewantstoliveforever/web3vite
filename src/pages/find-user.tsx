import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import { Card, CardHeader } from "@/components/ui/card";
import { user } from "@/services/gun";
import ReactPlayer from "react-player";
import { Document, Page } from "react-pdf";
import EPUBJS from "epubjs";

import { fetchUserFavorites } from "@/services/get-user-data.service";
import { db, sea } from "@/services/gun";
import iris from "iris-lib";
import { v4 as uuidv4 } from "uuid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ArchiveBookSearch from "@/components/archive-book-search";

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

  const [status, setStatus] = useState<string>("");
  const [avatar, setAvatar] = useState<any>(null);
  const [chooseBook, setChooseBook] = useState<any>(null);
  const [isDialogBookOpen, setIsDialogBookOpen] = useState<boolean>(false);

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

  const handleNewFindUser = async (user_find: string) => {
    db.get(`~@${findUser}`).off();
    setFindUser(user_find);
  };

  const handleSearch = async () => {
    //off the on last findUser
    // db.get(`~@${findUser}`).off();
    // console.log("Find user:", findUser);

    db.get(`~@${findUser}`).on((userData: any) => {
      const keys = Object.keys(userData["_"][">"]);
      const key = keys[0];
      db.get(key)
        .get("profile")
        .on((data: any) => {
          setAvatar(data.avatar);
          setStatus(data.status);
        });

      db.get(key)
        .get("favourites")
        .on((data: any) => {
          const result = {
            images: "",
            books: "",
            songs: "",
            videos: "",
          };
          if (data) {
            result.images = data.images || "";
            result.books = data.books || "";
            result.songs = data.songs || "";
            result.videos = data.videos || "";

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
                : Array.from({ length: 5 }, (_, id) => ({ id, url: "" }))
            );
            setVideos(
              data.videos
                ? JSON.parse(data.videos)
                : Array.from({ length: 5 }, (_, id) => ({ id, url: "" }))
            );
          }
        });
    });
  };

  useEffect(() => {
    return () => {
      // console.log("Find user:", findUser);
      db.get(`~@${findUser}`).off();
    };
  }, [findUser]);


  const handleChooseBook = (book: any) => {
    setChooseBook(book);
    setIsDialogBookOpen(true);
  };

  const renderSection = (type: string, items: Item[]) => (
    <div>
      <div className="text-xl font-semibold mb-4">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>{" "}
      <div className="grid grid-cols-5 gap-4">
        {items.map((item) => (
          <Card key={item.id}>
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
    <div className="w-full flex flex-col md:flex-row overflow-scroll">
      <div className="w-full md:w-3/12 flex items-center justify-center overflow-scroll hide-scrollbar">
        {avatar && (
          <Avatar className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300">
            <AvatarImage
              className="w-full h-full object-cover cursor-pointer"
              src={avatar || "/profile_default.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
        {status && <Card>{status}</Card>}
        <div className="mb-4">
          <Input
            type="text"
            value={findUser}
            onChange={(e) => handleNewFindUser(e.target.value)}
            placeholder="Search user"
            className="mr-2"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
      <div className="w-full md:w-9/12 flex items-center justify-center overflow-scroll hide-scrollbar">
        <div className="container mx-auto p-4 w-full">
          {renderSection("images", images)}
          {renderSection("books", books)}
          {renderSection("songs", songs)}
          {renderSection("videos", videos)}
        </div>
      </div>
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
    </div>
  );
};

export default FindUser;
