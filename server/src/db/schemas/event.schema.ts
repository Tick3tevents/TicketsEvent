import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITicketTier {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  priceSOL: number;
  supply: number;
  ticketsSold: number;
  perks?: string;
  resaleAllowed: boolean;
  royaltyPercent: number;
  revenueSOL: number;
  purchaseIds?: Types.ObjectId[];
}

export interface IEvent extends Document {
  organizerWalletAddress: string;
  title: string;
  description: string;
  category: string;
  locationType: 'physical' | 'virtual';
  location: string;
  startDate: Date;
  startTime: string;
  endDate?: Date;
  endTime?: string;
  bannerImage?: string;
  logoImage?: string;
  defaultRoyaltyPercent: number;
  allowResale: boolean;
  useWhitelist: boolean;
  status: 'draft' | 'published' | 'ended' | 'cancelled';
  previewMode: boolean;
  totalTicketsSold: number;
  totalCapacity: number;
  totalRevenueSOL: number;
  totalRoyaltiesEarnedSOL: number;
  totalAttendeesCheckedIn: number;
  ticketTiers: ITicketTier[];
  createdAt: Date;
  updatedAt: Date;
}

const ticketTierSchemaInstance = new Schema<ITicketTier>({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  priceSOL: { type: Number, required: true, min: 0 },
  supply: { type: Number, required: true, min: 1 },
  ticketsSold: { type: Number, default: 0 },
  perks: { type: String },
  resaleAllowed: { type: Boolean, default: true },
  royaltyPercent: { type: Number, min: 0, max: 15, default: 5 },
  revenueSOL: { type: Number, default: 0 },
  purchaseIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Purchase',
  }],
}, { _id: true });

const eventSchema = new Schema<IEvent>({
  organizerWalletAddress: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  locationType: {
    type: String,
    enum: ['physical', 'virtual'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
  endTime: {
    type: String,
    required: false,
  },
  bannerImage: {
    type: String,
    required: false,
  },
  logoImage: {
    type: String,
    required: false,
  },
  defaultRoyaltyPercent: {
    type: Number,
    min: 0,
    max: 15,
    default: 5,
  },
  allowResale: {
    type: Boolean,
    default: true,
  },
  useWhitelist: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'ended', 'cancelled'],
    default: 'draft',
    index: true,
  },
  previewMode: {
    type: Boolean,
    default: false,
  },
  totalTicketsSold: {
    type: Number,
    default: 0,
  },
  totalCapacity: {
    type: Number,
    required: true,
    default: 0,
  },
  totalRevenueSOL: {
    type: Number,
    default: 0,
  },
  totalRoyaltiesEarnedSOL: {
    type: Number,
    default: 0,
  },
  totalAttendeesCheckedIn: {
    type: Number,
    default: 0,
  },
  ticketTiers: [ticketTierSchemaInstance],
}, { timestamps: true });

const Event = mongoose.model<IEvent>('Event', eventSchema);
export default Event;