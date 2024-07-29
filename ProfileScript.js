// Get the user's data using the contract function

//userAddress = getCookie("userAddress");
//const Web3 = require('web3');
//const web3 = new Web3('https://ropsten.infura.io/v3/your-project-id');

let address = getCookie("accountAddress");
console.log("Hii"+ address);

contract.methods.getUserByAccountAddress(address).call()
    .then(user => {
        // Get the user's account balance        

        web3.eth.getBalance(address, (err, balance) => {
            if (err) {
              console.error(err);
              return;
            }
            document.getElementById('accountBalance').textContent = balance;
            console.log(`Balance in Wei: ${balance}`);
        });


        // Update the HTML with the user's profile data
        document.getElementById('name').textContent = user[0];
        document.getElementById('email').textContent = user[1];
        document.getElementById('phoneNumber').textContent = user[2];
        document.getElementById('accountAddress').textContent = user[3];
        document.getElementById('homeAddress').textContent = user[4];
        //document.getElementById('accountBalance').textContent = "Balance in Wei:"+balance;
    })
    .catch(error => {
        console.log(error);
    });