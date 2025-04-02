// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PasswordVault {
    struct PasswordEntry {
        string encryptedPassword;
        address owner;
        mapping(address => bool) sharedWith;
    }

    mapping(bytes32 => PasswordEntry) private passwords;

    event PasswordStored(bytes32 indexed id, address indexed owner);
    event PasswordShared(bytes32 indexed id, address indexed sharedWith);

    function storePassword(bytes32 _id, string memory _encryptedPassword) external {
        require(passwords[_id].owner == address(0), "Password already exists");

        passwords[_id].encryptedPassword = _encryptedPassword;
        passwords[_id].owner = msg.sender;

        emit PasswordStored(_id, msg.sender);
    }

    function sharePassword(bytes32 _id, address _user) external {
        require(passwords[_id].owner == msg.sender, "Not the owner");
        passwords[_id].sharedWith[_user] = true;

        emit PasswordShared(_id, _user);
    }

    function getPassword(bytes32 _id) external view returns (string memory) {
        require(
            passwords[_id].owner == msg.sender || passwords[_id].sharedWith[msg.sender],
            "Access denied"
        );
        return passwords[_id].encryptedPassword;
    }
}
