let user;
const authentication = async (req, res) => {
    user = await axios.get('http://localhost:8080/api/Authentication/currentUser');

    console.log("user", user);
}

authentication();