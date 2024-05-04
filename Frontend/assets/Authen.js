
const authentication = async (req, res) => {
    const curUser = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
        withCredentials: true
    });


    console.log("user", curUser);
}

authentication();