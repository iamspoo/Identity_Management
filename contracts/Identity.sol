pragma solidity 0.5.16;

contract Identity {
    //event AddedCandidate(uint candidateID);

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
    
    mapping (bytes32 => User) users;

    function addUser(bytes32 username, bytes32 password) onlyOwner public {
        if (users[username].doesExist == false){
            users[username] = User(password,true);
            //emit AddedCandidate(candidateID);
        }
        else{
            revert("Username already exists");
        }
        
    }
   
    function validate(bytes32 username, bytes32 password) view public returns (bool) {
        if(users[username].password==password){
            //return true;
        }
        //return false;
		revert("User does not exist");
    }

}
