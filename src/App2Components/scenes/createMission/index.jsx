// import React, {useState, useEffect} from "react";
// import axios from "axios";
// import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
// import { Formik } from "formik";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import Header from "../../components/Header";
// import { useNavigate } from 'react-router-dom';
// import TenantIdSingleton from "../../components/TenantId";
// import * as yup from "yup";


// function CreateMission() {
//     const [serviceType, setServiceType] = useState('Campus Perimeter Patrol');
//     const [drones, setDrones] = useState([]);
//     const [selectedDrone, setSelectedDrone] = useState('');
//     const navigate = useNavigate();
//     const userdetails = JSON.parse(window.sessionStorage.getItem("userdetails"));
//     const tenantId = userdetails.email;
//     const missionId = ""; // means to create a mission, if the mission planner is lauched from modify a mission, the missionId will have value
  
//     useEffect(() => {
//       const fetchDrones = async () => {
//         // Placeholder for fetching drone data based on serviceType
//         // Replace this with actual backend communication
//         const droneMapping = {
//           'Campus Perimeter Patrol': ["Drone001", "Drone002", "Drone005", "Drone009"],
//           'Crowd Monitoring': ["Drone003", "Drone007"],
//           'Building Inspection': ["Drone004", "Drone008"],
//           'Emergency response': ["Drone006", "Drone010"],
//           'Parking Lot Surveillance': ["Drone011", "Drone012"],
//           // Add other mappings as necessary
//         };
//         setDrones(droneMapping[serviceType] || []);
//         setSelectedDrone(droneMapping[serviceType] ? droneMapping[serviceType][0] : '');
//       };
  
//       fetchDrones();
//     }, [serviceType]);
  
//     const handleSubmit = (event) => {
//       event.preventDefault();
//       navigate('/dashboard/missionPlanner', { state: { serviceType, droneId: selectedDrone , tenantId, missionId} });
//     };
  
//     return (
//       <form onSubmit={handleSubmit}>
//         <label>
//           Service Type:
//           <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
//             <option value="Campus Perimeter Patrol">Campus Perimeter Patrol</option>
//             <option value="Crowd Monitoring">Crowd Monitoring</option>
//             <option value="Building Inspection">Building Inspection</option>
//             <option value="Emergency response">Emergency response</option>
//             <option value="Parking Lot Surveillance">Parking Lot Surveillance</option>
//           </select>
//         </label>
//         <br />
//         <label>
//           Drone ID:
//           <select value={selectedDrone} onChange={(e) => setSelectedDrone(e.target.value)}>
//             {drones.map(drone => (
//               <option key={drone} value={drone}>{drone}</option>
//             ))}
//           </select>
//         </label>
//         <br />
//         <input type="submit" value="Create Mission" />
//       </form>
//     );
// }

// export default CreateMission;

import React, {useState} from "react";
import axios from "axios";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
// import Map from "../ggleMapRender/Map";
import TenantIdSingleton from "../../components/TenantId";
import * as yup from "yup";
import { v4 as uuidv4 } from 'uuid';

function CreateMission() {

    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [missionOptions, setMissionOptions] = useState([
        { value: 'Campus Perimeter Patrol', label: 'Campus Perimeter Patrol' },
        { value: 'Crowd Monitoring', label: 'Crowd Monitoring' },
        { value: 'Building Inspection', label: 'Building Inspection' },
        { value: 'Emergency response', label: 'Emergency response' },
        { value: 'Parking Lot Surveillance', label: 'Parking Lot Surveillance' },
        { value: 'Fire Monitoring', label: 'Fire Monitoring' },
        { value: 'Agriculture', label: 'Agriculture' },
        { value: 'Traffic Control', label: 'Traffic Control' },
        { value: 'Infrastructure Inspection', label: 'Infrastructure Inspection' },
        { value: 'Powerline Inspection', label: 'Powerline Inspection' },
        { value: 'Search and Rescue', label: 'Search and Rescue' },
        { value: 'Industrial Site Monitoring', label: 'Industrial Site Monitoring' },
      ]);
      const [createdData, setCreatedData] = useState(null);

      const createmissiondata = [
        {
            Drone_id: 1,
            Drone_service_type: ["Parking Lot Surveillance", "Agriculture", "Traffic Control", "Building Inspection"]
        },
        {
            Drone_id: 2,
            Drone_service_type: ["Agriculture", "Fire Monitoring", "Emergency response"]
        },
        {
            Drone_id: 3,
            Drone_service_type: ["Crowd Monitoring", "Infrastructure Inspection", "Powerline Inspection"]
        },
        {
            Drone_id: 4,
            Drone_service_type: ["Infrastructure Inspection", "Building Inspection", "Industrial Site Monitoring", "Campus Perimeter Patrol"]
        },
        {
            Drone_id: 5,
            Drone_service_type: ["Infrastructure Inspection", "Building Inspection", "Search and Rescue"]
        },
        {
            Drone_id: 6,
            Drone_service_type: ["Crowd Monitoring", "Parking Lot Surveillance", "Traffic Control", "Campus Perimeter Patrol"]
        },
        {
            Drone_id: 7,
            Drone_service_type: ["Fire Monitoring", "Search and Rescue", "Emergency response"]
        },
        {
            Drone_id: 8,
            Drone_service_type: ["Powerline Inspection", "Industrial Site Monitoring", "Agriculture"]
        },
        {
            Drone_id: 9,
            Drone_service_type: ["Crowd Monitoring", "Parking Lot Surveillance", "Search and Rescue"]
        },
        {
            Drone_id: 10,
            Drone_service_type: ["Crowd Monitoring", "Emergency response", "Agriculture", "Campus Perimeter Patrol"]
        },
    ];

    const [availableDrones, setAvailableDrones] = useState([]);

    const handleMissionTypeChange = (selectedMissionType) => {
        // Filter drones based on the selected mission type
        const dronesForMission = createmissiondata.filter(
            (mission) => mission.Drone_service_type.includes(selectedMissionType)
        );
        setAvailableDrones(dronesForMission);
    };

    const checkoutSchema = yup.object().shape({
        // MissionId: yup.string().required("Required"),
        MissionType: yup.string().required("Required"),
    });

     const initialValues = {
        // MissionId: "",
        MissionType: "",
        Drones: [],
    };
    // const [errorMessage, setErrorMessage] = useState("");
    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;
    // /*
    const [inputData, setInputData] = useState({
        TenantId: TenantId,
        MissionId:"",
        MissionType: "",
        // Location:"",
        // FlightPlanCooridnates:"",
        // FlightHeight: "",
        // Alerts:""
        
    });

    const sendRequest = async (values) => {
        try {
            const response = await axios.post('http://localhost:5001/api/createMissionPlan', {
                // Modify the payload according to your backend requirements
                TenantId: TenantId,
                MissionId: values.MissionId,
                MissionType: values.MissionType,
                Drones: values.Drones
                // Add other form fields as needed
            });
    
            console.log(response.data);
            setCreatedData(response.data);
            return response.data;
        } catch (error) {
            console.error('Error submitting form data:', error);
            return null;
        }
    };
    

    const handleFormSubmit = async(values) => {
        console.log("----------------------values: ", values);
        //e.preventDefault();
        if (!values.MissionId) {
            values.MissionId = uuidv4(); 
        }
        console.log(values);
        const responseData = await sendRequest(values);
        if (responseData) {
            alert("Added mission plan to db!")
            navigate("/dashboard/MissionPlanner", {state: { serviceType: responseData.MissionType, droneId: responseData.Drones[0], tenantId: responseData.TenantId, missionId: responseData.MissionId}});
        }
    };

    return (
        <Box m="20px">
            <Header title="Create New Mission Plan" />
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema}
                >
                    {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Mission ID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.MissionId}
                                    name="MissionId"
                                    error={!!touched.MissionId && !!errors.MissionId}
                                    helperText={touched.MissionId && errors.MissionId}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    error={!!touched.MissionType && !!errors.MissionType}
                                    sx={{ gridColumn: "span 4" }}
                                >
                                    <InputLabel htmlFor="MissionType">Mission Type</InputLabel>
                                    <Select
                                    label="Mission Type"
                                    value={values.MissionType}
                                    onChange={(e) => {
                                        handleChange(e);
                                        handleMissionTypeChange(e.target.value);
                                    }}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        name: "MissionType",
                                        id: "MissionType",
                                    }}
                
                                    >
                                    {missionOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                    <FormHelperText>
                                    {touched.MissionType && errors.MissionType}
                                    </FormHelperText>
                                </FormControl>
                                
                                <FormControl
                            fullWidth
                            variant="filled"
                            sx={{ marginBottom: "20px" }}
                        >
                            <InputLabel htmlFor="DroneList">Available Drones</InputLabel>
                            <Select
                                label="Available Drones"
                                multiple
                                value={values.Drones || []}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    name: "Drones",
                                    id: "DroneList",
                                }}
                            >
                                {availableDrones.map((drone) => (
                                    <MenuItem key={drone.Drone_id} value={drone.Drone_id}>
                                        {`Drone ${drone.Drone_id}`}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                Select drone for the mission
                            </FormHelperText>
                        </FormControl>
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Create Mission Plan
                                </Button>
                            </Box>
                            {/* {errorMessage && (
                            <Box mt="10px">
                                <Typography color="error">{errorMessage}</Typography>
                            </Box>
                            )} */}
                            <br />
                            <br />
                        </form>
                    )}
                </Formik>
                {createdData ? 
                    <div>
                        Tenant: {createdData.TenantId} <br />
                        {/* Created At: {createdData.createdAt} <br /> */}
                        Created At: {new Date(createdData.createdAt).toLocaleString(undefined, { timeZoneName: 'short' })} <br />
                        Mission Type: {createdData.MissionType} <br />
                        Drones: {"[" + createdData.Drones.join(", ") + "]"}
                    </div> : ""}
                {/* <Map center={coords}/> */}
        </Box>
    )
};

export default CreateMission;
