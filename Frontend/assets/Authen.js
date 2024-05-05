
const authentication = async (req, res) => {
    const curUserId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
        withCredentials: true
    });


    console.log("user", curUserId.data);
}

authentication();