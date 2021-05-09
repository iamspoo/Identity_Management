import "../css/style.css"

import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"
import identityartifact from "../../build/contracts/Identity.json"
var IdentityContract = contract(identityartifact)
var bufferfile = null;
var username="admin";
var crypto = require('crypto');
const b58 = require('b58');

window.App = {
  start: function() { 
    IdentityContract.setProvider(window.web3.currentProvider)
    IdentityContract.defaults({from: window.web3.eth.accounts[0],gas:6721975})
  },

loginuser: function() {
	var uname = $("#uname").val() 
	var pword = $("#pword").val() 
	
	if (uname === "" || pword === ""){
		alert("Username or password is empty");
		return; 
	}  
	IdentityContract.deployed().then(function(instance){
		instance.validateUser(uname,pword).then(function(data){	
      console.log(data);
      if(data==true){
        window.location.replace("http://localhost:8080/main.html");
		username = uname;
        return;
      }
      else{
        alert("Invalid username or password");
		    return; 
      }
	}).catch(function(err){ 
      console.log("ERROR! " + err.message)
	  return;
    })	
  }).catch(function(err){ 
    console.log("ERROR! " + err.message)
  })  
},

adduser :function(){
	    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";  
		var lenString = 7;  
    var randomstring = '';  
	 for (var i=0; i<lenString; i++) {  
        var rnum = Math.floor(Math.random() * characters.length);  
        randomstring += characters.substring(rnum, rnum+1);  
    }  
	/*const min=1;
	const max=100000;
	var key = Math.floor(Math.random() * (max - min + 1) ) + min;*/
	console.log(randomstring);
	var uname = $("#uname").val() 
	var pword = $("#pword").val()
	var cpword = $("#cpword").val()
	
	if (cpword!=pword){
		alert("The passwords donot match");
		return;
	}
	
	if (uname === "" || pword === ""){
		alert("Username or password is empty");
		return 
	}
	IdentityContract.deployed().then(function(instance){
    instance.addUser(uname,pword).then(function(result){
		alert("Thank you! for signing up")
		window.location.replace("http://localhost:8080/");
    }).catch(function(err){ 
      console.log("ERROR! " + err.message)
      alert("Username already exists")
    })
  }).catch(function(err){ 
    console.log("ERROR! " + err.message)
  })
},


loginuser2: function() {
	var uname = $("#uname2").val() 
	var pword = $("#pword2").val() 
	if (uname === "" || pword === ""){
		alert("Username or password is empty");
		return 
	}
	IdentityContract.deployed().then(function(instance){
		instance.validateOrg(uname,pword).then(function(data){	
      console.log(data);
      if(data==true){
        window.location.replace("http://localhost:8080/orgmain.html");
        return;
      }
      else{
        alert("Invalid username or password");
		    return; 
      }
	}).catch(function(err){ 
      console.log("ERROR! " + err.message)
	  return;
    })	
  }).catch(function(err){ 
    console.log("ERROR! " + err.message)
  })  
},

adduser2 :function(){
	var uname = $("#uname2").val() 
	var pword = $("#pword2").val() 
	var cpword = $("#cpword2").val()
	
	if (cpword!=pword){
		alert("Confrim Password does match with the Password");
		return;
	}
	if (uname === "" || pword === ""){
		alert("Username or password is empty");
		return 
	}
	IdentityContract.deployed().then(function(instance){
    instance.addOrg(uname,pword).then(function(result){
		alert("Thank you! for signing up")
		window.location.replace("http://localhost:8080/");
    }).catch(function(err){ 
      console.log("ERROR! " + err.message)
      alert("Username already exists")
    })
  }).catch(function(err){ 
    console.log("ERROR! " + err.message)
  })
  
},
	
captureFile: function(){
	try{
	const fileupload = document.getElementById("inputfile")
	const seletedfile = fileupload.files[0];
	const reader= new window.FileReader()
	reader.readAsArrayBuffer(seletedfile)
	reader.onloadend = () => {
	    bufferfile= Buffer(reader.result)
      //var cipher = crypto.createCipheriv('aes-128-cbc',"pwdkey","ivstr")
      //var bufferfile = Buffer.concat([cipher.update(bufferfile),cipher.final()]);
      //console.log("buffer", bufferfile)
	}	
	}
	catch(err){
		//err.message
		alert("File unable to upload")
	}	
},

uploadFile: function() {
	console.log("buffer", bufferfile)
  const ipfs = window.IpfsApi('localhost', 5001)
	ipfs.add(bufferfile, (err, result) => {
    if (err) {
      alert("Error in uploading image");
      console.log(err);
    }
    else{
      var imghash = String(result[0].hash);
      console.log(imghash)
      var username="admin";
      imghash="0x"+b58.decode(imghash).slice(2).toString('hex');
      /*var mykey = crypto.createCipher('aes-128-cbc',key);
      var mystr = mykey.update(imghash, 'utf8', 'hex');
      mystr += mykey.final('hex');*/

      IdentityContract.deployed().then(function(instance){
        instance.storeimghash(imghash,username).then(function(result){
          alert("Image uploaded succesfully");
        }).catch(function(err){ 
          console.log("ERROR! " + err.message)
          alert("Username doesnot exist-app")
        })
      }).catch(function(err){ 
        console.log("ERROR! " + err.message)
      })
    }
  })
},

viewid: function() {
  console.log(username)
	IdentityContract.deployed().then(function(instance){
		instance.getHash(username).then(function(data){	
      if(data!=""){
        /*var mykey1 = crypto.createDecipher('aes-128-cbc', 'mypassword');
        var mystr1 = mykey1.update(mystr, 'hex', 'utf8')
        mystr1 += mykey1.final('utf8');
        console.log(mystr1);*/
        const hashHex = "1220" + data.slice(2)
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = b58.encode(hashBytes)
        console.log(hashStr);
        var s="http://localhost:8081/ipfs/"+hashStr;
        window.location.replace(s);
        return;
      }
      else{
        alert("Invalid username or password");
		    return; 
      }
	}).catch(function(err){ 
      console.log("ERROR! " + err.message)
	  return;
    })	
  }).catch(function(err){ 
    console.log("ERROR! " + err.message)
  })  
}

}

window.addEventListener("load", function() {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      window.ethereum.enable();
      window.web3= web3;
    } catch (error) {
      console.error(error);
    }
  }
  else if (window.web3) {
    console.log('Injected web3 detected.');

  }
  else {
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    const web3 = new Web3(provider);
    console.log('No web3 instance injected, using Local web3.');
    window.web3= web3;
  }
  window.App.start()
})