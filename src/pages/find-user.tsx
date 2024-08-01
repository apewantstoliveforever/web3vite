import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, user, sea } from "@/services/gun";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";

const FindUser: React.FC = () => {
  const [findUser, setFindUser] = useState<string>("");
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
    //get public key of user
    // user.get("favourite_images").then((data: any) => {
    //   console.log("Data:", data["_"]["#"]);
    // });
    db.get(`~@${findUser}`).once((data: any) => {
      for (const key in data["_"][">"]) {
        db.get(key)
          .get("favourite_images")
          .once((data: any) => {
            console.log("Data:", data.images);
          });
      }
    });
  };

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
    </div>
  );
};

export default FindUser;
