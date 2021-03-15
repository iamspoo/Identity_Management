pragma solidity 0.5.16;

contract Identity {

    address owner;
    constructor() public {
        owner=msg.sender;
    }
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    struct User {
        bytes32 password; 
        bool doesExist; 
    }
    
    struct Organisation {
        bytes32 password; 
        bool doesExist; 
    }
    
    mapping (bytes32 => User) users;
    mapping (bytes32 => Organisation) org;

    function addUser(bytes32 username, bytes32 pswd) onlyOwner public {
        if (users[username].doesExist == false){
            users[username] = User(pswd,true);
        }
        else{
            revert("Username already exists");
        }
    }
    function addOrg(bytes32 username, bytes32 pswd) onlyOwner public {
        if (org[username].doesExist == false){
            org[username] = Organisation(pswd,true);
        }
        else{
            revert("Username already exists");
        }
        
    }

    function validateUser(bytes32 username, bytes32 pswd) view public returns (bool) {
        if(users[username].password==pswd){
            return true;
        }
        return false;
    }

    function validateOrg(bytes32 username, bytes32 pswd) view public returns (bool) {
        if(org[username].password==pswd){
            return true;
        }
        return false;
    }

}
