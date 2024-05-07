const addCart = async (productId) => {
    console.log("here");
    const addCartButt = document.querySelector("#addCart");
    addCartButt.disabled = true;
    addCartButt.classList.add("inactive"); // Corrected line
    const curUserId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
        withCredentials: true
    });

    const userId = curUserId.data;
    console.log("user", userId);

    // const shoppingCart = await axios.post(`http://localhost:8080/api/ShoppingCart/addShoppingCart/${userId}`);
    console.log('userId', userId);
    console.log('productid', productId);
    const shoppingCartItem = await axios.post(`http://localhost:8080/api/ShoppingCartItem/addShoppingCartItem/${userId}/${productId}`, {
        qty: document.querySelector("#qty").value
    });

    console.log("Add shopping cart success");

    // Wait for the asynchronous operations to complete before triggering animation
    const logoCart = document.querySelector('#logo-cart');
    logoCart.classList.add("active");

    setTimeout(() => {
        logoCart.classList.remove("active");
        addCartButt.disabled = false;
        addCartButt.classList.remove("inactive"); // Corrected line
    }, 1000);
};
