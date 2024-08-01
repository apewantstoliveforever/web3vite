import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import { user, db } from "@/services/gun";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the structure of an image item
interface ImageItem {
  id: number;
  url: string;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth.username);
  const password = useSelector(
    (state: RootState) => state.auth.encryptedPassword
  );

  const [images, setImages] = useState<ImageItem[]>([
    { id: 1, url: "" },
    { id: 2, url: "" },
    { id: 3, url: "" },
    { id: 4, url: "" },
    { id: 5, url: "" },
  ]);
  const [editImageId, setEditImageId] = useState<number | null>(null);
  const [newUrl, setNewUrl] = useState<string>("");

  const fetchUserData = async () => {
    console.log("Fetching user data");
    const allImages = await user.get("favourite_images").then((data: any) => {
      if (data.images) {
        //parse and split data to get images
        console.log("Data images:", data.images);
        const images = JSON.parse(data.images);
        setImages(images);
      }
    });
  };

  useEffect(() => {
    if (user.is) {
      user.get("alias").once((data: any) => {
        // dispatch({ type: "SET_USERNAME", payload: data });
        fetchUserData();
      });
    } else if (username && password) {
      user.auth(username, password, (ack: any) => {
        if (ack.err) {
          console.error("Error logging in:", ack.err);
        } else {
          console.log("Logged in successfully");
          //   dispatch({ type: "SET_USERNAME", payload: username });
          fetchUserData();
        }
      });
    }
  }, [dispatch, username, password]);

  const handleEdit = (id: number) => {
    const image = images.find((img) => img.id === id);
    if (image) {
      setEditImageId(id);
      setNewUrl(image.url);
    }
  };

  const handleSave = () => {
    if (editImageId !== null) {
      const updatedImages = images.map((img) =>
        img.id === editImageId ? { ...img, url: newUrl } : img
      );

      setImages(updatedImages);
      //convert updatedImages to json stringtify
      const updatedImagesString = JSON.stringify(updatedImages);
      user.get("favourite_images").put({
        images: updatedImagesString,
      });
      //   db.get(`~@${username}`).get("favourite_images").put({
      //     image: updatedImagesString,
      //   });

      console.log("Updated images:", updatedImages);

      setEditImageId(null);
      setNewUrl("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Profile: {username}</h1>
      <div className="grid grid-cols-5 gap-4">
        <div>images</div>
        {images.map((image) => (
          <Card key={image.id}>
            <CardHeader>
              <img
                src={image.url || "https://via.placeholder.com/400"}
                alt={`Image ${image.id}`}
                className="w-400 h-400 object-cover"
              />
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleEdit(image.id)}>Edit Link</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {editImageId !== null && (
        <Dialog open={true} onOpenChange={() => setEditImageId(null)}>
          <DialogTrigger asChild>
            <Button>Edit Image URL</Button>
          </DialogTrigger>
          <DialogContent>
            <Input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter new image URL"
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
