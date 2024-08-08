import { axios } from "axios"

const useAxiosGet = async (url) => {
    return await axios.get(url);
}