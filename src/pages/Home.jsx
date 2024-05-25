import React, { useState, useEffect } from "react";
import { Autocomplete } from "@mantine/core";
import axios from "axios";
import AreaGraph from "./components/AreaGraph";
import AreaGraph2 from "./components/AreaGraph2";
import { Link } from "react-router-dom";
import { DateTimePicker } from "@mantine/dates";

const Home = () => {
  const [data, setData] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedTopicData, setSelectedTopicData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [messageSize, setMessageSize] = useState(0);

  // Calculate the default date range (last week)
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const [startDate, setStartDate] = useState(lastWeek);
  const [endDate, setEndDate] = useState(today);

  const apiKey = import.meta.env.VITE_API_KEY;
  const apiUrl = import.meta.env.VITE_API_URL;

  // Axios instance with default headers
  const axiosInstance = axios.create({
    headers: {
      secret: apiKey,
    },
  });

  // Fetch initial data
  useEffect(() => {
    axiosInstance
      .get(`${apiUrl}/topics/`)
      .then((response) => {
        const topicNames = response.data.map((topic, index) => ({
          value: topic,
          key: index,
        }));
        setData(topicNames);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Fetch message count and size based on the currentPath and selected dates
  useEffect(() => {
    const start = startDate ? startDate.toISOString() : new Date().toISOString();
    const end = endDate ? endDate.toISOString() : new Date().toISOString();

    const url = currentPath
      ? `${apiUrl}/messages/count?path=${currentPath}&start_date=${start}&end_date=${end}`
      : `${apiUrl}/messages/count?start_date=${start}&end_date=${end}`;

    axiosInstance
      .get(url, { headers: { accept: "application/json" } })
      .then((response) => {
        setMessageCount(response.data.count);
        setMessageSize(response.data.size);
      })
      .catch((error) => console.error("Error fetching message data:", error));
  }, [currentPath, startDate, endDate]);

  // Handle topic selection
  const handleTopicClick = (topic) => {
    const newPath = currentPath
      ? `${currentPath}/${encodeURIComponent(topic)}`
      : encodeURIComponent(topic);
    setCurrentPath(newPath);

    axiosInstance
      .get(`${apiUrl}/topics/?path=${newPath}/`)
      .then((response) => {
        const topicNames = response.data.map((topic, index) => ({
          value: topic,
          key: index,
        }));
        setData(topicNames);
        setSelectedTopicData(response.data);
      })
      .catch((error) => console.error("Error fetching topic data:", error));
  };

  // Handle back button click
  const handleBackClick = () => {
    if (currentPath) {
      const newPath = currentPath.split("/").slice(0, -1).join("/");
      setCurrentPath(newPath);

      axiosInstance
        .get(
          newPath ? `${apiUrl}/topics/?path=${newPath}/` : `${apiUrl}/topics/`
        )
        .then((response) => {
          const topicNames = response.data.map((topic, index) => ({
            value: topic,
            key: index,
          }));
          setData(topicNames);
          setSelectedTopicData(response.data);
        })
        .catch((error) => console.error("Error fetching topic data:", error));
    }
  };

  // Filter data based on search query
  const filteredData = data.filter((item) =>
    item.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="sidebar">
        <Autocomplete
          className="search"
          placeholder="Vyhledat..."
          data={filteredData.map((item) => item.value)}
          onChange={(value) => setSearchQuery(value)}
        />
        <button onClick={handleBackClick}>zpátky</button>
        {filteredData.map((item) => (
          <div
            key={item.key}
            className="groups"
            onClick={() => handleTopicClick(item.value)}
          >
            <h3>{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="main">
        <div className="blocks">
          <div className="block">
            <h2>Počet zpráv</h2>
            <h1>{messageCount}</h1>
          </div>

          <div className="block">
            <h2>Velikost zpráv</h2>
            <h1>{messageSize}</h1>
          </div>
        </div>

        <div className="blocks">
          <div className="block">
            <h2>Datum a čas od</h2>
            <DateTimePicker
              clearable
              value={startDate}
              onChange={setStartDate}
              placeholder="Pick date and time"
            />
          </div>
          <div className="block">
            <h2>Datum a čas do</h2>
            <DateTimePicker
              clearable
              value={endDate}
              onChange={setEndDate}
              placeholder="Pick date and time"
            />
          </div>
        </div>

        <div>
          <AreaGraph currentPath={currentPath} startDate={startDate} endDate={endDate} />
          <AreaGraph2 currentPath={currentPath} startDate={startDate} endDate={endDate} />
        </div>

        <div className="footer">
          <h3>Vytvořil tým 50vataM na <a href="https://hackithon.ujep.cz/" target="_blank">Hackithonu 2024</a></h3>
          <Link to="/map">
          <button className="map-button">
            Přejít na mapu
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
