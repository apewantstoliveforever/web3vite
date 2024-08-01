import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, user, sea } from "@/services/gun";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import { Card, CardHeader } from "@/components/ui/card";

interface Item {
  id: number;
  url: string;
}

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
    if (user.is) {
      user.get("alias").once((data: any) => {
        // dispatch({ type: "SET_USERNAME", payload: data });
      });
    } else if (username && password) {
      user.auth(username, password, (ack: any) => {
        if (ack.err) {
          console.error("Error logging in:", ack.err);
        } else {
          console.log("Logged in successfully");
          //   dispatch({ type: "SET_USERNAME", payload: username });
        }
      });
    }
  }, [dispatch, username, password]);

  const handleSearch = () => {
    console.log("Search user:", findUser);
    db.get(`~@${findUser}`).once((data: any) => {
      for (const key in data["_"][">"]) {
        db.get(key)
          .get("favourite_images")
          .once((data: any) => {
            console.log("Images Data:", data.images);
            if (data && data.images) {
              setImages(JSON.parse(data.images));
            }
          });

        db.get(key)
          .get("favourite_books")
          .once((data: any) => {
            console.log("Books Data:", data.books);
            if (data && data.books) {
              setBooks(JSON.parse(data.books));
            }
          });

        db.get(key)
          .get("favourite_songs")
          .once((data: any) => {
            console.log("Songs Data:", data.songs);
            if (data && data.songs) {
              setSongs(JSON.parse(data.songs));
            }
          });

        db.get(key)
          .get("favourite_videos")
          .once((data: any) => {
            console.log("Videos Data:", data.videos);
            if (data && data.videos) {
              setVideos(JSON.parse(data.videos));
            }
          });
      }
    });
  };

  const renderSection = (title: string, items: Item[]) => (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <img
                key={item.id}
                src={item.url || "https://via.placeholder.com/400"}
                alt={`${title.slice(0, -1)} ${item.id}`}
                className="w-200 h-200 object-cover"
              />
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
      {images.length > 0 && renderSection("Favorite Images", images)}
      {books.length > 0 && renderSection("Favorite Books", books)}
      {songs.length > 0 && renderSection("Favorite Songs", songs)}
      {videos.length > 0 && renderSection("Favorite Videos", videos)}
    </div>
  );
};

export default FindUser;
