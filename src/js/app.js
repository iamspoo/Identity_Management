import "../css/style.css"

import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"

import identityartifact from "../../build/contracts/Identity.json"
var IdentityContract = contract(identityartifact)

window.App = {
  start: function() { 
    IdentityContract.setProvider(window.web3.currentProvider)
    IdentityContract.defaults({from: window.web3.eth.accounts[0],gas:6721975})
  }
}

loginuser: function() {
	$("#msg").html("<p>UserLogin</p>")
      return
}

adduser :function(){
	$("#msg").html("<p>UserSignup</p>")
      return
}

loginuser2: function() {
	$("#msg").html("<p>User2Login</p>")
      return
}

adduser2 :function(){
	$("#msg").html("<p>User2Signup</p>")
      return
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
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:6545');
    const web3 = new Web3(provider);
    console.log('No web3 instance injected, using Local web3.');
    window.web3= web3;
  }
  window.App.start()
})