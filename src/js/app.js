import "../css/style.css"

import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"
import identityartifact from "../../build/contracts/Identity.json"
var IdentityContract = contract(identityartifact)
var bufferfile = null;
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
			sessionStorage.setItem("username",uname); 
			//console.log(sessionStorage.getItem("username"));
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
			sessionStorage.setItem("orgname",uname); 
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
      console.log(imghash)
      /*var mykey = crypto.createCipher('aes-128-cbc',key);
      var mystr = mykey.update(imghash, 'utf8', 'hex');
      mystr += mykey.final('hex');*/

      IdentityContract.deployed().then(function(instance){
        instance.storeimghash(imghash,sessionStorage.getItem("username")).then(function(result){
          alert("Image uploaded succesfully");
		  location.reload();

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
	IdentityContract.deployed().then(function(instance){
		instance.getHash(sessionStorage.getItem("username")).then(function(data){	
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
        //window.location.replace(s);
		document.getElementById("output").src = s;
        return;
      }
      else{
        alert("Error in viewing ID");
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

requestId: function() {
	var uname = $("#usernameRequest").val();
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes();
  var dateTime = date+' '+time;
	IdentityContract.deployed().then(function(instance){
		instance.requestUser(uname,sessionStorage.getItem("orgname"),dateTime).then(function(result){	
			alert("Reqested");
			location.reload();
	}).catch(function(err){ 
      console.log("ERROR! " + err.message)
	  alert("unable to request");
	  return;
    })
	}).catch(function(err){ 
    console.log("ERROR! " + err.message)
  })  
},

respondReq: function(orgname,response) {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes();
  var dateTime = date+' '+time;
	IdentityContract.deployed().then(function(instance){
		instance.respondToRequest(sessionStorage.getItem("username"),orgname,response,dateTime).then(function(data){	
			alert("Responded");
			location.reload();
	}).catch(function(err){ 
      console.log("ERROR! " + err.message)
	  alert("Unable to respond");
	  return;
    })
	}).catch(function(err){ 
    console.log("ERROR! " + err.message)
  })  
},

logger: function(){
  IdentityContract.deployed().then(function(instance){
    var strlog = instance.mystr();
    strlog.watch();
    strlog.get(function(err, result){
      console.log(err);
      console.log(result);
    })
    var intlog = instance.mylog();
    intlog.watch();
    intlog.get(function(err, result){
      console.log(err);
      console.log(result);
    })

  }).catch(function(err){ 
    console.log("ERROR! " + err.message)
  })
},

orgViewId: function() {
  var uname = $("#usernameView").val();
  IdentityContract.deployed().then(function(instance){
		instance.orgViewId(uname,sessionStorage.getItem("orgname")).then(function(data){	
      var hex  = data.toString();
      var str = '';
      for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
      }
      var n=str.localeCompare("declined")
      if(n!=0){
        /*var mykey1 = crypto.createDecipher('aes-128-cbc', 'mypassword');
        var mystr1 = mykey1.update(mystr, 'hex', 'utf8')
        mystr1 += mykey1.final('utf8');
        console.log(mystr1);*/
        console.log(str)
        const hashHex = "1220" + data.slice(2)
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = b58.encode(hashBytes)
        console.log(hashStr);
        var s="http://localhost:8081/ipfs/"+hashStr;
        window.location.replace(s);
        return;
      }
      else{
        alert("User has declined the request");
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


userorglist: function() {
	var n;	
  IdentityContract.deployed().then(async function(instance){
        await instance.getorgarrlength(sessionStorage.getItem("username")).then(function(data){
        n=data;
        sessionStorage.setItem("n",n.c[0]);
        }).catch(function(err){ 
        console.log("ERROR! " + err.message)
      return;
      })	
    }).catch(function(err){ 
      console.log("ERROR! " + err.message)
    }) 

  var n= sessionStorage.getItem("n");
  console.log(n);
  
  IdentityContract.deployed().then(async function(instance){
    sessionStorage.setItem("pendingstr","");
    sessionStorage.setItem("olderstr","");
    var pendingstr="<tbody>";
    var olderstr="<tbody>";
    for(var i=0; i<n; i++){
      await instance.getorgarrreponse(i,sessionStorage.getItem("username")).then(function(data){
      var hex  = data[0].toString();
      var hexdate=data[2].toString();
      var str = '';
      var strdate = '';
      for (var k = 0; k < hex.length; k += 2) {
        str += String.fromCharCode(parseInt(hex.substr(k, 2), 16));
        strdate += String.fromCharCode(parseInt(hexdate.substr(k, 2), 16));
      }
      if(data[1].c[0]===0){
        pendingstr+="<tr><td id="+i+">"+str+"</td><td>"+strdate+"</td><td><button class='btn btn-success' style='margin-right:10px' onclick='App.respondReq(document.getElementById("+i+").innerText,1)'>Approve</button><button class='btn btn-danger' onclick='App.respondReq(document.getElementById("+i+").innerText,2)'>Decline</button></td></tr>";
        sessionStorage.setItem("pendingstr",pendingstr);
      }
      else if(data[1].c[0]===1){
        olderstr+="<tr><td>"+str+"</td><td>"+strdate+"</td><td><button class='btn btn-success'>Approved</button></td></tr>";
        sessionStorage.setItem("olderstr",olderstr);
      }
      else{
        olderstr+="<tr><td>"+str+"</td><td>"+strdate+"</td><td><button class='btn btn-danger'>Declined</button></td></tr>";
        sessionStorage.setItem("olderstr",olderstr);
      } 
      }).catch(function(err){ 
      console.log("ERROR! " + err.message)
    return;
    })	}
    var pendingstr= sessionStorage.getItem("pendingstr");
    var olderstr= sessionStorage.getItem("olderstr");    
    pendingstr+="</tbody>";
    olderstr+="</tbody>";
    $("#table1").append(pendingstr);
    $("#table2").append(olderstr);
  }).catch(function(err){ 
    console.log("ERROR! " + err.message)
  }) 
  
},


organisationuserlist: function() {
	var n;	
  IdentityContract.deployed().then(function(instance){
      instance.getuserarrlength(sessionStorage.getItem("orgname")).then(function(data){
        n=data;
        sessionStorage.setItem("on",n.c[0]);
        }).catch(function(err){ 
        console.log("ERROR! " + err.message)
      return;
      })	
    }).catch(function(err){ 
      console.log("ERROR! " + err.message)
    }) 

 var n= sessionStorage.getItem("on");
  console.log(n);

  IdentityContract.deployed().then(async function(instance){
    sessionStorage.setItem("olderstr","");
    var olderstr="<tbody>";
    for(var i=0; i<n; i++){
    await instance.getuserarrstatus(i,sessionStorage.getItem("orgname")).then(function(data){
      var hex  = data[0].toString();
      var hexdate=data[2].toString();
      var str = '';
      var strdate = '';
      for (var k = 0; k < hex.length; k += 2) {
        str += String.fromCharCode(parseInt(hex.substr(k, 2), 16));
        strdate += String.fromCharCode(parseInt(hexdate.substr(k, 2), 16));
      }
		if(data[1].c[0]===0){
        olderstr+="<tr><td>"+str+"</td><td>"+strdate+"</td><td><button class='btn btn-warning'>Pending</button></td></tr>";
        sessionStorage.setItem("olderstr",olderstr);
      }
      else if(data[1].c[0]===1){
        olderstr+="<tr><td>"+str+"</td><td>"+strdate+"</td><td><button class='btn btn-success'>Approved</button></td></tr>";
        sessionStorage.setItem("olderstr",olderstr);
      }
      else{
        olderstr+="<tr><td>"+str+"</td><td>"+strdate+"</td><td><button class='btn btn-danger'>Declined</button></td></tr>";
        sessionStorage.setItem("olderstr",olderstr);
      } 
      }).catch(function(err){ 
      console.log("ERROR! " + err.message)
    return;
    })	}
    var olderstr= sessionStorage.getItem("olderstr");    
    olderstr+="</tbody>";
    $("#table1").append(olderstr);
  }).catch(function(err){ 
    console.log("ERROR! " + err.message)
  }) 
},

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
