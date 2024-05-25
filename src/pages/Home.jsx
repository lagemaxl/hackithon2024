import React, { useState, useEffect } from "react";
import { Autocomplete } from "@mantine/core";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedTopicData, setSelectedTopicData] = useState(null);

  // Fetch initial data
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/topics/`)
      .then((response) => {
        const topicNames = response.data.map((topic, index) => ({ value: topic, key: index }));
        setData(topicNames);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle topic selection
  const handleTopicClick = (topic) => {
    const newPath = currentPath ? `${currentPath}/${encodeURIComponent(topic)}` : encodeURIComponent(topic);
    setCurrentPath(newPath);

    axios
      .get(`${import.meta.env.VITE_API_URL}/topics/?path=${newPath}/`)
      .then((response) => {
        const topicNames = response.data.map((topic, index) => ({ value: topic, key: index }));
        setData(topicNames);
        setSelectedTopicData(response.data);
      })
      .catch((error) => console.error("Error fetching topic data:", error));
  };

  return (
    <div className="container">
      <div className="sidebar">
        <Autocomplete
          className="search"
          placeholder="Vyhledat..."
          data={data.map((item) => item.value)}
        />
        {data.map((item) => (
          <div key={item.key} className="groups" onClick={() => handleTopicClick(item.value)}>
            <h3>{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="main">
        {selectedTopicData ? (
          <pre>{JSON.stringify(selectedTopicData, null, 2)}</pre>
        ) : (
          "Select a topic to see details"
        )}
      </div>
    </div>
  );
};

export default Home;
