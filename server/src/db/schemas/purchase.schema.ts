import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPurchase extends Document {
  eventId: Types.ObjectId;
  ticketTierId: Types.ObjectId;
  purchaserWalletAddress: string;
  quantity: number;
  pricePerTicketSOL: number;
  totalPriceSOL: number;
  transactionSignature?: string;
  purchaseDate: Date;
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'cancelled' | 'checked-in' | 'resold';
  metadata?: Record<string, any>;
}

const purchaseSchema = new Schema<IPurchase>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true,
  },
  ticketTierId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  purchaserWalletAddress: {
    type: String,
    required: true,
    index: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  pricePerTicketSOL: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPriceSOL: {
    type: Number,
    required: true,
    min: 0,
  },
  transactionSignature: {
    type: String,
    required: false,
    index: true,
    unique: true,
    sparse: true,
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed', 'refunded', 'cancelled', 'checked-in', 'resold'],
    default: 'pending',
    required: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    required: false,
  },
}, { timestamps: true });

purchaseSchema.index({ eventId: 1, ticketTierId: 1 });
purchaseSchema.index({ purchaserWalletAddress: 1, eventId: 1 });

const Purchase = mongoose.model<IPurchase>('Purchase', purchaseSchema);

export default Purchase;