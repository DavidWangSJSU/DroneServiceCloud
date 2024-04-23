const axios = require('axios');

const DATA_API_ID = '<YOUR_DATA_API_ID>';
const DATA_API_KEY = '<YOUR_DATA_API_KEY>';


const getCollections = async (req, res) => {
  try {
    const response = await axios.get(`https://data.mongodb-api.com/app/${DATA_API_ID}/endpoint/mgdata/v1/action/listCollections`, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': DATA_API_KEY,
      },
    });

    res.json(response.data.collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

const getCollectionDetails = async (req, res) => {
  const { collectionName } = req.params;

  try {
    const response = await axios.get(`https://data.mongodb-api.com/app/${DATA_API_ID}/endpoint/mgdata/v1/action/stats`, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': DATA_API_KEY,
      },
      data: {
        collection: collectionName,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching details for collection ${collectionName}:`, error);
    res.status(500).json({ error: `Failed to fetch details for collection ${collectionName}` });
  }
};

module.exports = {
  getCollections,
  getCollectionDetails,
};