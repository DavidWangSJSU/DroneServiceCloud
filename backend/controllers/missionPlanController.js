const planModel = require('../models/planModel');

// create mission report
exports.createMissionPlan = async (req, res) => {
    const data = new planModel({
        TenantId: req.body.TenantId,
        MissionId: req.body.MissionId,
        MissionType: req.body.MissionType,
        Location: req.body.Location,
        FlightPlanCoordinates: req.body.FlightPlanCoordinates,
        FlightHeight: req.body.FlightHeight,
        Alerts: req.body.Alerts
    })

    try {
        console.log("[INFO] TenantID = " + req.body.TenantId + " | Received POST request: Create new Mission Plan");
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
        console.log("[INFO] TenantID = " + req.body.TenantId + " | Successfully executed POST : created new Mission Plan");
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.body.TenantId + " | Failed to create new Mission Plan");
        res.status(400).json({message: error.message});
    }
}

exports.createMissionPlanNew = async (req, res) => {
    const fs = require('fs');
    const missionData = req.body;

    if (!missionData.version || !missionData.defaults || !missionData.items) {
        return res.status(400).json({ error: 'Missing required mission data fields.' });
    }

    // Define a file name, potentially based on input data or a timestamp to avoid overwriting
    const timeStamp = Date.now();
    var timeStampStr = timeStamp.toString();

    console.log("backend receive mission: ", missionData);
    console.log("try to access directly:", missionData.service_type, missionData.drone_id, missionData.tenant_id, missionData.mission_id, missionData.location);

    let mission_data = missionData

    if (mission_data.mission_id === "")
        mission_data.mission_id = timeStampStr;
    else
        timeStampStr = mission_data.mission_id;

    const fileName = `mission-${timeStampStr}.json`;

    // Convert the missionData object to a string
    const dataString = JSON.stringify(mission_data, null, 2); // Beautify the JSON output

    // Write the string to a file
    fs.writeFile(`./data/${fileName}`, dataString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Error writing mission data to file.' });
        }

        console.log('Mission data saved to', fileName);

        // extract serviceType, droneId, tenantId. missionId from the mission object
        const serviceType = mission_data.service_type;
        const droneId = mission_data.drone_id;
        const tenantId = mission_data.tenant_id;
        const missionId = mission_data.mission_id;
        const location = mission_data.location;

        console.log("Need create mission in cloud DB with parameters: ", fileName, serviceType, droneId, tenantId, missionId, location)

        // TBD: create cloud DB records for the mission_data

        return res.status(200).json({ message: 'Mission plan received and stored successfully.' });
    });
}

// fetch all mission plans
exports.getAllMissionPlans = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Received GET request : fetching all mission plans");
        const data = await planModel.find(
            {TenantId: req.params.TenantId}
        );
        res.json(data);
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Successfully executed GET for all mission plans");
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.params.TenantId + " | Failed to execute GET for all mission plans");
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