import React, { useEffect, useState } from "react";
import "../css/SubPage.css";  
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { BASE_URL } from '../config';

const COLORS = ["#0088FE", "#FFBB28", "#FF0000"];
const COLORSsmall = ["#00FF00", "#FF0000"];

export const StatisticsComponent = ({ user }) => {
  if (!user) {
    return (
      <div className="page-wrapper bg-image">
        <div className="text-center mt-5">
          <h1 style={{ marginTop: "5rem" }}>Bejelentkezés szükséges ennek a funkciónak a használatához</h1>
          <p className="lead text-white mt-3">
            Jelentkezz be, hogy hozzáférj a részletes statisztikákhoz, feladatokhoz, és egyéb funkciókhoz.
          </p>
          <div className="mt-4">
            <button 
              className="btn color-bg3 btn-lg border-0" 
              onClick={() => window.location.href = "/belepes"} // Redirect to login page
            >
              Bejelentkezés
            </button>
          </div>
          <div className="mt-5">
            <div className="row justify-content-center">
              <div className="col-md-4 mb-4">
                <div className="card color-bg2 h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-chart-pie fa-3x text-white mb-3"></i>
                    <h4 className="card-title text-white">Statisztikák</h4>
                    <p className="card-text text-white">
                      Kövesd a feladatok megoldásának eredményeit, és lásd a részletes statisztikákat.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card color-bg2 h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-tasks fa-3x text-white mb-3"></i>
                    <h4 className="card-title text-white">Feladatok</h4>
                    <p className="card-text text-white">
                      Gyakorolj különböző témakörökben, és készülj fel az érettségire.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card color-bg2 h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-calendar-alt fa-3x text-white mb-3"></i>
                    <h4 className="card-title text-white">Idővonal</h4>
                    <p className="card-text text-white">
                      Nézd meg, mikor és milyen gyakran oldottál meg feladatokat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 top-padding bg-image w-100 p-5">
      {/* Row for Pie Chart and Line Chart */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card h-100 color-bg2">
            <div className="card-body">
              <h3 className="card-title text-center mb-0 text-white">Feladatok Statisztikája</h3>
              <UserStatisticsChart id="pie" user={user} />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100 color-bg2">
            <div className="card-body">
              <h3 className="card-title text-center mb-5 text-white">Kitöltések Dátum Szerint</h3>
              <FillingByDateChart id="graph" user={user} />
            </div>
          </div>
        </div>
      </div>

      {/* Row for Detailed Statistics */}
      <div className="row">
        <div className="col-12">
          <div className="card taskCard color-bg2">
            <div className="card-body">
              <h3 className="card-title text-center">Részletes Statisztikák</h3>
              <ListDetailedStatistics id="list" user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserStatisticsChart = ({ user }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const body = {
          userId: user.id,
          token: user.token
        };
        const response = await axios.post(`${BASE_URL}/erettsegizzunk/UserStatistics/get-taskFilloutCount`, body);
        const formattedData = Object.entries(response.data).map(([name, count]) => ({ name, count }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching user statistics:", error);
      }
    };

    fetchUserStatistics();
  }, [user]);

  return <StatisticsPieChart data={data}/>;
};

const FillingByDateChart = ({ user }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchFillingByDate = async () => {
      try {
        const body = { userId: user.id, token: user.token };
        const response = await axios.post(`${BASE_URL}/erettsegizzunk/UserStatistics/get-filling-byDate`, body);
        const formattedData = Object.entries(response.data).map(([date, value]) => ({ date, value }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching filling by date:", error);
      }
    };

    fetchFillingByDate();
  }, [user]);

  return <LineGraph data={data} />;
};

const ListDetailedStatistics = ({ user }) => {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchDetailedStatistics = async () => {
      try {
        const body = { userId: user.id, token: user.token, mettol: 0 };
        const response = await axios.post(
          `${BASE_URL}/erettsegizzunk/UserStatistics/get-statitstics-detailed`,
          body
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching detailed statistics:", error);
      }
    };

    fetchDetailedStatistics();
  }, [user]);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="container-fluid">
      {data.map((item, index) => {
        const correct = item.joRossz[0];
        const incorrect = item.joRossz[1];
        const total = correct + incorrect;
        const percentage = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

        return (
          <div key={index} className="card mb-3 color-bg3">
            {/* Header Row */}
            <div
              className="card-header d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <div className="col-6 ol-md-4 col-lg-4 text-truncate">{item.task.description}</div>
              <div className="col-6 col-md-2 col-lg-4 text-center d-none d-md-block"><b>Sikeres:</b> {correct}</div>
              <div className="col-6 col-md-2 col-lg-2 text-center d-none d-md-block"><b>Sikertelen:</b> {incorrect}</div>
              <div className="col-2 col-md-2 text-end">
                <span className="arrow">{expanded === index ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Collapsible Section */}
            {expanded === index && (
              <div className="card-body">
                <div className="row">
                  {/* Column 1: Full Task Description */}
                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <div className="col-12 col-md-12 mb-3 mb-md-0">
                      <div className="fw-bold">Feladat leírása:</div>
                      <div>{item.task.description}</div>
                    </div><br></br>
                    <div className="col-12 col-md-12 mb-3 mb-md-0">
                      <div className="fw-bold">Feladat szövege:</div>
                      <div>{item.task.text}</div>
                    </div>
                  </div>

                  {/* Column 2: Themes and Subject */}
                  <div className="col-12 col-md-2 mb-3 mb-md-0">
                    <div className="mb-2">
                      <div className="fw-bold text-center">Témák:</div>
                      <div className="text-center">{item.task.themes.map(x => x.name).join(", ") || "Nincs téma"}</div>
                    </div>
                    <div>
                      <div className="fw-bold text-center">Tantárgy:</div>
                      <div className="text-center">{item.task.subject.name}</div>
                    </div>
                  </div>

                  {/* Column 3: Date and Last Fill */}
                  <div className="col-12 col-md-2 mb-3 mb-md-0">
                    <div className="mb-2">
                      <div className="fw-bold text-center">Utolsó kitöltés dátuma:</div>
                      <div className="text-center">
                        {new Date(item.utolsoKitoltesDatum).toLocaleDateString("hu-HU")}
                      </div>
                    </div>
                    <div>
                      <div className="fw-bold text-center">Utolsó eredmény:</div>
                      <div className="text-center">{item.utolsoSikeres ? "✅" : "❌"}</div>
                    </div>
                  </div>

                  {/* Column 4: Pie Chart */}
                  <div className="col-12 col-md-2 d-flex flex-column justify-content-center align-items-center">
                    <PieChart width={100} height={100}>
                      <Pie
                        data={[
                          { name: "Helyes", value: correct },
                          { name: "Helytelen", value: incorrect },
                        ]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={40}
                        label={false}
                        isAnimationActive={false}
                      >
                        {[...Array(2)].map((_, i) => (
                          <Cell key={i} fill={COLORSsmall[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                    <div className="mt-2">{percentage}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};


const StatisticsPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={125} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const LineGraph = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="75%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis 
          dataKey="date"
          label={{ value: "Dátum", position: "insideBottom", offset: 5, dy: 10, style: { fill: 'white' } }} 
          tick={{ fill: "white"}}
        />
        <YAxis 
          label={{ value: "Kitöltött feladatlapok", angle: -90, position: "insideLeft", offset: 30, dy: 75, dx: -10, style: { fill: 'white' } }} 
          tick={{ fill: "white"}}
        />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};