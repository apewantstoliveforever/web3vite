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

  const [avatar, setAvatar] = useState<any>(null);

  useEffect(() => {
    user
      .get("profile")
      .get("avatar")
      .on((avatar: any) => {
        setAvatar(avatar);
      });
  }, []);

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
        .get("avatar")
        .on((data: any) => {
          setAvatar(data);
          // console.log(data);
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

  const handleAddFriend = async () => {
    console.log("Add friend:", findUser);
    db.get(`~@${findUser}`).on(async (userData: any) => {
      const keys = Object.keys(userData["_"][">"]);
      const key = keys[0].slice(1);
      //remove first character of key
      console.log("Key:", key);
      console.log("Username:", findUser);
      //check if friend request already sent
      db.get(`friend-requestsa12-${findUser}`).set({ from_user: username, from: key, status: "pending", is_read: false });
      console.log("Friend request sent");
    });

  };

  const AliceAddTest1 = async () => {
    // Generate keys for the participants
    const Alice = await sea.pair(); // Alice, she decides to host this collection of links
    const Bob = await sea.pair(); // Bob joins her initiative

    // Begin with a list of verified users' public keys
    const users = [Alice.pub, Bob.pub];

    // Generate a new key pair for the room
    const room = await sea.pair();

    // Authenticate with the room key pair to set it up
    db.user().auth(room, async () => {
      let enc = await sea.encrypt(room, Alice);
      db.user().get("host").get(Alice.pub).put(enc);
      users.forEach(async (pub) => {
        const cert = await sea.certify(pub, { "*": "#links", "+": "*" }, room);
        db.user().get("certs").get("links").get(pub).put(cert);
      });
    });
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
      <img src={avatar} />

      <h1 className="text-4xl font-bold mb-8">Find User</h1>
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
      <Button onClick={handleAddFriend}>Add Friend</Button>
      <Button onClick={AliceAddTest1}>Alice Add Test1</Button>

      {renderSection("images", images)}
      {renderSection("books", books)}
      {renderSection("songs", songs)}
      {renderSection("videos", videos)}
    </div>
  );
};

export default FindUser;
