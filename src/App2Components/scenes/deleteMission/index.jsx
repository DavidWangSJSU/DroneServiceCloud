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


function DeleteMission() {
    
    const [missions, setMissions] = useState([]);
    const [selectedMission, setSelectedMission] = useState('');
    const [missionContent, setMissionContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;

    useEffect(() => {
      fetchMissions();
    }, []);
  
    const fetchMissions = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/getAllMissionPlans/${TenantId}`);
        const data = await response.json();
        setMissions(data);
      } catch (error) {
        console.error('Error fetching missions:', error);
      }
    };
  
    const deleteSelectedMission = async () => {
      try {
        console.log("Before deletion: ", missions);
        console.log("Deleting mission: ", selectedMission);
        console.log("call backend deleteMissionPlanById " + selectedMission + " user id " + TenantId);
        const response = await fetch(`http://localhost:5001/api/deleteMissionPlanById/${selectedMission}/${TenantId}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Deletion failed');
        }

        const updatedMissions = missions.filter(missionId => missionId !== selectedMission);
        setMissions(updatedMissions);
        setSelectedMission('');
        console.log("After deletion: ", updatedMissions);
      } catch (error) {
        console.error('Error deleting mission:', error);
      }
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
                    <option value="">Select a mission to delete</option>
                    {missions.map((mission, index) => (
                        <option key={index} value={mission}>
                            {mission}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={deleteSelectedMission}>Delete Selected Mission</button>
            {error && <p className="error">Error: {error}</p>}
        </div>
      );
}

export default DeleteMission;