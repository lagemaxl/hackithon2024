import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import MapComponent from "./pages/MapComponent";
import NoPage from "./pages/NoPage";
import "./index.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import '@mantine/dates/styles.css';

function useWebSocket(url) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      console.log(event.data);
      const timestampedData = {
        ...JSON.parse(event.data),
        timestamp: Date.now(),
      };
      setData((prevData) => {
        const newData = [...prevData, timestampedData];
        if (newData.length > 10) {
          newData.shift(); // Remove the oldest item
        }
        return newData;
      });
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [url]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => prevData.filter(item => (Date.now() - item.timestamp) <= 1000));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return data;
}

export default function App() {
  const data = useWebSocket(import.meta.env.VITE_WEB_SOCKET);

  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">  {/*element={<Layout />}*/}
            <Route index element={<Home />} />
            <Route path="map" element={<MapComponent data={data} />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
