import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import { user } from "@/services/gun";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Item {
  id: number;
  url: string;
}

const fetchData = async (type: string, setter: (data: Item[]) => void) => {
  user.get("favourites").on((data: any) => {
    console.log("Favourites Data:", data);
    if (data && data[type]) {
      setter(JSON.parse(data[type]));
    } else {
      // If no data, initialize with 5 placeholders
      setter(Array.from({ length: 5 }, (_, id) => ({ id, url: "" })));
    }
  });
};

const updateData = (type: string, items: Item[]) => {
  user.get("favourites").put({ [type]: JSON.stringify(items) });
};

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth.username);
  const password = useSelector(
    (state: RootState) => state.auth.encryptedPassword
  );

  const [images, setImages] = useState<Item[]>([]);
  const [books, setBooks] = useState<Item[]>([]);
  const [songs, setSongs] = useState<Item[]>([]);
  const [videos, setVideos] = useState<Item[]>([]);
  const [editItem, setEditItem] = useState<{ type: string; id: number } | null>(
    null
  );
  const [newUrl, setNewUrl] = useState<string>("");

  const fetchUserData = () => {
    fetchData("images", setImages);
    fetchData("books", setBooks);
    fetchData("songs", setSongs);
    fetchData("videos", setVideos);
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

      const items = {
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
      <div className="text-xl font-semibold mb-4">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
      <div className="grid grid-cols-5 gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <img
                src={item.url || "https://via.placeholder.com/400"}
                alt={`${type.slice(0, -1)} ${item.id}`}
                className="w-200 h-200 object-cover"
              />
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleEdit(type, item.id)}>Edit Link</Button>
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
