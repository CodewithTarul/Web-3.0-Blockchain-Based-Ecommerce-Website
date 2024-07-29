let address = getCookie("accountAddress");


async function fetchProducts() {
    //const productsCount = await contract.methods.products.length;
    //const productsCount = await contract.methods.productsCount().call();
    //console.log(productsCount);
    console.log(address);
    const productArray = await contract.methods.getCartProducts(address).call();
    const products = [];
    console.log(productArray.length);
    console.log(productArray[0]);
    const set = new Set(productArray);
    const newArr = [...set];
    for (let i = 0; i < newArr.length; i++) {       
      const product = await contract.methods.products(newArr[i]-1).call();
      products.push(product);
    }
    return products;
}

function renderProducts(product) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    var total = 0;

    product.forEach(product => {
        const container = document.createElement('div');
        container.className = 'product-container';

        const img = document.createElement('img');
        img.src = product.image;

        const title = document.createElement('h2');
        title.textContent = product.title;

        const price = document.createElement('p');
        price.textContent = `Price: ${web3.utils.fromWei(product.price)} ETH`;
        total = total + parseFloat(product.price);
        // console.log(total);
        // console.log(product.price);
        
        
        const desc = document.createElement('div');
        desc.className = 'product-description';
        desc.textContent = product.desc;
        
          const removeBtn = document.createElement('button');
          removeBtn.className = 'buy-button';
          removeBtn.textContent = 'Remove';
  
          removeBtn.addEventListener('click', () => {
  
              const productId = product.productId;
              
              contract.methods.removeFromCart(productId).send({ from: address })
              .then((result) => {
                // Handle the result
                alert("Removed '" + product.title + "' From Cart");
                //console.log(result);
                location.reload();
              })
              .catch((error) => {
                // Handle the error
                console.error(error);
              });
          });

        container.appendChild(img);
        container.appendChild(title);
        container.appendChild(price);
        container.appendChild(desc);
        // container.appendChild(buyBtn);
        container.appendChild(removeBtn);
        productList.appendChild(container);
        //buyBtn.onclick = function() { buyProduct(product.id, product.price) };
        
    });
    document.getElementById("buy-btn").addEventListener("click", function() {
      contract.methods.getUserByAccountAddress(address).call()
      .then(customer => {
      let text = "Delivery Address: " + customer[4] +"\nPay Now and Place Order?";
      if (confirm(text) == true) {
        product.forEach(product => {
          const productId = product.productId;
          const price = product.price;
          buyProduct(productId, price, product);
        });
      } else {
        alert("You Canceled the Order.")
        text = "You canceled!";
      }
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
      
    });

    
    document.getElementById("total").innerHTML = total + " WEI";
    
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
      console.log(productDetails);
      sendMail(customer[0],seller[0],customer[1],customer[2], customer[4], seller[1], productDetails);
      contract.methods.removeFromCart(productId).send({ from: address })
    .then((result) => {
      // Handle the result
      alert("Ordered Successfully! " + product.title + "\nTansaction Hash: " + result.transactionHash);
      //console.log(result);
      location.reload();
    })
    .catch((error) => {
      // Handle the error
      console.error(error);
    });
      
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