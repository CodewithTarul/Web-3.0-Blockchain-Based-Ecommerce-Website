

let address = getCookie("accountAddress");


console.log(address);


var count = 0;

function renderProducts(product) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  product.forEach(product => {

      const container = document.createElement('div');
      container.className = 'product-container';
      
      count++;
      console.log(count);
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
      buyBtn.textContent = 'Delivered??';      


      buyBtn.addEventListener('click', async () => {
        const productId = product.productId;
        const price = product.price;
        
        const info = contract.methods.delivery(product.productId).send({ from: address });
        console.log(info);
        alert(info);
        try {
          const receipt = await info;
          alert(receipt.transactionHash); // logs the transaction hash
        } catch (error) {
          alert(error);
        }    
        
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'buy-button';
      cancelBtn.textContent = 'Cancel Order';

      cancelBtn.addEventListener('click', async () => {
        const productId = product.productId;
        //const price = product.price;
        
        const options = { from: address };

        contract.methods.refund(productId).send(options, (error, txHash) => {
          if (error) {
            console.error(error);
          } else {
            console.log(`Transaction hash: ${txHash}`);
            alert("Your canclaion was Succesfull, Money is refunded.\nTransaction hash: " + txHash);
            
            location.reload();
          }
        });

      });
      
      container.appendChild(img);
      container.appendChild(title);
      container.appendChild(price);
      container.appendChild(desc);
      container.appendChild(buyBtn);
      container.appendChild(cancelBtn);
      productList.appendChild(container);
  });
  if(count == 0)
  {
    const container = document.createElement('div');
    const Text = document.createElement('h2');
    Text.textContent = "You have Not ordered Any Products";
    Text.style.color = "rgba(255, 0, 0, 1)";
    //Text.style.backgroundcolor = rgba(255, 255, 255, 0.5); /* white with 50% opacity */
    container.appendChild(Text);
    productList.appendChild(container);
  }
}

// Fetch the product data and render it when the page loads
window.addEventListener('load', async () => {
  //const products = await fetchProducts();
  const products = await contract.methods.getProductsByBuyer(address).call();
  renderProducts(products);
});


async function buyProduct(productId, price) {
  try {
    // Get the current account address
    
    const account = address;

    // Send a transaction to the smart contract to buy the product
    const result = await contract.methods.buy(productId).send({
      from: account,
      value: price
    });

    console.log(result); // Log the transaction result
  } catch (error) {
    console.error(error); // Log any errors that occur
  }
}

