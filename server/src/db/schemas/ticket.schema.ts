import mongoose from "mongoose"
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true,
  },
  ticketTierName: {
    type: String,
    required: true,
  },
  nftMintAddress: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  ownerWalletAddress: {
    type: String,
    required: true,
    index: true,
  },
  originalBuyerWalletAddress: {
    type: String,
    required: true,
  },
  purchasePriceSOL: {
    type: Number,
    required: true,
    min: 0,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  checkedIn: {
    type: Boolean,
    default: false,
    index: true,
  },
  checkedInAt: {
    type: Date,
    required: false,
  },
  resold: {
    type: Boolean,
    default: false,
    index: true,
  },
  resaleHistory: [
    {
      _id: false,
      fromWallet: { type: String, required: true },
      toWallet: { type: String, required: true },
      resalePriceSOL: { type: Number, required: true, min: 0 },
      resaleDate: { type: Date, default: Date.now },
      royaltyAmountSOL: { type: Number, required: true, min: 0 },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);