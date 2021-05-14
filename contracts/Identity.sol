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
		bytes32 imghash;
		bytes32 key;
		bytes32[] orgarr;
        bytes32[] response;
    }
    
    struct Organisation {
        bytes32 password; 
        bool doesExist; 
		bytes32[] userarr;
        bytes32[] status;
        bytes32[] userhash;
    }
    
    mapping (bytes32 => User) users;
    mapping (bytes32 => Organisation) org;

    function addUser(bytes32 username, bytes32 pswd) onlyOwner public {
        if (users[username].doesExist == false){

            users[username] = User(pswd,true,"","",new bytes32[](0),new bytes32[](0));
        }
        else{
            revert("Username already exists");
        }
    }
    function addOrg(bytes32 username, bytes32 pswd) onlyOwner public {
        if (org[username].doesExist == false){
            org[username] = Organisation(pswd,true,new bytes32[](0),new bytes32[](0),new bytes32[](0));
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
	
    function storeimghash(bytes32 hash, bytes32 username) onlyOwner public {
        if (users[username].doesExist == true){
            users[username].imghash = hash;
        }
        else{
            revert("Username doesnot exist");

        }
    }
    function getHash(bytes32 username) view public returns (bytes32) {
        return users[username].imghash;
    }

	function requestUser(bytes32 requestUsername, bytes32 orgUsername)onlyOwner public{
        users[requestUsername].orgarr.push(orgUsername);
        users[requestUsername].response.push("requested");
        org[orgUsername].userarr.push(requestUsername);
        org[orgUsername].status.push("pending");

	}

    function respondToRequest(bytes32 requestUsername, bytes32 orgUsername, bytes32 response)onlyOwner public{
        uint i=0;
        uint j=0;
        uint n=users[requestUsername].orgarr.length;
        uint m=org[orgUsername].userarr.length;
        while(users[requestUsername].orgarr[i]!=orgUsername && i<n){
            i+=1;
        }
        while(org[orgUsername].userarr[j]!=requestUsername && j<m){
            j+=1;
        }
        users[requestUsername].response[i] = response;
        if(response=="approve"){
            org[orgUsername].status[j] = "approved";  
            org[orgUsername].userhash[j]= users[requestUsername].imghash;
        }
        else{
            org[orgUsername].status[j] = "declined";
            org[orgUsername].userhash[j]= "";

        }
    }

    function orgViewId(bytes32 requestUsername,bytes32 orgUsername) view public returns (bytes32){
        uint i=0;
        uint n=org[orgUsername].userarr.length;
        while(org[orgUsername].userarr[i]!=requestUsername && i<n){
            i+=1;
        }
        if(org[orgUsername].status[i] == "approved"){
            //return org[orgUsername].userhash[i];
            return users[requestUsername].imghash;
        }
        return "declined";
    }

}
