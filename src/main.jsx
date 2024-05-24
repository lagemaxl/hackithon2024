import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import MapComponent from './pages/MapComponent';
import NoPage from './pages/NoPage';

const data = [
  {
    "sensor": "cykloscitac",
    "format": "json",
    "msg": {
      "msg_string": "1;73;1.0;1707898865;3.5;38.3;10;9;9;8;50.38;13.98;-133.61;-123.12;-57.33;-91.49;176.79;-82.49;-175.86;-2.93;1.58",
      "id_senzoru": 1,
      "id_msg": 73,
      "stav_baterie": 1.0,
      "cas": "2024-02-14 09:21:05",
      "unix_time": 1707898865,
      "teplota": 3.5,
      "vlhkost": 38.3,
      "chodciA": 10,
      "chodciB": 9,
      "cyklistiA": 9,
      "cyklistiB": 8,
      "lat": 50.38,
      "lon": 13.98,
      "x1": -133.61,
      "x2": -123.12,
      "x3": -57.33,
      "x4": -91.49,
      "x5": 176.79,
      "x6": -82.49,
      "x7": -175.86,
      "x8": -2.93,
      "x9": 1.58
    }
  },
  {
    "sensor": "cykloscitac",
    "format": "json",
    "msg": {
      "msg_string": "2;22;2.1;1707898865;13.6;64.1;2;1;9;2;50.51;14.03;6.64;-71.57;-26.44;-171.08;83.62;-91.26;124.23;-158.56;4.45",
      "id_senzoru": 2,
      "id_msg": 22,
      "stav_baterie": 2.1,
      "cas": "2024-02-14 09:21:05",
      "unix_time": 1707898865,
      "teplota": 13.6,
      "vlhkost": 64.1,
      "chodciA": 2,
      "chodciB": 1,
      "cyklistiA": 9,
      "cyklistiB": 2,
      "lat": 50.51,
      "lon": 14.03,
      "x1": 6.64,
      "x2": -71.57,
      "x3": -26.44,
      "x4": -171.08,
      "x5": 83.62,
      "x6": -91.26,
      "x7": 124.23,
      "x8": -158.56,
      "x9": 4.45
    }
  },
  {
    "sensor": "cykloscitac",
    "format": "json",
    "msg": {
      "msg_string": "1;44;2.7;1707898865;27.8;34.7;5;5;6;3;50.29;14.23;-57.97;58.43;-29.57;81.79;47.58;-97.38;11.65;-174.38;-173.95",
      "id_senzoru": 1,
      "id_msg": 44,
      "stav_baterie": 2.7,
      "cas": "2024-02-14 09:21:05",
      "unix_time": 1707898865,
      "teplota": 27.8,
      "vlhkost": 34.7,
      "chodciA": 5,
      "chodciB": 5,
      "cyklistiA": 6,
      "cyklistiB": 3,
      "lat": 50.29,
      "lon": 14.23,
      "x1": -57.97,
      "x2": 58.43,
      "x3": -29.57,
      "x4": 81.79,
      "x5": 47.58,
      "x6": -97.38,
      "x7": 11.65,
      "x8": -174.38,
      "x9": -173.95
    }
  },
  {
    "sensor": "cykloscitac",
    "format": "json",
    "msg": {
      "msg_string": "1;67;1.7;1707898865;32.8;0.5;1;0;8;0;50.36;14.21;14.12;99.32;112.82;-163.87;-119.73;-168.54;62.23;-79.69;-160.82",
      "id_senzoru": 1,
      "id_msg": 67,
      "stav_baterie": 1.7,
      "cas": "2024-02-14 09:21:05",
      "unix_time": 1707898865,
      "teplota": 32.8,
      "vlhkost": 0.5,
      "chodciA": 1,
      "chodciB": 0,
      "cyklistiA": 8,
      "cyklistiB": 0,
      "lat": 50.36,
      "lon": 14.21,
      "x1": 14.12,
      "x2": 99.32,
      "x3": 112.82,
      "x4": -163.87,
      "x5": -119.73,
      "x6": -168.54,
      "x7": 62.23,
      "x8": -79.69,
      "x9": -160.82
    }
  }
];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<MapComponent data={data} />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
