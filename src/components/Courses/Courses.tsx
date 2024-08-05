import React, { useState, useRef, useEffect } from "react";
import { user } from "@/services/gun";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InputForm from "../Input/InputFed";
//import selector to get username from redux
import { useSelector } from "react-redux";
import { RootState } from "../../auth/store";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

export function CarouselDemo() {
  const [avatar, setAvatar] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEditStatus, setShowEditStatus] = useState(false);

  const username = useSelector((state: RootState) => state.auth.username);
  const handleShowChangeAvatar = () => {
    // setShowChangeAvatar(!showChangeAvatar);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
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

  const handleEditStatus = () => {
    setShowEditStatus(true);
  };

  useEffect(() => {
    user.get("profile").on((data: any) => {
      setAvatar(data.avatar);
      setStatus(data.status);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <div className="flex flex-row items-center w-full">
          <div className="flex justify-center items-center w-1/2 mx-auto">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300">
                <AvatarImage
                  onClick={handleShowChangeAvatar}
                  className="w-full h-full object-cover cursor-pointer"
                  src={avatar || "/profile_default.png"}
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
              <Button onClick={handleEditStatus} className="mt-2">
                <Pencil />
              </Button>
            </div>
          </div>
          {status && (
            <Card className="shadow-none border-none p-4 bg-gray-100 rounded-lg w-1/2">
              {status}
            </Card>
          )}
        </div>
        {showEditStatus && <InputForm setShowEditStatus={setShowEditStatus} />}
      </div>
    </div>
  );
}

export default CarouselDemo;
