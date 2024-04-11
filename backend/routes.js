const express=require('express');
const userFunctions=require('./controllers/userController');
const scheduleFunctions=require('./controllers/scheduleController');
const missionFunctions=require('./controllers/missionController');

const mapFunctions= require('./controllers/mapController');
const plannerFunctions = require('./controllers/missionPlanController');

const droneFunctions=require('./controllers/droneController');

const router=express.Router();


router.get('/',(req,res,next)=>{
    res.send('Hello Shakshi');
})

router.post('/signup',userFunctions.signup);
router.post('/login',userFunctions.login);
router.post('/addschedule',scheduleFunctions.CreateSchedule);
router.get('/viewschedule',scheduleFunctions.ViewSchedule);
router.delete("/schedules/:id", scheduleFunctions.deleteSchedule);
router.put("/schedules/:id", scheduleFunctions.editSchedule);
router.post('/adddrone',droneFunctions.createDrone);
router.delete("/drones/:id", droneFunctions.deleteDrone);
router.put("/drones/:id", droneFunctions.editDrone);
router.get('/viewdrone',droneFunctions.ViewDrone);
router.get("/countdrones",droneFunctions.CountDrones);
router.get('/missionOptions',plannerFunctions.ViewMissionPlanIdList);
router.get('/droneOptions',droneFunctions.ViewDroneIdList);
router.get('/user',userFunctions.verifyToken,userFunctions.getUser);
router.get('/getuserProfile/:email',userFunctions.getUserProfile);

// POST - add map to db
router.post('/addMap', mapFunctions.uploadMap);
// GET - get map by name
router.get('/getMapByName', mapFunctions.getMapByName);
// GET - get all maps
router.get('/getAllMaps/:TenantId', mapFunctions.getAllMaps);
// GET - get map long and lat by name
router.get('/getMapLongLatByName', mapFunctions.getMapLatLong);
// DELETE - delete map by name
router.delete('/deleteMapByName', mapFunctions.deleteMapByName);
// DELETE - delete all maps
router.delete('/deleteAllMaps/:TenantId', mapFunctions.deleteAllMaps);
// POST - add new mission plan
router.post('/createMissionPlan', plannerFunctions.createMissionPlan);
router.post('/createMissionPlanNew', plannerFunctions.createMissionPlanNew);
// GET - get all mission plans
router.get('/getAllMissionPlans/:TenantId', plannerFunctions.getAllMissionPlans);
// Get content of a mission
router.get('/getMissionPlanContent/:MissionFileName', plannerFunctions.getMissionPlanContent);
// Get content of a mission by id
router.get('/getMissionPlanContentById/:MissionId', plannerFunctions.getMissionPlanContentById);
// GET - get mission plans by mission-type
router.get('/getMissionPlansByType/:TenantId/:MissionType', plannerFunctions.getMissionsPlansByType);
// GET - get mission plan by Location
router.get('/getMissionPlansByLocation/:TenantId/:Location', plannerFunctions.getMissionsByLocation);
// UPDATE - update mission alerts by id
router.put('/updateMissionAlertsById', plannerFunctions.updateMissionAlerts);
// DELETE - delete all missions plans
router.delete('/deleteAllMissionPlans/:TenantId', plannerFunctions.deleteAllMissions);
// DELETE - delete mission plan by id
router.delete('/deleteMissionPlanById/:MissionId/:TenantId', plannerFunctions.deleteMissionPlanById);

router.get("/countusers",userFunctions.CountUsers);
router.get("/countmissions",missionFunctions.CountMissions);
router.get("/getmissions",missionFunctions.getMissions);

module.exports=router;
