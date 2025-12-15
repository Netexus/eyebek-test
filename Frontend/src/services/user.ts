import axios from "axios";

export const createCompany = async (
  name: string,
  email: string,
  phone: string,
  address: string,
  password: string,
) => {
  const response = await axios.post("/api/backend/companies/register", {
    name,
    email,
    phone,
    address,
    password,
  });

  return response.data;
};