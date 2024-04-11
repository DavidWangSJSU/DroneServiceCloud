import React, {useState, useEffect} from "react";
import $ from 'jquery';
import axios from "axios";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import TenantIdSingleton from "../../components/TenantId";
import * as yup from "yup";


function ModifyMission() {
  // Step 1: Set up state management
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState('');
  const [missionContent, setMissionContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
  const TenantId=userdetails.email;

  useEffect(() => {
      fetch(`http://localhost:5001/api/getAllMissionPlans/${TenantId}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => setMissions(data))
          .catch(error => setError(error.message));
  }, []);

  const loadMissionAndGoToMissionPlanner = () => {

    if (!selectedMission) {
        alert('Please select a mission first!');
        return;
    }

    fetch(`http://localhost:5001/api/getMissionPlanContent/${selectedMission}`)
        .then(response => response.json())
        .then(data => {
          let missionContent;
          missionContent = JSON.parse(data.content);
          setMissionContent(data.content);
          let serviceType = missionContent.service_type;
          let droneId = missionContent.drone_id;
          let tenantId = missionContent.tenant_id;
          let missionId = missionContent.mission_id;

          navigate('/dashboard/missionPlanner', { state: { serviceType, droneId, tenantId, missionId} });
        })
        .catch(error => setError(error.message));
  };

  return (
    <div>
        <h1>Mission Loader</h1>
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
            <select
                size="20" // Display 10 options at a time
                style={{ width: '100%', overflowY: 'auto' }}
                value={selectedMission}
                onChange={e => setSelectedMission(e.target.value)}
            >
                <option value="">Select a mission</option>
                {missions.map((mission, index) => (
                    <option key={index} value={mission}>
                        {mission}
                    </option>
                ))}
            </select>
        </div>
        <button onClick={loadMissionAndGoToMissionPlanner}>Load Selected Mission</button>
        {error && <p className="error">Error: {error}</p>}
        {missionContent && <div><h2>Mission Content:</h2><pre>{missionContent}</pre></div>}
    </div>
  );
}

export default ModifyMission;