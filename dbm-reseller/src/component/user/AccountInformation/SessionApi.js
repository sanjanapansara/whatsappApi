import { message } from "antd";
import axiosInstance from "../../../util/axiosInstance";

export const sessionAll = async (payload) => {
    try {
      const response = await axiosInstance.post("auth/session/all", payload);
      if (response.data?.status) {
        return response.data;
      } else {
        message.error(response.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //? session logout function
  export const sessionLogout = async (payload) => {
    try {
      const response = await axiosInstance.post("auth/session/logout", payload);
      if (response.data?.status) {
        return response.data;
      } else {
        message.error(response.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };