document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('login-form');
  const connectWalletBtn = document.getElementById('connect-wallet-btn');
  const submitButton = document.getElementById('submit-button');

// Check if MetaMask is installed
if (typeof window.ethereum === 'undefined') {
  alert('Please install MetaMask to connect to a wallet');
  connectWalletBtn.disabled = true;
}
let userAddress = getCookie("accountAddress");
if (userAddress == await window.ethereum.request({ method: 'eth_requestAccounts' })) {
  connectWalletBtn.textContent = 'Disconnect Wallet';
}
else{
  connectWalletBtn.textContent = 'Connect Wallet';
}

// Define the event listener function
const onConnectWalletBtnClick = async () => {
  try {
    if (userAddress != await window.ethereum.request({ method: 'eth_requestAccounts' })) {
      console.log("Hii ;" + await window.ethereum.request({ method: 'eth_requestAccounts' }));
      // Request access to the user's MetaMask wallet
      await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the connected account(s)
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      // If the user has multiple accounts, prompt them to select one
      userAddress = accounts;

      console.log(userAddress);

      document.cookie = "accountAddress=" + userAddress + "; path=/";
      connectWalletBtn.textContent = 'Disconnect Wallet';
      alert('Successfully connected wallet!');
      location.reload();
    } else {
      // Request disconnection from the user's MetaMask wallet
      await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      
      alert('Successfully disconnected wallet!');
      //console.log(info);
      document.cookie = "accountAddress=" + null + "; path=/";
      connectWalletBtn.textContent = 'Connect Wallet';
      submitButton.textContent = 'Login';
      location.reload();
      
    }

    if(checkAccount()){
      submitButton.textContent = 'Update Info';
    }
  } catch (error) {
    console.error(error);
    alert('Failed to connect to wallet');
  }
};

function checkAccount() {
  if(contract.methods.getUserByAccountAddress(userAddress) != null){
    return true;
  }
}


// Attach the event listener to the button
connectWalletBtn.addEventListener('click', onConnectWalletBtnClick);

//*********************************************************************************************************************************************/

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the user's email address
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone_number = document.getElementById('phone-number').value;
    const home_address = document.getElementById('home-address').value;
    console.log(userAddress);
    // Call the function on the contract instance
    contract.methods.registerUser(name, email, phone_number, home_address).send({from: userAddress,
      gasPrice: web3.utils.toWei('10', 'gwei'),
      gas: 1000000})
    .then((receipt) => {
      console.log(receipt);
      // sendEmail(name,email,phone_number,home_address);
    })
    .catch((error) => {
      console.error(error);
      alert("Error:" + error);
    });
    alert("Information added Sucessfully!");
    // You can now use the email variable to perform login logic or send it to your server
    console.log(`Sucess User email: ${email}`);
  });
});


// const nodemailer = require('nodemailer');

// function sendEmail(name, email, number, address) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'gobuyecommerce@gmail.com',
//       pass: 'Palash@123'
//     }
//   });

//   const mailOptions = {
//     from: 'gobuyecommerce@gmail.com',
//     to: email,
//     subject: 'Registered Successfully',
//     text: `Dear ${name},\n\nThank you for registering with Go Buy! Your registration was successful.\n\nHere are the details we have on file:\nEmail: ${email}\nNumber: ${number}\nAddress: ${address}\n\nThanks again for choosing Go Buy!\n\nBest regards,\nThe Go Buy team`
//   };

//   transporter.sendMail(mailOptions, function(error, info) {
//     if (error) {
//       console.log('Error sending email: ', error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// }


// document.addEventListener('DOMContentLoaded', () => {
//     const connectWalletBtn = document.getElementById('connect-wallet-btn');

//     //to put cutton before this element
//     //const myElement = document.getElementById('top-title');
    

//     connectWalletBtn.addEventListener('click', async () => {
//         // Check if MetaMask is installed
//         if (typeof window.ethereum === 'undefined') {
//           alert('Please install MetaMask to connect to a wallet');
//           return;
//         }
      
//         try {
//           // Request access to the user's MetaMask wallet
//           await window.ethereum.request({ method: 'eth_requestAccounts' });
//           alert('Successfully connected to wallet!');
//         } catch (error) {
//           console.error(error);
//           alert('Failed to connect to wallet');
//         }
//       });
      
//       // Add the button to the document
//       //document.body.appendChild(connectWalletBtn);
//       //document.body.insertBefore(connectWalletBtn, myElement);
//   });

/*document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('connect-wallet-btn').addEventListener('click', event => {
    let account;
    ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
      account = accounts[0];
      console.log(account);
    });
  });
});*/


/*document.addEventListener('DOMContentLoaded', () => {
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    connectWalletBtn.addEventListener('click', event => {
        
    
        alert: "0";
            if (window.ethereum) { //check if Metamask is installed
                  try {
                      const address = window.ethereum.enable(); //connect Metamask
                      const obj = {
                              connectedStatus: true,
                              status: "",
                              address: address
                          }
                          alert: "1";
                          return obj;
                    
                       
                  } catch (error) {
                    alert: "2";
                      return {
                          connectedStatus: false,
                          status: "🦊 Connect to Metamask using the button on the top right."
                      }
                    
                  }
                  
            } else {
                alert: "3";
                  return {
                      connectedStatus: false,
                      status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
                  }
                  
                } 
      
        
    });
  });*/
  
