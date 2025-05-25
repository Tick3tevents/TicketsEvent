import http from "http";
import express, { type Express, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";

import { getKeypairFromEnvironment } from "./getKeyPair";
import 'dotenv/config';
import connectDB from "./db/schemas/mongoose";
import { createEvent } from "./db/schemas/controllers/event.controller";

connectDB();

const PORT = process.env.PORT || 3001;
const app: Express = express();

app.use(helmet());
app.use(express.json({ limit: "20mb" }));
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "*",
    methods: ["GET", "POST"],
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const httpServer = http.createServer(app);

app.use("/api", apiLimiter);

app.get("/health", (_req: Request, res: Response) => { // Added underscore to _req
    res.status(200).json({ status: "ok" });
});

// @ts-ignore
app.post("/api/create", upload.fields([{ name: 'bannerImage', maxCount: 1 }, { name: 'logoImage', maxCount: 1 }]), async (req: Request, res: Response) => {
    const appKeyPair = await getKeypairFromEnvironment();
    try {
      if (!appKeyPair) {
        return res.status(500).json({ error: "Server keypair not configured." });
      }

      const rawEventData = req.body as unknown as {
        title: string;
        description: string;
        category: string;
        locationType: 'physical' | 'virtual';
        location: string;
        startDate: string;
        startTime: string;
        endDate?: string;
        endTime?: string;
        ticketTiers: string;
        defaultRoyaltyPercent: string;
        allowResale: string;
        useWhitelist: string;
        organizerWalletAddress: string;
      };
      const newEvent = await createEvent(rawEventData);

      res.status(200).json({ message: "Event created successfully!", eventId: newEvent._id });

    } catch (error: any) {
      console.error("Error creating event:", error);
      if (error.message.startsWith('Validation Error:')) {
        return res.status(400).json({ error: "Validation Failed", details: error.message.replace('Validation Error: ', '') });
      }
      res.status(500).json({ error: "Internal Server Error", details: error.message || "An unexpected error occurred." });
    }
  });

httpServer.listen(PORT, () => {
    console.log(`🚀 Backend server is ready http://localhost:${PORT}`);
});