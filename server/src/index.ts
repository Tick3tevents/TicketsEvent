import http from "http";
import express, { type Express, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";

import { getKeypairFromEnvironment } from "./getKeyPair";
import 'dotenv/config';
import connectDB from "./db/schemas/mongoose";
import {
    createEvent,
    getEventDetails,
    getEventsByOrganizerWallet,
    updateEventDetails,
    processPurchase,
    type PurchaseInputData,
    getAllPublicEvents
} from "./db/schemas/controllers/event.controller";

connectDB();

const PORT = process.env.PORT || 3001;
const app: Express = express();

app.use(helmet());
app.use(express.json({ limit: "20mb" }));
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "*",
    methods: ["GET", "POST", "PUT"],
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

app.get("/health", (_req: Request, res: Response) => {
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
      const newEvent = await createEvent({
        ...rawEventData,
      });

      res.status(200).json({ message: "Event created successfully!", eventId: newEvent._id });

    } catch (error: any) {
      console.error("Error creating event:", error);
      if (error.message.startsWith('Validation Error:')) {
        return res.status(400).json({ error: "Validation Failed", details: error.message.replace('Validation Error: ', '') });
      }
      res.status(500).json({ error: "Internal Server Error", details: error.message || "An unexpected error occurred." });
    }
  });

// @ts-ignore
app.get("/api/events/by-organizer/:walletAddress", async (req: Request, res: Response) => {
    try {
        const { walletAddress } = req.params;

        if (!walletAddress) {
            return res.status(400).json({ error: "Organizer wallet address is required." });
        }

        const events = await getEventsByOrganizerWallet(walletAddress);

        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this organizer." });
        }

        res.status(200).json(events);

    } catch (error: any) {
        console.error("Error fetching events by organizer wallet:", error);
        if (error.message.includes('Organizer wallet address is required')) {
             return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal Server Error", details: error.message || "An unexpected error occurred." });
    }
});

app.get("/api/events", async (_req: Request, res: Response) => {
    try {
      const events = await getAllPublicEvents();
      res.status(200).json(events);
    } catch (error: any) {
      console.error("Error fetching public events:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  });

// @ts-ignore
app.get("/api/events/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required." });
    }
    const eventDetails = await getEventDetails(eventId);
    if (!eventDetails) {
      return res.status(404).json({ error: "Event not found." });
    }
    res.status(200).json(eventDetails);
  } catch (error: any) {
    console.error("Error fetching event details:", error);
    if (error.message === 'Event not found.') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// @ts-ignore
app.put("/api/events/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const updateData = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required." });
    }
    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "Update data is required." });
    }

    const updatedEvent = await updateEventDetails(eventId, updateData);

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found or failed to update." });
    }
    res.status(200).json(updatedEvent);
  } catch (error: any) {
    console.error("Error updating event:", error);
    if (error.message.includes('Event not found')) {
        return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// @ts-ignore
app.post("/api/purchase", async (req: Request, res: Response) => {
    try {
      const purchaseData: PurchaseInputData = req.body;

      if (!purchaseData.eventId || !purchaseData.ticketTierId || !purchaseData.purchaserWalletAddress || typeof purchaseData.quantity !== 'number' || purchaseData.quantity <= 0) {
          return res.status(400).json({ error: "Invalid purchase data. Required fields: eventId, ticketTierId, purchaserWalletAddress, and a positive quantity." });
      }

      const newPurchase = await processPurchase(purchaseData);
      res.status(201).json({ message: "Purchase successful!", purchase: newPurchase });
    } catch (error: any) {
      console.error("Error processing purchase endpoint:", error);
      if (error.message.includes('Invalid Event ID') ||
          error.message.includes('Invalid Ticket Tier ID') ||
          error.message.includes('Purchaser wallet address is required') ||
          error.message.includes('Quantity must be a positive integer') ||
          error.message.includes('Invalid purchase data')) {
          return res.status(400).json({ error: "Validation Failed", details: error.message });
      }
      if (error.message.includes('Event not found') || error.message.includes('Ticket tier not found')) {
          return res.status(404).json({ error: "Resource Not Found", details: error.message });
      }
      if (error.message.includes('not currently published') || error.message.includes('has already ended')) {
          return res.status(403).json({ error: "Purchase Forbidden", details: error.message });
      }
      if (error.message.includes('Not enough tickets available')) {
          return res.status(409).json({ error: "Conflict", details: error.message });
      }
      res.status(500).json({ error: "Internal Server Error", details: error.message || "An unexpected error occurred during purchase." });
    }
  });

httpServer.listen(PORT, () => {
    console.log(`🚀 Backend server is ready http://localhost:${PORT}`);
});