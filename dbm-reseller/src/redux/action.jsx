import axiosInstance from "../util/axiosInstance";
import {
  setActivationChartData,
  setLicenseChartData,
  setNotifications,
  setProducts,
  setStatistics,
} from "./reducers/reducer.app";
import { setCurrencyRates, setPanel } from "./reducers/reducer.setting";
import { removeUserDetails, setProfile } from "./reducers/reducer.user";

export function getAllProducts() {
  return async (dispatch) => {
    try {
      const { data } = await axiosInstance.post("product/all", {
        "page": 0,
        "limit": 100,
      });

      if (data?.status) {
        dispatch(setProducts(data?.products));
      }
    } catch (error) {
      console.log("getAllProducts: Error: " + error);
    }
  };
}

export function getAllNotifications() {
  return async (dispatch) => {
    try {
      const { data } = await axiosInstance.post("reseller/notifications");

      if (data?.status) {
        dispatch(setNotifications(data?.notifications));
      }
    } catch (error) {
      console.log("setNotifications: Error: " + error);
    }
  };
}



export function getExchangeRates() {
  return async (dispatch) => {
    try {
      const { data } = await axiosInstance.get("panel/exchange-rates");
      if (data.status) {
        dispatch(setCurrencyRates(data?.rates));
      }
    } catch (e) {
      console.log("supportCurrencies Error:", e);
    }
  }
}
export function logout() {
  return async (dispatch) => {
    try {
      dispatch(removeUserDetails());
    } catch (error) {
      console.log("logout: Error: " + error);
    }
  };
}

export function refreshProfile() {
  return async (dispatch) => {
    const { data } = await axiosInstance.get("auth/profile");
    if (data?.status) {
      dispatch(setProfile(data?.profile));
    }
  };
}

export function getStatistics() {
  return async (dispatch) => {
    const { data } = await axiosInstance.post("license/reseller/statistics");

    if (data?.status) {
      dispatch(setStatistics(data?.statistics));
    }
  };
}

export function getLicenseChartData(period) {
  return async (dispatch) => {
    const { data } = await axiosInstance.post("reseller/chart/license-key", {
      period: period,
    });
    dispatch(setLicenseChartData(data?.data));
  };
}

export function getActivationChartData(period) {
  return async (dispatch) => {
    const { data } = await axiosInstance.post("reseller/chart/activation", {
      period: period,
    });
    dispatch(setActivationChartData(data?.data));
  };
}
export const getPanelDetails = () => {
  return async (dispatch) => {
    const { data } = await axiosInstance.get("panel/details/reseller");
    if (data?.status) {
      dispatch(setPanel(data?.panel));
    } else {
      dispatch(setPanel(null));
      console.log("getResellerStoreSettings Error:", data)
    }
  };
}