//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

contract GoBuy{
    // Define a User struct to store user profile data
    struct User {
        string name;
        string email;
        string phoneNumber;
        address accountAddress;
        string homeAddress;
    }

    struct Product{
        string title;
        string desc;
        string image;
        address payable seller;
        uint productId;
        uint price;
        address buyer;
        address payable refund_buyer;
        bool delivered;
    }

    uint counter =1;
    Product[] public products;
    event registered(string title, uint productId, address seller); 
    event bought(uint productId, address buyer);
    event delivered(uint productId);
    event refunded(uint indexed _productId, address indexed _buyer);
    event addedToCart(uint _productId, address buyer);

    mapping(address => uint[]) public cart;
    mapping(address => User) public users;
    

    function registerUser(string memory _name, string memory _email, string memory _phoneNumber, string memory _homeAddress) public {
        
        
        
        // Create a new User struct with the provided profile data
        User memory newUser = User({
            name: _name,
            email: _email,
            phoneNumber: _phoneNumber,
            accountAddress: msg.sender,
            homeAddress: _homeAddress
        });
        
        // Associate the new User struct with the user's Ethereum address
        users[msg.sender] = newUser;
        
        // Emit an event to indicate that a new user has been registered
    }

    // Function to get user data based on account address
    function getUserByAccountAddress(address _accountAddress) public view returns (string memory,string memory, string memory, address, string memory) {
        // Retrieve the User struct associated with the provided account address
        User memory user = users[_accountAddress];
        
        // Return the user's profile data as a tuple
        return (user.name,user.email, user.phoneNumber, user.accountAddress, user.homeAddress);
    }

    // Function to show list of products ordered by a specific customer
    function getProductsByBuyer(address _buyerAddress) public view returns (Product[] memory) {
        // Create an array to store the ordered products
        uint counter2 = 0;
        for (uint i = 0; i < counter-1; i++) {
            if (products[i].buyer == _buyerAddress) {
                counter2++;
            }
        }
        Product[] memory orderedProducts = new Product[](counter2);
        uint j = 0;
        
        // Loop through all products and add them to the orderedProducts array if they were ordered by the specified buyer
        for (uint i = 0; i < counter-1; i++) {
            if (products[i].buyer == _buyerAddress) {
                orderedProducts[j] = products[i];
                j++;
            }
        }
        
        // Return the orderedProducts array
        return orderedProducts;
    }

    // Function to show list of products registered by a specific seller
    function getProductsBySeller(address _sellerAddress) public view returns (Product[] memory) {
        // Create an array to store the registered products
        uint counter2 = 0;
        for (uint i = 0; i < counter-1; i++) {
            if (products[i].seller == _sellerAddress) {
                counter2++;
            }
        }
        Product[] memory registeredProducts = new Product[](counter2);
        uint j = 0;
        
        // Loop through all products and add them to the registeredProducts array if they were registered by the specified seller
        for (uint i = 0; i < counter-1; i++) {
            if (products[i].seller == _sellerAddress) {
                registeredProducts[j] = products[i];
                j++;
            }
        }
        
        // Return the registeredProducts array
        return registeredProducts;
    }



    function registerProduct(string memory _title, string memory _desc,string memory _image, uint _price) public {

        require(_price>0, "Price should be greater than zero");
        Product memory tempProduct;
        tempProduct.title = _title;
        tempProduct.desc = _desc;
        tempProduct.image = _image;
        tempProduct.price = _price;
        tempProduct.seller = payable(msg.sender);
        tempProduct.productId = counter;
        products.push(tempProduct);  //push tempProd value to products on smart contracts
        counter++;
        emit registered(_title, tempProduct.productId, msg.sender);
    }

    function buy(uint _productId) payable public{
        //payble because we are paying
        require(products[_productId-1].price == msg.value, "Please pay the exact price");
        require(products[_productId-1].seller != msg.sender, "Seller cannot be the buyer");
        products[_productId-1].buyer = msg.sender;
        emit bought(_productId, msg.sender);
    }

    function delivery(uint _productId) public {
        require(products[_productId-1].buyer==msg.sender, "Only buyer can confirm it");
        products[_productId-1].delivered = true;
        products[_productId-1].seller.transfer(products[_productId-1].price);
        emit delivered(_productId);
    }
    
    function productsCount() public view returns (uint) {
        return products.length;
    }

    function refund(uint _productId) public {
        require(products[_productId-1].buyer == msg.sender, "Only buyer can refund the purchase");
        //require(products[_productId-1].seller == address(0), "Purchase has already been confirmed by the seller");
        
        
            products[_productId-1].refund_buyer = payable(msg.sender);
        
        
        products[_productId-1].refund_buyer.transfer(products[_productId-1].price);
        products[_productId-1].buyer = address(0);
        emit refunded(_productId, msg.sender);
    }

    function addToCart(uint _productId) public {
        require(_productId > 0 && _productId <= products.length, "Invalid product ID");
        cart[msg.sender].push(_productId);
        emit addedToCart(_productId, msg.sender);
    }

    function getCartProducts(address _user) public view returns (uint[] memory) {
        return cart[_user];
    }

    function removeFromCart(uint _productId) public {
        // Retrieve the user's cart
        uint[] storage userCart = cart[msg.sender];
        
        // Find the index of the product in the user's cart
        uint index = findIndex(_productId, userCart);
        
        // If the product is present in the user's cart, remove it
        if (index < userCart.length) {
            // Shift the subsequent elements to the left to fill the gap
            for (uint i = index; i < userCart.length-1; i++) {
                userCart[i] = userCart[i+1];
            }
            
            // Remove the last element from the array
            userCart.pop();
        }
    }

    // Helper function to find the index of a product in a user's cart
    function findIndex(uint _productId, uint[] storage _cart) internal view returns (uint) {
        for (uint i = 0; i < _cart.length; i++) {
            if (_cart[i] == _productId) {
                return i;
            }
        }
        return _cart.length;
    }
}