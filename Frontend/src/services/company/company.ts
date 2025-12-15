import axios from "axios";
import { Employee } from "./companyType";

export const getEmployees = async () => {
    const res = await axios.get(`api`);
    return res.data;
};


export const getEmployeesAdmin = async () => {
    const res = await axios.get(`api`);
    return res.data;
}


export const createEmployee = async (dataEmployee:Employee) => {
    const res = await axios.post(`api`, dataEmployee);
    return res.data;
}
