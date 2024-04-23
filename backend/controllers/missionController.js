const Mission=require('../models/missionModel');
const planModel = require('../models/planModel');
const jwt=require('jsonwebtoken');
  

const getAllMissions = async(req, res) => {
  const missions = await Mission.find({});
  return res.status(200).json(missions);
};

const ViewMission=async(req,res,next)=>{
    try{
      Mission.find({}) // pass the query object with the search criteria
        .exec() // execute the query
        .then(missions => {
          console.log(missions);
          res.json(missions);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Error retrieving schedules." });
        });
    } catch(err){
      console.log(err);
      res.status(500).json({ message: "Error retrieving schedules." });
    }
  }

  const ViewMissionIdList=async(req,res,next)=>{
    try {
        Mission.find({})
          .exec()
          .then((missions) => {
            const missionIds = missions.map((mission) => ({
              value: mission.mission_id,
              label: `Mission ${mission.mission_id}`,
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

  const CountMissions=async(req,res,next)=>{
    let missionscount;
    try{
      missionscount= await planModel.count({});
      console.log("Count of missions:",missionscount);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "Error retrieving Missions." });
      }
      return res.status(200).json(missionscount);
  }

//   const getMissions=async(req,res,next)=>{
//     let missions;
//     try{
//         missions=await Mission.find({});
//     }catch(err){
//         return new Error(err);
//     }
//     if(!missions){
//         return res.status(400).json({message:"Missions not found"})
//     }
//     return res.status(200).json({missions});
// }

const getMissions = async (req, res) => {
  let missions;
  try {
    missions = await Mission.find({}); 
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: "Error retrieving missions"});
  }

  if(!missions) {
    return res.status(404).json({message: "No missions found"}); 
  }

  return res.status(200).json({missions});
}

  
module.exports={getAllMissions, ViewMission,ViewMissionIdList,CountMissions,getMissions};