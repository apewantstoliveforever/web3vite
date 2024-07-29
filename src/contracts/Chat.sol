// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    Message[] public messages;

    function sendMessage(string memory _content) public {
        messages.push(Message({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp
        }));
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }
}
