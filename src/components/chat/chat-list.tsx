import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader } from '../ui/card';
interface ChatListProps {
  friends: string[];
  onSelectFriend: (friend: string) => void;
}
const ChatList: React.FC<ChatListProps> = ({ friends, onSelectFriend }) => {
  return (
    <Card className="p-4 bg-gray-100 w-full">
      <CardHeader className="text-xl font-bold mb-4">Friend List</CardHeader>
      <CardContent>
        {friends.map((friend: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
          <div
            key={index}
            className="p-2 cursor-pointer hover:bg-gray-300 rounded"
            onClick={() => onSelectFriend(friend)}
          >
            {friend}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

ChatList.propTypes = {
  friends: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectFriend: PropTypes.func.isRequired,
};

export default ChatList;
