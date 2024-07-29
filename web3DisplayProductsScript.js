
const onConnectWalletBtnClick = async () => {
  try {
    if (!window.ethereum.selectedAddress) {
      // Request access to the user's MetaMask wallet
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the connected account(s)
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      // If the user has multiple accounts, prompt them to select one
      if (accounts.length > 1) {
        const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = address;
        alert(`Successfully connected to wallet! Selected account address: ${address}`);
        console.log(`Selected account address: ${address}`);
      } else {
        const address = accounts[0];
        userAddress = address;
        alert(`Successfully connected to wallet! Connected account address: ${address}`);
        console.log(`Connected account address: ${address}`);
      }
      console.log(userAddress);

      document.cookie = "accountAddress=" + userAddress + "; path=/";
      connectWalletBtn.textContent = 'Disconnect Wallet';
    } else {
      // Disconnect the user's MetaMask wallet
      await window.ethereum.disconnect();
      
      alert('Successfully disconnected wallet!');
      console.log('Wallet disconnected');
      connectWalletBtn.textContent = 'Connect Wallet';
      submitButton.textContent = 'Login';
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
  if(userAddress && contract.methods.getUserByAccountAddress(userAddress) != null){
    return true;
  }
}
//********************************************Display products************************************************************ */
async function fetchProducts() {
    
    const productsCount = await contract.methods.productsCount().call();
    console.log(productsCount);
    const products = [];
    for (let i = 0; i < productsCount; i++) {
      const product = await contract.methods.products(i).call();
      products.push(product);
    }
    return products;
}

function renderProducts(product) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    product.forEach(product => {
        const container = document.createElement('div');
        container.className = 'product-container';

        const img = document.createElement('img');
        img.src = product.image;

        const title = document.createElement('h2');
        title.textContent = product.title;

        const price = document.createElement('p');
        price.textContent = `Price: ${web3.utils.fromWei(product.price)} ETH`;

        const desc = document.createElement('div');
        desc.className = 'product-description';
        desc.textContent = product.desc;

        const buyBtn = document.createElement('button');
        buyBtn.className = 'buy-button';
        buyBtn.textContent = 'Buy';

        buyBtn.addEventListener('click', () => {

            const productId = product.productId;
            const price = product.price;
            let address = getCookie("accountAddress");
            contract.methods.getUserByAccountAddress(address).call()
            .then(customer => {
            let text = "Delivery Address: " + customer[4] +"\nPay Now and Place Order?";
            if (confirm(text) == true) {
              buyProduct(productId, price, product);
            } else {
              alert("You Canceled the Order.")
              text = "You canceled!";
            }
            })
            .catch((error) => {
              // Handle the error
              console.error(error);
            });
            
            // This function will execute when the buy button is clicked
            console.log(`Clicked buy button for product with ID ${product.productId}`);
            // You can perform some action with the product ID here
          });

          const cartBtn = document.createElement('button');
          cartBtn.className = 'buy-button';
          cartBtn.textContent = 'Cart';
  
          cartBtn.addEventListener('click', () => {
  
              const productId = product.productId;
              
              addToCart(productId);
              // This function will execute when the buy button is clicked
              console.log(`Clicked buy button for product with ID ${product.productId}`);
              // You can perform some action with the product ID here
            });

        container.appendChild(img);
        container.appendChild(title);
        container.appendChild(price);
        container.appendChild(desc);
        container.appendChild(buyBtn);
        container.appendChild(cartBtn);
        productList.appendChild(container);

    });
    
}

// Fetch the product data and render it when the page loads
window.addEventListener('load', async () => {
    const products = await fetchProducts();
    renderProducts(products);
});



async function buyProduct(productId, price, product) {
    try {
      // Get the current account address
      //const accounts = await web3.eth.getAccounts();
      let address = getCookie("accountAddress");
      const account = address;
  
      // Send a transaction to the smart contract to buy the product
      const result = await contract.methods.buy(productId).send({
        from: account,
        value: price
      });
      alert("Ordered Successfully. \n TransactionHash:"+result.transactionHash);
      console.log(result); // Log the transaction result
      console.log(product.seller);
      contract.methods.getUserByAccountAddress(address).call()
    .then(customer => {
      contract.methods.getUserByAccountAddress(product.seller).call()
    .then(seller => {
      const productDetails = "Product Name: " + product.title + "\nPrice: " + product.price + "\nProduct Id: " + product.productId;
      sendMail(customer[0],seller[0],customer[1],customer[2], customer[4], seller[1], productDetails);
        
    })
    .catch(error => {
        console.log(error);
    }); 
    })
    .catch(error => {
        console.log(error);
    });    
      
      

    } catch (error) {
      console.error(error); // Log any errors that occur

      alert("Error:"+ error);
    }
  }

  function sendMail(customerName,sellerName,customerEmail,customerNumber, customerAddress, sellerEmail, productDetails){
    var params = {
      customer_name: customerName,
      seller_name: sellerName,  
      customer_email: customerEmail,
      customer_number: customerNumber,
      customer_address: customerAddress,
      seller_email: sellerEmail,
      message: productDetails,
    };
  
    const serviceID = "service_ms2326q";
    const templateID = "template_4p6g8qv";
  
      emailjs.send(serviceID, templateID, params)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
     }, function(error) {
        console.log('FAILED...', error);
     });
  }

  function addToCart(productId){
    let address = getCookie("accountAddress");
    
    contract.methods.addToCart(productId).send({ from: address, gas: 3000000 }, function(error, transactionHash) {
      if (error) {
        console.log('Error:', error);
      } else {
        console.log('Transaction hash:', transactionHash);
        alert("Added to Cart" + transactionHash);
      }
    });
  }


  
