// const planModel = require('../models/planModel');

// create mission report
// exports.createMissionPlan = async (req, res) => {
//     const data = new planModel({
//         TenantId: req.body.TenantId,
//         MissionId: req.body.MissionId,
//         MissionType: req.body.MissionType,
//         Location: req.body.Location,
//         FlightPlanCoordinates: req.body.FlightPlanCoordinates,
//         FlightHeight: req.body.FlightHeight,
//         Alerts: req.body.Alerts
//     })

//     try {
//         console.log("[INFO] TenantID = " + req.body.TenantId + " | Received POST request: Create new Mission Plan");
//         const dataToSave = await data.save();
//         res.status(200).json(dataToSave);
//         console.log("[INFO] TenantID = " + req.body.TenantId + " | Successfully executed POST : created new Mission Plan");
//     }
//     catch(error) {
//         console.log("[ERROR] TenantID = " + req.body.TenantId + " | Failed to create new Mission Plan");
//         console.log(error);
//         res.status(400).json({message: error.message});
//     }
// }
 
// NEW CODE
const planModel = require('../models/planModel');
const Waypoint = require('../models/waypointSchema');

exports.getAllMissions = async(req, res) => {
    const missions = await planModel.find({});
    return res.status(200).json(missions);
  };

exports.createMissionPlan = async (req, res) => {
    const missionData = req.body; // Assuming the data sent from the frontend contains all necessary fields

    try {
        console.log("[INFO] TenantID = " + missionData.TenantId + " | Received POST request: Create new Mission Plan");

        // Create a new instance of the planModel using the data received from the frontend
        const data = new planModel(missionData);

        const dataToSave = await data.save();
        res.status(200).json(dataToSave);

        console.log("[INFO] TenantID = " + missionData.TenantId + " | Successfully executed POST: created new Mission Plan");
    } catch (error) {
        console.log("[ERROR] TenantID = " + missionData.TenantId + " | Failed to create new Mission Plan");
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

// exports.createMissionPlanNew = async (req, res) => {
//     const fs = require('fs');
//     const missionData = req.body;

//     if (!missionData.version || !missionData.defaults || !missionData.items) {
//         return res.status(400).json({ error: 'Missing required mission data fields.' });
//     }

//     // Define a file name, potentially based on input data or a timestamp to avoid overwriting
//     const fileName = `mission-${Date.now()}.json`;

//     // Convert the missionData object to a string
//     const dataString = JSON.stringify(missionData, null, 2); // Beautify the JSON output

//     // Write the string to a file
//     fs.writeFile(`./data/${fileName}`, dataString, 'utf8', (err) => {
//         if (err) {
//             console.error('Error writing file:', err);
//             return res.status(500).json({ error: 'Error writing mission data to file.' });
//         }

//         console.log('Mission data saved to', fileName);
//         return res.status(200).json({ message: 'Mission plan received and stored successfully.' });
//     });
// }

// Import the Mission model
// const Mission = require('../models/missionModel');

exports.createMissionPlanNew = async (req, res) => {
    const missionData = req.body;

    if (!missionData.version || !missionData.defaults || !missionData.items) {
        return res.status(400).json({ error: 'Missing required mission data fields.' });
    }

    try {
        // Create a new instance of the Mission model using the missionData
        const mission = new Waypoint(missionData);

        // Save the mission data to MongoDB
        const savedMission = await mission.save();

        // Respond with the saved mission data
        res.status(200).json(savedMission);
    } catch (error) {
        console.error('Error saving mission data:', error);
        res.status(500).json({ error: 'Failed to save mission data.' });
    }
};

// Define a function to save the waypoint data to MongoDB
// exports.saveWaypointData = async (req, res) => {
//   const waypointData = req.body; // Assuming the data sent from the frontend contains all necessary fields

//   try {
//     // Create a new instance of the Waypoint model using the data received from the frontend
//     const data = new Waypoint(waypointData);

//     // Save the data to MongoDB
//     const savedData = await data.save();

//     // Respond with the saved data
//     res.status(200).json(savedData);
//   } catch (error) {
//     console.error('Error saving waypoint data:', error);
//     res.status(400).json({ message: 'Failed to save waypoint data.' });
//   }
// };

// fetch all mission plans
exports.getAllMissionPlans = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Received GET request : fetching all mission plans");
        const data = await planModel.find(
            {TenantId: req.params.TenantId}
        );
        let planData = await fetchWaypointAndUpdateData(data);
        console.log("plan data: ", planData);
        res.json(planData);
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Successfully executed GET for all mission plans");
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.params.TenantId + " | Failed to execute GET for all mission plans");
        res.status(500).json({message: error.message});
    }
}

const fetchWaypointAndUpdateData = async(planData) => {
    console.log("1111111111-------: ", planData);
    const missionIds = planData.map(data => data.MissionId);
    const waypointsForMissions = await Waypoint.find({
        "mission_id": {
            $in: missionIds
        }
    });
    planData = planData.map((data) => {
        const waypoint = waypointsForMissions.find(wp => wp.mission_id === data.MissionId);
        if(waypoint) return {...data["_doc"], waypoint};
        return data;
    });
    return planData;
}

exports.getMissionPlanByMissionId = async (req, res) => {
    try {
        console.log("[INFO] MissionID = " + req.params.MissionId + " | Received GET request : fetching mission plan");
        const data = await planModel.find(
            {MissionId: req.params.MissionId}
        );
        let planData = await fetchWaypointAndUpdateData(data);
        console.log("plan data: ", planData);
        res.json(planData);
        console.log("[INFO] MissionID = " + req.params.MissionId + " | Successfully executed GET for mission plan");
    }
    catch(error) {
        console.log("[ERROR] MissionID = " + req.params.MissionId + " | Failed to execute GET for mission plan");
        res.status(500).json({message: error.message});
    }
}

// fetch mission plan by mission type
exports.getMissionsPlansByType = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Reveived GET request : fetching missions by type: " + req.params.MissionType);
        const data = await planModel.find(
            {MissionType: req.params.MissionType, TenantId: req.params.TenantId}
        );
        res.json(data);
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Successfully executed GET for missions by type: " + req.params.MissionType);
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.params.TenantId + " |  Failed to execute GET for mission plans by type: " + req.params.MissionType);
        res.status(500).json({message: error.message});
    }
}


// fetch mission plan by location
exports.getMissionsByLocation = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Received GET request : fetching missions for location: " + req.params.Location);
        const data = await planModel.find({Location: req.params.Location});
        res.json(data);
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Successfully executed GET for missions at location: " + req.params.Location);
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.params.TenantId + " | Failed to execute GET for missions at location: " + req.params.Location);
        res.status(500).json({message: error.message});
    }
}


// Update mission plan Alerts
exports.updateMissionAlerts = async (req, res) => {
    try {
        console.log("[INFO] Drone request | Received UPDATE request : updating mission alerts");
        const id = req.body.id;
        const updateData = {$push: {Alerts: req.body.Alerts} };
        const options = {new: true};

        const result = await planModel.findByIdAndUpdate(id, updateData, options);
        res.json(result);
        console.log("[INFO] Drone request | Successfully executed UPDATE for mission alerts");
    }
    catch(error) {
        console.log("[ERROR] Drone request |  Failed to execute UPDATE for mission alerts");
        res.status(500).json({message: error.message});
    }
}


// delete all missions
exports.deleteAllMissions = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Received DELETE request : delete all mission plans");
        const data = await planModel.deleteMany(
            {TenantId: req.params.TenantId}
        );
        res.status(200).json({message: "Deleted all mission plans"});
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Successfully executed DELETE for mission plans");
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.params.TenantId + " | Failed to execute DELETE for all mission plans");
        res.status(500).json({message: error.message});
    }
}


// delete mission plan by id
exports.deleteMissionPlanById = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Received DELETE request : delete mission plan with id: " + req.params.id);
        const data = await planModel.deleteMany(
            {MissionId: req.params.MissionId, TenantId: req.params.TenantId}
        );
        res.status(200).json({message: "Deleted mission plan with id: " + req.params.id});
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Successfully executed DELETE for mission plan with id: " + req.params.id);
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.params.TenantId + " | Failed to execite DELETE by mission plan id");
        res.status(500).json({message: error.message});
    }
}

exports.ViewMissionPlanIdList=async(req,res,next)=>{
    try {
        planModel.find({})
          .exec()
          .then((missions) => {
            const missionIds = missions.map((mission) => ({
              value: mission.MissionId,
              label: `Mission ${mission.MissionId}`,
            }));
            console.log(missionIds);
            res.json(missionIds);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error retrieving mission IDs." });
          });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving mission IDs." });
      }
  }

  exports.deleteMissionPlan = async (req, res, next) => {
    // const { id } = req.params;
    // console.log(id);
    try {
      const mission = await planModel.findOneAndDelete({ MissionId: req.params.MissionId });
      if (!mission) {
        console.log("Mission not found !");
        res.status(404).json({ message: "Mission not found" });
      } else {
        // console.log("Mission deleted successfully");
        console.log("MissionId in deleteMissionPlan:", req.params.MissionId);
        res.status(200).json({ message: "Mission deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting Mission:", error);
      res.status(500).json({ message: "Error deleting Mission" });
    }
  };
