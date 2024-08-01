import React, { useState, useRef } from "react";
import { user } from "@/services/gun";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CarouselDemo2 from "../List/List";

export function CarouselDemo() {
  const [avatar, setAvatar] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleShowChangeAvatar = () => {
    // setShowChangeAvatar(!showChangeAvatar);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
  const convertToBase64 = (image: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(image);
    });
  };


  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      convertToBase64(file).then((base64Avatar) => {
        user.get("profile").put({ avatar: base64Avatar });
        setAvatar(base64Avatar);
      });
    }
  };
  


  return (
   
    <div>
    <Avatar className="w-24 h-24 rounded-full overflow-hidden">
      <AvatarImage
        onClick={handleShowChangeAvatar}
        className="w-full h-full object-cover cursor-pointer"
        src={avatar || "https://i.pinimg.com/736x/fc/5e/88/fc5e882feca95037897d47dca287fb0e.jpg"}
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>

    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={handleAvatarUpload}
      className="hidden"
    />
    <CarouselDemo2 />
  </div>
  );
}

export default CarouselDemo;
