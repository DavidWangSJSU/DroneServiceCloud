const Schedule=require('../models/scheduleModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const { Schedule1 } = require('@mui/icons-material');
const User=require('../models/userModel');
  
const getAllSchedules = async(req, res) => {
  const schedules = await Schedule.find({});
  return res.status(200).json(schedules);
};


const CreateSchedule=async(req,res,next)=>{
    const {schedule_id,start_time,end_time,mission_id,drone_id}=req.body;
    console.log(schedule_id,start_time,end_time,mission_id,drone_id);
    let existingSchedule;
    try{
        existingSchedule=await Schedule.findOne({schedule_id:schedule_id});
        console.log(existingSchedule);
    }catch(err){
        console.log(err);
    }
    if(existingSchedule){
        console.log("Schedule already exists");
        return res.status(400).json({message:"ScheduleID already exists"});
    }
    const schedule= new Schedule({
        schedule_id,
        start_time,
        end_time,
        mission_id,
        drone_id,
    });
    console.log("Adding Schedule");

    try{
        await schedule.save();
        console.log("saved");
    }catch (err){
        console.log(err);
    }

    return res.status(201).json({message:schedule});
}

const ViewSchedule=async(req,res,next)=>{
    try{
      Schedule.find({}) // pass the query object with the search criteria
        .exec() // execute the query
        .then(schedules => {
          console.log(schedules);
          res.json(schedules);
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

  const deleteSchedule = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    try {
      const schedule = await Schedule.findOneAndDelete({ schedule_id: id });
      if (!schedule) {
        console.log("Schedule not found");
        res.status(404).json({ message: "Schedule not found" });
      } else {
        console.log("Schedule deleted successfully");
        res.status(200).json({ message: "Schedule deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting Schedule:", error);
      res.status(500).json({ message: "Error deleting Schedule" });
    }
  };
  
  const editSchedule = async (req, res, next) => {
    const { id } = req.params;
    const { schedule_id,start_time,end_time,mission_id,drone_id } = req.body;
  
    try {
      const schedule = await Schedule.findOne({ schedule_id: id });
      if (!schedule) {
        res.status(404).json({ message: "Schedule not found" });
      } else {
        schedule.schedule_id = schedule_id || schedule.schedule_id;
        schedule.start_time = start_time || schedule.start_time;
        schedule.end_time = end_time || schedule.end_time;
        schedule.mission_id = mission_id || schedule.mission_id;
        schedule.drone_id = drone_id || schedule.drone_id;
  
        await schedule.save();
        res.status(200).json({ message: "Schedule updated successfully", schedule });
      }
    } catch (error) {
      console.error("Error editing Schedule:", error);
      res.status(500).json({ message: "Error editing Schedule" });
    }
  };
  
const verifyToken=(req,res,next)=>{
    const cookies=req.headers.cookie;
    console.log("Cookie:",cookies);
    const token=cookies.split('=')[1];
    // const headers=req.headers["authorization"];
    // console.log("Headers:",headers);
    // const token=headers.split(" ")[1];
    if(!token){
        return res.status(400).json({message:'Token not found'})
    }
    jwt.verify(String(token),"shakshi",(err,user)=>{
        if(err){
            return res.status(400).json({message:"Invalid token"})
        }
        console.log("User Id:",user.id);
        req.id=user.id;
    })
    next();
}

const getUser=async(req,res,next)=>{
    const userId=req.id;
    let user;
    try{
        user=await User.findById(userId,"-password");
    }catch(err){
        return new Error(err);
    }
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
    return res.status(200).json({user});
}

module.exports={getAllSchedules, CreateSchedule,ViewSchedule,deleteSchedule, editSchedule,verifyToken,getUser};