/* eslint-disable react/no-deprecated */
import React from "react";
// import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./i18n";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/redux/store";
import { StateProvider } from './context';
import PinProvider from "./PinContext";

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ConfigProvider>
            <StateProvider>
              <PinProvider>
                <App />
              </PinProvider>
            </StateProvider>
          </ConfigProvider>
        </Router>
      </PersistGate>
    </Provider>
  </>,

  // document.getElementById("root")
);

postMessage({ payload: "removeLoading" }, "*");
