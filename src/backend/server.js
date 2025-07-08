const express = require("express")
const { MongoClient } = require("mongodb")
const cors = require("cors")

const app = express()
const port = 3000


app.use(cors())
app.use(express.json())

const mongoUrl = "mongodb://localhost:27017"
const dbName = "csv_database" 
const collectionName = "csv_data" 

let db


MongoClient.connect(mongoUrl)
  .then((client) => {
    console.log("Connected to MongoDB")
    db = client.db(dbName)
  })
  .catch((error) => console.error("MongoDB connection error:", error))

// API endpoint to save CSV data
app.post("/api/csv-data", async (req, res) => {
  try {
    const csvData = req.body.data // Array of objects from your Angular app

    // Insert data (like INSERT INTO in MySQL)
    const result = await db.collection(collectionName).insertMany(csvData)

    res.json({
      success: true,
      message: `Inserted ${result.insertedCount} records`,
      insertedIds: result.insertedIds,
    })
  } catch (error) {
    console.error("Error inserting data:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// API endpoint to get all CSV data
app.get("/api/csv-data", async (req, res) => {
  try {
    // Find all documents (like SELECT * FROM table in MySQL)
    const data = await db.collection(collectionName).find({}).toArray()

    res.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error("Error fetching data:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// API endpoint to delete all data (for testing)
app.delete("/api/csv-data", async (req, res) => {
  try {
    // Delete all documents (like DELETE FROM table in MySQL)
    const result = await db.collection(collectionName).deleteMany({})

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} records`,
    })
  } catch (error) {
    console.error("Error deleting data:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
