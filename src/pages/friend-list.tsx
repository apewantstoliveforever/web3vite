//friend-list.tsx
import { user } from "@/services/gun";
import { db } from "@/services/gun";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import { Button } from "@/components/ui/button";
const FriendList: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const username = useSelector((state: RootState) => state.auth.username);
  useEffect(() => {
    //find friend list
    if (user.is && user.is.pub) {
      console.log(user.is.pub);
      db.get(`friend-requestsa12-${username}`)
        .map()
        .on((data: any) => {
          console.log(data);
          setFriendRequests((prev) => [...prev, data]);
        });
      user
        .get("friend-list-test")
        .map()
        .on((data: any) => {
          console.log(data);
          setFriends((prev) => [...prev, data]);
        });
    }
  }, []);

  const HandleAcceptFriend = (from_user: string) => {
    user.get("friend-list-test").get(from_user).put({ from_user });
  };

  return (
    <div>
      <h1>Friend List</h1>
      {friends.map((friend: any) => (
        <div>
          <div>{friend.from_user}</div>
        </div>
      ))}
      <div>
        <h1>Friend Requests</h1>
        {friendRequests.map((request: any) => (
          <div>
            <div>{request.from_user}</div>
            <Button onClick={() => HandleAcceptFriend(request.from_user)}>
              Accept
            </Button>
            <Button>Decline</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendList;
