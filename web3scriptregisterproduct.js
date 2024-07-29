//let Web3 = require("web3");
const form = document.querySelector('form');
form.addEventListener('submit', addProduct);

let image_base64_code;

let address = getCookie("accountAddress");

function addProduct(event) {
  // Prevent the form from submitting
  event.preventDefault();

  console.log("Addressssssssssssssssssssssssss:"+address);

  // Get the form values
  const title = form.title.value;
  const description = form.description.value;
  const price = form.price.value;
	
  const priceInWei = price;

  
	//base64 Image
	const ImageFile = document.getElementById("fileToUpload")
	
	// Get the file object that represents the uploaded image
	const file = ImageFile.files[0];
	  
	// Create a FileReader object to read the contents of the file
	const reader = new FileReader();
	 
	// Define the callback function that will be called when the file is read
	reader.onload = () => {
		// Get the Base64-encoded string representation of the file contents
		const base64String = reader.result.split(',')[1];
    image_base64_code = reader.result;

    console.log(image_base64_code);
    contract.methods.registerProduct(title, description, image_base64_code, priceInWei).send({
      from: address,
      gasPrice: web3.utils.toWei('10', 'gwei'),
      gas: 1000000000
    }).then((receipt) => {
        console.log(receipt);
    alert(receipt);
    location.reload();
    }).catch((error) => {
        console.error(error);
    }); 		
	};
		  
	
	console.log(reader.readAsDataURL(file));
	
    form.reset();
    
    
}



//*********************************Seller Products Display */



let address2 = getCookie("accountAddress");


console.log(address2);

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
      buyBtn.textContent = 'Buy';

      container.appendChild(img);
      container.appendChild(title);
      container.appendChild(price);
      container.appendChild(desc);
      container.appendChild(buyBtn);
      productList.appendChild(container);
  });
}

// Fetch the product data and render it when the page loads
window.addEventListener('load', async () => {
  //const products = await fetchProducts();
  const products = await contract.methods.getProductsBySeller(address).call();
  renderProducts(products);
});