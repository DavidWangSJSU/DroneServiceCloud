import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, TextField, InputAdornment } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
// can use API Here instead of Mockdata
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from 'date-fns';
import SearchIcon from "@mui/icons-material/Search";



const ViewSchedules = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columnHeadersStyles = {
    backgroundColor: colors.blueAccent[300],
    borderBottom: "none",
    "& .MuiDataGrid-columnHeader": {
      fontSize: "1.2rem",
      fontWeight: "bold",
    },
  };

  const cellStyles = {
    borderBottom: "none",
    fontSize: "1rem",
  };

  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [currDocs, setCurrDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModel, setFilterModel] = useState({
    items: [
      {
        columnField: "schedule_id",
        operatorValue: "contains",
        value: "",
      },
    ],
  });
  const sendRequest = async () => {
    const res = await axios.get(
      "http://localhost:5001/api/viewschedule",
      { withCredentials: true }
    );
    console.log('Data received from backend:', res.data);
    return res.data;
  };

  const deleteSchedule = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/schedules/${id}`,
        { withCredentials: true }
      );
      console.log("Drone deleted successfully:", response.data);
      setDocs(docs.filter((doc) => doc.schedule_id !== id));
      setCurrDocs(docs.filter((doc) => doc.schedule_id !== id));
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };
  
  const handleEdit = async (row) => {
    console.log("Edit clicked for schedule_id:", row.schedule_id);
    navigate('/dashboard/editSchedule', { state: { schedule_info: row } });
  };
  
  
  const handleDelete = async (id) => {
    console.log("Delete clicked for schedule_id:", id);
    await deleteSchedule(id);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if(!searchValue) setCurrDocs(docs);
    else {
      const searchedDocs = docs.filter(doc => doc.schedule_id?.toLowerCase() === searchValue?.toLowerCase());
      setCurrDocs(searchedDocs);
    }
    setFilterModel({
      items: [
        {
          columnField: "schedule_id",
          operatorValue: "contains",
          value: searchValue,
        },
      ],
    });
  };

  const navigateToCreateSchedule = () => {
    navigate('/dashboard/CreateSchedule');
  };
  
  useEffect(() => {
    async function fetchData() {
      const data = await sendRequest();
      const formattedData = data.map((item) => {
        const { _id, __v, ...rest } = item;
        return {
          ...rest,
          start_time: format(new Date(item.start_time), 'yyyy/MM/dd HH:mm:ss'),
          end_time: format(new Date(item.end_time), 'yyyy/MM/dd HH:mm:ss'),
        };
      });
      setDocs(formattedData);
      setCurrDocs(formattedData);
      console.log('Formatted data:', formattedData);
    }
    fetchData();
  }, []);
  
  
  

  const columns = [
    { field: "schedule_id", 
    headerName: "ScheduleId", 
    flex:0.7, 
    filterOperators: [
      {
        label: "Equals",
        value: "equals",
        getApplyFilterFn: (filterItem) => (params) => params.value === filterItem.value,
      },
      {
        label: "Contains",
        value: "contains",
        getApplyFilterFn: (filterItem) => (params) =>
          String(params.value).toLowerCase().includes(String(filterItem.value).toLowerCase()),
        // method: (scheduleId, value) => scheduleId.includes(value),
      },
    ],},
    {
      field: "start_time",
      headerName: "Start Time",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "end_time",
      headerName: "End Time",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      valueGetter: (params) => {
        const start = new Date(params.row.start_time);
        const end = new Date(params.row.end_time);
        const duration = end.getTime() - start.getTime();
        const durationInSeconds = Math.floor(duration / 1000);
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
      },
    },
    {
      field: "mission_id",
      headerName: "Mission ID",
      flex: 1,
    },
    {
      field: "drone_id",
      headerName: "Drone ID",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(params.row.schedule_id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },    
  ];

  return (
    <Box m="20px">
      <Header title="View Schedules" />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by Schedule ID..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ position: 'absolute', top: 100, right: 30 }}>
        <Button variant="contained" color="primary" onClick={navigateToCreateSchedule} sx={{
        borderRadius: '8px', // Add border radius
        backgroundColor: '#4CAF50', // Change color to your desired color
      '&:hover': {
        backgroundColor: '#388E3C', // Change hover color
      },
    }}>
          <Typography variant="button" fontWeight="bold">+ Add Schedule</Typography>
        </Button>
      </Box>
      {currDocs.length > 0 ?
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": cellStyles,
          "& .name-column--cell": {
            color: colors.greenAccent[700],
          },
          "& .MuiDataGrid-columnHeaders": columnHeadersStyles,
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
          <DataGrid 
          checkboxSelection 
          rows={currDocs} 
          columns={columns} 
          getRowId={(row) => row.schedule_id} 
          filterModel={filterModel}
            onFilterModelChange={(newModel) => {
              setFilterModel(newModel);
            }}
          />
        </Box>
        :
        <Typography>Loading...</Typography>
      }
    </Box>
  );
};

export default ViewSchedules;
