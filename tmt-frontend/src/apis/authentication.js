import axios from "axios"

export const signup = async (data) => {
    try {
        const response = await axios.post('http://192.168.29.190:8082/api/register', data)
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const login = async (data) => {
    try {
        const response = await axios.post('http://192.168.29.190:8082/api/login', data)
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
        throw error;
    }
}