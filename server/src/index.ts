
import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import { toNodeHandler } from "better-auth/node";
import { connectDB, getDB } from "./config/db.js";
import { auth } from "./lib/auth.js";
import { verifyJWT, type AuthRequest } from "./middleware/verifyJWT.js";
import { verifyAdmin } from "./middleware/verifyAdmin.js";
import { upload } from "./middleware/upload.js";
import { uploadImageCloude } from "./cloudenary/image_upload.js";
import multer from "multer";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SocialImpact API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

app.get("/api/protected", verifyJWT, (req: AuthRequest, res) => {
  res.status(200).json({
    success: true,
    message: "JWT verified successfully",
    user: req.user,
  });
});

app.post(
  "/api/profile/upload",
  verifyJWT,
  upload.single("image"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Profile image is required",
        });
        return;
      }

      const imageResult = await uploadImageCloude(req.file);

      res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        image: imageResult.secure_url,
        imagePublicId: imageResult.public_id,
      });
    } catch (error) {
      console.error("Profile image upload error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to upload profile image",
      });
    }
  }
);

app.get(
  "/api/admin",
  verifyJWT,
  verifyAdmin,
  (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

app.get("/api/events", async (req, res) => {
  try {
    const db = getDB();

    const events = await db
      .collection("events")
      .find({
        date: { $gt: new Date() },
      })
      .sort({ date: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Fetch events error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
});

app.get("/api/events/recent", async (req, res) => {
  try {
    const db = getDB();

    const events = await db
      .collection("events")
      .find({
        date: { $gt: new Date() },
      })
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Fetch recent events error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent events",
    });
  }
});

app.get("/api/events/my-events", verifyJWT, verifyAdmin, async (req: AuthRequest, res) => {
  try {
    const db = getDB();

    const events = await db
      .collection("events")
      .find({
        "organizer.id": req.user!.id,
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      total: events.length,
      events,
    });
  } catch (error) {
    console.error("Fetch my events error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your events",
    });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
      return;
    }

    const db = getDB();

    const event = await db.collection("events").findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Fetch event details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch event details",
    });
  }
});

app.patch("/api/events/:id",
  verifyJWT,
  verifyAdmin,
  upload.single("image"),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string" || !ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid event ID",
        });
        return;
      }
      if (!ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid event ID",
        });
        return;
      }

      const {
        title,
        category,
        description,
        date,
        location,
        volunteers,
      } = req.body;

      const allowedCategories = [
        "Donation",
        "Environment",
        "Healthcare",
        "Education",
        "Community",
      ];

      if (
        !title?.trim() ||
        !category?.trim() ||
        !description?.trim() ||
        !date ||
        !location?.trim() ||
        !volunteers
      ) {
        res.status(400).json({
          success: false,
          message: "All event fields are required",
        });
        return;
      }

      if (!allowedCategories.includes(category)) {
        res.status(400).json({
          success: false,
          message: "Invalid event category",
        });
        return;
      }

      const eventDate = new Date(date);
      const volunteerLimit = Number(volunteers);

      if (
        Number.isNaN(eventDate.getTime()) ||
        eventDate.getTime() <= Date.now()
      ) {
        res.status(400).json({
          success: false,
          message: "Please select a future event date",
        });
        return;
      }

      if (
        !Number.isSafeInteger(volunteerLimit) ||
        volunteerLimit < 1
      ) {
        res.status(400).json({
          success: false,
          message: "Volunteer limit must be a positive number",
        });
        return;
      }

      const db = getDB();

      const existingEvent = await db.collection("events").findOne({
        _id: new ObjectId(id),
        "organizer.id": req.user!.id,
      });

      if (!existingEvent) {
        res.status(404).json({
          success: false,
          message: "Event not found or you are not authorized",
        });
        return;
      }

      if (volunteerLimit < (existingEvent.joinedCount || 0)) {
        res.status(400).json({
          success: false,
          message: "Volunteer limit cannot be less than already joined volunteers",
        });
        return;
      }

      let image = existingEvent.image;
      let imagePublicId = existingEvent.imagePublicId;

      if (req.file) {
        const imageResult = await uploadImageCloude(req.file);

        image = imageResult.secure_url;
        imagePublicId = imageResult.public_id;
      }

      const result = await db.collection("events").updateOne(
        {
          _id: new ObjectId(id),
          "organizer.id": req.user!.id,
        },
        {
          $set: {
            title: title.trim(),
            category,
            description: description.trim(),
            date: eventDate,
            location: location.trim(),
            volunteers: volunteerLimit,
            image,
            imagePublicId,
            updatedAt: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        res.status(404).json({
          success: false,
          message: "Event not found or you are not authorized",
        });
        return;
      }

      const updatedEvent = await db.collection("events").findOne({
        _id: new ObjectId(id),
      });

      res.status(200).json({
        success: true,
        message: "Event updated successfully",
        event: updatedEvent,
      });
    } catch (error) {
      console.error("Update event error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update event",
      });
    }
  }
);

app.delete("/api/events/:id", verifyJWT, verifyAdmin, async (req: AuthRequest, res) => {
  try {

    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
      return;
    }

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
      return;
    }

    const db = getDB();

    const event = await db.collection("events").findOne({
      _id: new ObjectId(id),
      "organizer.id": req.user!.id,
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found or you are not authorized",
      });
      return;
    }

    await db.collection("events").deleteOne({
      _id: new ObjectId(id),
      "organizer.id": req.user!.id,
    });

    await db.collection("joinedEvents").deleteMany({
      eventId: new ObjectId(id),
    });

    if (event.imagePublicId) {
      const { v2: cloudinary } = await import("cloudinary");
      await cloudinary.uploader
        .destroy(event.imagePublicId)
        .catch((error) => {
          console.error("Cloudinary image deletion failed:", error);
        });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
});

app.post("/api/events",
  verifyJWT,
  verifyAdmin,
  upload.single("image"),
  async (req: AuthRequest, res) => {
    try {
      const {
        title,
        category,
        description,
        date,
        location,
        volunteers,
      } = req.body;

      if (
        !title?.trim() ||
        !category?.trim() ||
        !description?.trim() ||
        !date ||
        !location?.trim() ||
        !volunteers ||
        !req.file
      ) {
        res.status(400).json({
          success: false,
          message: "All fields and event image are required",
        });
        return;
      }

      const allowedCategories = [
        "Donation",
        "Environment",
        "Healthcare",
        "Education",
        "Community",
      ];

      if (!allowedCategories.includes(category)) {
        res.status(400).json({
          success: false,
          message: "Invalid event category",
        });
        return;
      }

      const eventDate = new Date(date);
      const volunteerLimit = Number(volunteers);

      if (
        Number.isNaN(eventDate.getTime()) ||
        eventDate.getTime() <= Date.now()
      ) {
        res.status(400).json({
          success: false,
          message: "Please select a future event date",
        });
        return;
      }

      if (
        !Number.isSafeInteger(volunteerLimit) ||
        volunteerLimit < 1
      ) {
        res.status(400).json({
          success: false,
          message: "Volunteer limit must be a positive number",
        });
        return;
      }

      const imageResult = await uploadImageCloude(req.file);

      if (!imageResult.secure_url || !imageResult.public_id) {
        res.status(500).json({
          success: false,
          message: "Event image upload failed",
        });
        return;
      }

      const db = getDB();

      const event = {
        title: title.trim(),
        category,
        description: description.trim(),
        date: eventDate,
        location: location.trim(),
        volunteers: volunteerLimit,
        image: imageResult.secure_url,
        imagePublicId: imageResult.public_id,
        organizer: {
          id: req.user!.id,
          name: req.user!.name,
          email: req.user!.email,
        },
        joinedCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection("events").insertOne(event);

      res.status(201).json({
        success: true,
        message: "Event created successfully",
        event: {
          ...event,
          _id: result.insertedId,
        },
      });
    } catch (error) {
      console.error("Create event error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create event",
      });
    }
  }
);

app.post("/api/joins", verifyJWT, async (req: AuthRequest, res) => {
  let joinId: ObjectId | null = null;

  try {
    const { eventId } = req.body;

    if (!eventId || !ObjectId.isValid(eventId)) {
      res.status(400).json({
        success: false,
        message: "Valid event ID is required",
      });
      return;
    }

    const db = getDB();
    const user = req.user!;

    const event = await db.collection("events").findOne({
      _id: new ObjectId(eventId),
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    if (new Date(event.date).getTime() <= Date.now()) {
      res.status(400).json({
        success: false,
        message: "This event is no longer available",
      });
      return;
    }

    const joinRecord = {
      eventId: event._id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      eventTitle: event.title,
      eventImage: event.image,
      eventDate: event.date,
      eventLocation: event.location,
      joinedAt: new Date(),
    };

    const joinResult = await db
      .collection("joinedEvents")
      .insertOne(joinRecord);

    joinId = joinResult.insertedId;

    const updateResult = await db.collection("events").updateOne(
      {
        _id: event._id,
        date: { $gt: new Date() },
        $expr: {
          $lt: ["$joinedCount", "$volunteers"],
        },
      },
      {
        $inc: { joinedCount: 1 },
        $set: { updatedAt: new Date() },
      }
    );

    if (updateResult.modifiedCount === 0) {
      await db.collection("joinedEvents").deleteOne({
        _id: joinId,
      });

      joinId = null;

      res.status(409).json({
        success: false,
        message: "This event is full or no longer available",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Successfully joined the event",
      join: {
        ...joinRecord,
        _id: joinId,
      },
    });
  } catch (error) {
    if (joinId) {
      await getDB()
        .collection("joinedEvents")
        .deleteOne({ _id: joinId })
        .catch(() => null);
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        success: false,
        message: "You have already joined this event",
      });
      return;
    }

    console.error("Join event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to join event",
    });
  }
});

app.get("/api/joins/my-events", verifyJWT, async (req: AuthRequest, res) => {
  try {
    const db = getDB();
    const user = req.user!;

    const joinedEvents = await db
      .collection("joinedEvents")
      .aggregate([
        {
          $match: {
            userId: user.id,
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "event",
          },
        },
        {
          $unwind: {
            path: "$event",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            eventDate: 1,
          },
        },
        {
          $project: {
            _id: 1,
            joinedAt: 1,
            eventId: 1,
            eventTitle: 1,
            eventImage: 1,
            eventDate: 1,
            eventLocation: 1,
            event: {
              _id: 1,
              title: 1,
              category: 1,
              description: 1,
              date: 1,
              location: 1,
              volunteers: 1,
              joinedCount: 1,
              image: 1,
            },
          },
        },
      ])
      .toArray();

    res.status(200).json({
      success: true,
      total: joinedEvents.length,
      joinedEvents,
    });
  } catch (error) {
    console.error("Fetch joined events error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch joined events",
    });
  }
});

app.use(
  (
    error: Error & { code?: string },
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({
          success: false,
          message: "Image size must be less than 5MB",
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message === "Only JPG, PNG and WEBP images are allowed") {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error("Server error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
);

const startServer = async () => {
  try {
    await connectDB();

    await getDB()
      .collection("joinedEvents")
      .createIndex(
        { eventId: 1, userId: 1 },
        { unique: true }
      );

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
