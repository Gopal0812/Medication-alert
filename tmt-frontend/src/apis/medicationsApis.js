import axios from "axios"


export const addMedicine = async (data) => {
    try {
        const response = await axios.post(
            'http://192.168.29.190:8082/api/add-medicine',
            data,
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const getMedicineData = async (userId) => {
    try {
        const response = await axios.get(`http://192.168.29.190:8082/api/getAllMedicine/${userId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const updateMedicine = async (id, data) => {
    try {
        const response = await axios.put(
            `http://192.168.29.190:8082/api/update-medicine/${id}`,
            data,
            { headers: { "Content-Type": "application/json" } }
        )
        return response.data
        console.log(response.data)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const deleteMedicine = async (id) => {
    try {
        const response = await axios.delete(`http://192.168.29.190:8082/api/delete-medicine/${id}`)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}