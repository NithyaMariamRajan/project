import mongoose from "mongoose";

const formDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (coords) {
            return (
              coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])
            );
          },
          message:
            "Coordinates must be an array of two numbers [longitude, latitude]",
        },
      },
    },
    preferredTransport: {
      type: String,
      enum: ["train", "flight", "car", "others"],
      required: true,
    },
    otherTransport: {
      type: String,
      default: "",
    },
    preferredTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    additionalNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes
formDataSchema.index({ location: "2dsphere" });

// Add text index for search if needed
formDataSchema.index(
  { name: "text", additionalNotes: "text" },
  { weights: { name: 10, additionalNotes: 2 } }
);

export default mongoose.model("TouristInfo", formDataSchema);
