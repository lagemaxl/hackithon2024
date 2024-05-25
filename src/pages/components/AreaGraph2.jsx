import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const apiKey = import.meta.env.VITE_API_KEY;

const fetchData = async (currentPath) => {
  const url = currentPath
    ? `http://192.168.80.233:8000/messages/?path=${currentPath}&start_date=2024-05-25T04%3A00%3A00.000Z&end_date=2024-05-26T04%3A00%3A00.000Z`
    : 'http://192.168.80.233:8000/messages/?start_date=2024-05-25T04%3A00%3A00.000Z&end_date=2024-05-26T04%3A00%3A00.000Z';

  const response = await fetch(url, {
    headers: {
      'accept': 'application/json',
      'secret': apiKey
    },
  });
  const data = await response.json();
  return data.map(item => ({
    name: new Date(item.date).toLocaleTimeString(),
    date: new Date(item.date).toLocaleDateString(),
    size: item.size,
  }));
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`Čas: ${label}`}</p>
        <p className="label">{`Datum: ${payload[0].payload.date}`}</p>
        <p className="intro">{`Velikost: ${new Intl.NumberFormat('cs-CZ').format(payload[0].value)} B`}</p>
      </div>
    );
  }

  return null;
};

const AreaGraph2 = ({ currentPath }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const messagesData = await fetchData(currentPath);
      setData(messagesData);
    };
    getData();
  }, [currentPath]);

  return (
    <div className='graph' style={{ width: '100%', height: 300 }}>
      <h2>Zobrazení objemu dat každou minutu</h2>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(tick) => new Intl.NumberFormat('cs-CZ').format(tick)} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="size" stroke="#63b3ed" fill="#63b3ed" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaGraph2;
