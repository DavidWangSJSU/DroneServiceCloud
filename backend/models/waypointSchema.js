const mongoose = require('mongoose');

// Define the schema for your waypoint data
const waypointSchema = new mongoose.Schema({
  version: {
    type: Number,
    required: true
  },
  defaults: {
    aircraftType: {
      type: String,
      required: true
    },
    defaultTerrainAlt: {
      type: Number,
      required: true
    },
    defaultHeading: Number,
    defaultSpeed: {
      type: Number,
      required: true
    },
    defaultFrame: {
      type: Number,
      required: true
    }
  },
  items: [
    {
      coordinates: {
        type: [Number], // Assuming coordinates are an array of numbers
        required: true
      },
      pointName: {
        type: String,
        required: true
      },
      frame: {
        type: Number,
        required: true
      },
      altitude: {
        type: Number,
        required: false
      },
      delay: {
        type: Number,
        required: false
      },
      speed: {
        type: Number,
        required: false
      },
      hitRad: {
        type: Number,
        required: false
      },
      camera: {
        type: String,
        required: false
      },
    }
  ],
  location: {
    type: String,
    required: true
  },
  service_type: {
    type: String,
    required: true
  },
  drone_id: {
    type: String,
    required: true
  },
  tenant_id: {
    type: String,
    required: true
  },
  mission_id: {
    type: String,
    required: true
  }
});

// Create a Mongoose model based on the schema
module.exports= mongoose.model('Waypoint', waypointSchema);
