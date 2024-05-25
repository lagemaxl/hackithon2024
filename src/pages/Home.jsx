import React, { useState, useEffect } from "react";
import { Autocomplete } from "@mantine/core";
import axios from "axios";
import AreaGraph from "./components/AreaGraph";
import AreaGraph2 from "./components/AreaGraph2";
import { Link } from "react-router-dom";
import { DateTimePicker } from '@mantine/dates';

const Home = () => {
  const [data, setData] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedTopicData, setSelectedTopicData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [messageSize, setMessageSize] = useState(0);

  const apiKey = import.meta.env.VITE_API_KEY;
  const apiUrl = import.meta.env.VITE_API_URL;

  // Axios instance with default headers
  const axiosInstance = axios.create({
    headers: {
      'secret': apiKey
    }
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

  // Fetch message count and size
  useEffect(() => {
    axiosInstance
      .get(
        'http://192.168.80.233:8000/messages/count?start_date=2024-05-25T04%3A00%3A00.000Z&end_date=2024-05-26T04%3A00%3A00.000Z',
        { headers: { accept: 'application/json' } }
      )
      .then((response) => {
        setMessageCount(response.data.count);
        setMessageSize(response.data.size);
      })
      .catch((error) => console.error("Error fetching message data:", error));
  }, []);

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
        <button>zpátky</button>
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
        <DateTimePicker
          clearable
          defaultValue={new Date()}
          label="Pick date and time"
          placeholder="Pick date and time"
          type="multiple"
        />

        <div>
          <AreaGraph />
          <AreaGraph2 />
        </div>

        <div className="footer">
          <button className="map-button">
            <Link to="/map">Přejít na mapu</Link> 
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
