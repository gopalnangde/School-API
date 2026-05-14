import db from "../db/db.js";

const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({
      message: "Please fill all the fields",
    });
  }

  if (isNaN(longitude) || isNaN(latitude)) {
    return res.status(400).json({
      message: "Latitude and Longitude must be numbers",
    });
  }
  const query =
    "insert into school(name, address, latitude, longitude) values (?,?,?,?)";

  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    res
      .status(200)
      .json({ message: "School Added Successfully", id: result.insertId });
  });
};


function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}


const listSchool = (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude & Longitude required" });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  const query = "SELECT * FROM school";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const sortedSchools = results
      .map((school) => {
        const distance = getDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude,
        );

        return { ...school, distance };
      })
      .sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  });
};

export { addSchool, listSchool };
