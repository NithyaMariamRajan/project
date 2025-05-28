import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import FormData from "./formdata.js";
import NodeGeocoder from "node-geocoder";
import Guide from "./guide.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
  httpAdapter: "https",
  formatter: null,
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🗄️ MongoDB connected successfully");

    // First clean up invalid documents
    await cleanupInvalidDocuments();

    // Then create indexes
    await mongoose.model("TouristInfo").collection.createIndex({
      location: "2dsphere",
    });
    console.log("✅ Geospatial index created");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

async function cleanupInvalidDocuments() {
  try {
    const invalidDocs = await mongoose.model("TouristInfo").find({
      $or: [
        { "location.type": { $exists: false } },
        { "location.coordinates": { $exists: false } },
        { location: { $type: "string" } },
      ],
    });

    if (invalidDocs.length > 0) {
      console.log(`Found ${invalidDocs.length} invalid documents to clean up`);

      for (const doc of invalidDocs) {
        try {
          // Try to geocode the location if it's a string
          if (typeof doc.location === "string") {
            const geocoded = await geocodeAddress(doc.location);
            if (geocoded) {
              await mongoose
                .model("TouristInfo")
                .updateOne({ _id: doc._id }, { $set: { location: geocoded } });
              console.log(`Updated document ${doc._id}`);
            } else {
              // If geocoding fails, delete the invalid document
              await mongoose.model("TouristInfo").deleteOne({ _id: doc._id });
              console.log(`Deleted invalid document ${doc._id}`);
            }
          } else {
            // Delete documents with invalid location format
            await mongoose.model("TouristInfo").deleteOne({ _id: doc._id });
            console.log(`Deleted invalid document ${doc._id}`);
          }
        } catch (err) {
          console.error(`Error processing document ${doc._id}:`, err.message);
        }
      }
    }
  } catch (error) {
    console.error("Error during document cleanup:", error);
  }
}

async function geocodeAddress(address) {
  try {
    const geoData = await geocoder.geocode(address);
    if (geoData.length === 0) {
      throw new Error(`No coordinates found for address: ${address}`);
    }
    return {
      type: "Point",
      coordinates: [geoData[0].longitude, geoData[0].latitude],
    };
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return null;
  }
}

app.post("/api/tourist-info", async (req, res) => {
  try {
    if (!req.body.name || !req.body.location) {
      return res.status(400).json({
        success: false,
        message: "Name and location are required fields",
      });
    }

    const geocodedLocation = await geocodeAddress(req.body.location);
    if (!geocodedLocation) {
      return res.status(400).json({
        success: false,
        message: "Could not determine coordinates for this location",
      });
    }

    const formData = {
      name: req.body.name,
      location: geocodedLocation,
      preferredTransport: req.body.preferredTransport,
      otherTransport: req.body.otherTransport,
      preferredTime: req.body.preferredTime,
      interests: req.body.interests || [],
      additionalNotes: req.body.additionalNotes || "",
    };

    const newFormData = new FormData(formData);
    const savedData = await newFormData.save();

    res.status(201).json({
      success: true,
      message: "Tourist information saved successfully",
      data: savedData,
    });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save tourist information",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.get("/api/user-spots", async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // First try geospatial query
    try {
      const spots = await FormData.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: parseFloat(radius) * 1000,
          },
        },
      })
        .limit(50)
        .lean();

      return res.status(200).json({
        success: true,
        count: spots.length,
        data: spots,
      });
    } catch (geoError) {
      console.log("Geospatial query failed, falling back to simple query");
      // Fallback to non-geospatial query
      const spots = await FormData.find({}).limit(50).lean();
      return res.status(200).json({
        success: true,
        count: spots.length,
        data: spots,
      });
    }
  } catch (error) {
    console.error("Error in /api/user-spots:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby spots",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "Healthy",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date(),
  });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  });
};

// Add this new route to your existing server.js
app.post("/api/guides", async (req, res) => {
  try {
    const { name, age, gender, location, mobile, email } = req.body;

    // Basic validation
    if (!name || !age || !gender || !location || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create a new guide document
    const newGuide = new Guide({
      name,
      age: parseInt(age),
      gender,
      location,
      mobile,
      email,
      createdAt: new Date(),
    });

    // Save to database
    const savedGuide = await newGuide.save();

    res.status(201).json({
      success: true,
      message: "Guide registered successfully",
      data: savedGuide,
    });
  } catch (error) {
    console.error("Error saving guide:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register guide",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.get("/api/guides", async (req, res) => {
  try {
    const guides = await Guide.find({}).lean();
    res.status(200).json({
      success: true,
      data: guides,
    });
  } catch (error) {
    console.error("Error fetching guides:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch guides",
    });
  }
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

startServer();
