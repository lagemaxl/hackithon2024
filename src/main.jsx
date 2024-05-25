import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import MapComponent from "./pages/MapComponent";
import NoPage from "./pages/NoPage";
import "./index.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

const data = [
  { name: "eui-b827ebfffe08a202", latitude: 50.6651836, longitude: 14.0253383 },
  { name: "unknown", latitude: 50.6660547, longitude: 14.0206322 },
  { name: "unknown", latitude: 50.6660547, longitude: 14.0206322 },
  { name: "unknown", latitude: 50.6810518, longitude: 14.0069265 },
  { name: "unknown", latitude: 50.6810518, longitude: 14.0069265 },
];

const ws = new WebSocket(`${import.meta.env.VITE_WEB_SOCKET}`);

ws.onopen = () => {
  console.log("WebSocket connection opened");
};

ws.onmessage = (event) => {
  console.log(event.data);
  data.push(event.data);
  console.log(data.length.json());
  console.log(data);
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
};

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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
