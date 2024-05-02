register = async () => {
    try {
        // Get the username and password values from your form or any other source
        const username = document.getElementById("usernameInput").value;
        const password = document.getElementById("passwordInput").value;

        // Send a POST request using Axios
        const response = await axios.post("http://localhost:8888/api/Authentication/register", {
            username: username,
            password: password
        });

        // Handle success, for example, show a success message to the user
        console.log(response.data);
        alert("Registration successful!");
    } catch (error) {
        // Handle error, for example, show an error message to the user
        console.error(error);
        alert("Registration failed. Please try again.");
    }
}

test = () => {
    console.log("click clikc");
}