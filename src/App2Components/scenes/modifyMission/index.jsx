import React, {useState, useEffect} from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import DeleteAllMissionPlans from "../deleteAllMissions";
import DeleteMissionById from "../deleteMissionById";
import TenantIdSingleton from "../../components/TenantId"
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MapIcon from '@mui/icons-material/Map';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";

function ModifyMissions() {
    
    const [missions, setMissions] = useState([{}]);
    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;
    const [docs, setDocs] = useState([]);
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    
    useEffect(() => {
        fetch(`http://localhost:5001/api/getAllMissionPlans/${TenantId}`)
        .then(res => res.json())
        .then(data => {setMissions(data)});
    }, []);
    

    const displayMissionPlans = missions.map((info) => {
        return (
            <tr>
                <td>{info.MissionId}</td>
                <td>{info.MissionType}</td>
                <td>{info.Location}</td>
                <td>{info.FlightHeight}</td>
                <td>{info.Alerts}</td>
            </tr>
        )
    })

    const sendRequest = async () => {
        const res = await axios.get(
            `http://localhost:5001/api/getAllMissionPlans/${TenantId}`
        );
        console.log('Data received from backend:', res.data);
        return res.data;
      };

      useEffect(() => {
        const exploreBtn = <div>onClick={e => alert("Hahaha")}</div>;
        console.log("getting data");
        async function fetchData() {
          const data = await sendRequest();
          const formattedData = data.map((item) => {
            const { _id, __v, ...rest } = item;
            return {
              ...rest,
              Location: rest?.waypoint?.location,
              Explore: exploreBtn
            };
          });
          setDocs(formattedData);
          console.log('Formatted data:', formattedData);
        }
        fetchData();
      }, []);

    // const deleteMission = async (MissionId) => {
    //     try {
    //       const response = await axios.delete(
    //         `http://localhost:5001/api/deleteMissionPlan/${MissionId}`,
    //         { withCredentials: true }
    //       );
    //       console.log("Mission deleted successfully:", response.data);
    //       setDocs(docs.filter((doc) => doc.MissionId !== MissionId));
    //     } catch (error) {
    //       console.error("Error deleting Mission:", error);
    //     }
    //   };
      
      const handleEdit = (row) => {
        console.log("Edit clicked for drone_id:", row.drone_id);
        navigate('/dashboard/editDrone', { state: { drone_info: row } });
      };
      
      
      // const handleDelete = async (MissionId) => {
      //   console.log("Delete clicked for MissionId:", MissionId);
      //   await deleteMission(MissionId);
      // };

    //   const handleDelete = async (id) => {
    //     try {
    //         const response = await axios.delete(`http://localhost:5001/api/missions/${id}`, { withCredentials: true });
    //         console.log("Mission deleted successfully:", response.data);
    //         setDocs(docs.filter((doc) => doc.MissionId !== id));
    //     } catch (error) {
    //         console.error("Error deleting mission:", error);
    //     }
    // };

      console.log("shakshi:",docs);
      console.log("shakshi2:",missions);

    const columns = [
        { field: "MissionId", headerName: "MissionId" },
        {
          field: "MissionType",
          headerName: "Mission Type",
          flex: 1,
          cellClassName: "name-column--cell",
        },
        {
          field: "Location",
          headerName: "Location",
          flex: 1,
          cellClassName: "name-column--cell",
        },
        {
          field: "Explore",
          headerName: "Explore",
          flex: 1,
          renderCell: (params) => {
            const onClickIcon = (e) => {
              e.stopPropagation();

              const missionId = params.api.getCellValue(params.id, "MissionId");
              const currRow = docs.find(doc => doc.MissionId === missionId);
              if(currRow?.waypoint) {
                navigate("/dashboard/MissionPlanner", {state: { serviceType: currRow.waypoint.service_type, droneId: currRow.waypoint.drone_id, tenantId: currRow.waypoint.tenant_id, missionId: currRow.waypoint.mission_id, waypointItems: currRow.waypoint.items }});
              }
              else {
                alert("Waypoint not set for the given mission");
              }
              
            };

            return <div style={{cursor: "pointer"}} onClick={onClickIcon}>
              <MapIcon sx={{ fontSize: "26px" }} />
            </div>;
          }
        },
      //   {
      //     field: 'delete',
      //     headerName: 'Delete',
      //     sortable: false,
      //     width: 100,
      //     renderCell: (params) => {
      //         const onClick = (e) => {
      //           e.stopPropagation();
      //           handleDelete(params.id);
      //         };
      //         return <IconButton onClick={onClick}><DeleteIcon /></IconButton>;
      //     },
      // },
      ];
    
      return (
        <Box m="20px">
          <Header title="Modify Mission Plans" />
          {docs.length > 0 ?
            <Box
              m="40px 0 0 0"
              height="75vh"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
                "& .name-column--cell": {
                  color: colors.greenAccent[700],
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: colors.blueAccent[300],
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.primary[600],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: colors.blueAccent[300],
                },
                "& .MuiCheckbox-root": {
                  color: `${colors.greenAccent[200]} !important`,
                },
              }}
            >
              <DataGrid checkboxSelection rows={docs} columns={columns} getRowId={(row) => row.MissionId} />
            </Box>
            :
            <Typography>Loading...</Typography>
          }
            {/* <br />
            <br />
            <h1>Manage Mission Plans:</h1>
            <br />
            <DeleteAllMissionPlans />
            <br />
            <br />
            <DeleteMissionById /> */}
        </Box>
        
      );
    };

export default ModifyMissions;