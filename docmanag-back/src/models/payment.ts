import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  invoiceId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  exchangeRate?: number;
  method: 'Cash' | 'Credit Card' | 'Bank Transfer';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['DZD'], default: 'DZD' },
    exchangeRate: { type: Number, default: 1 },
    method: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Bank Transfer'],
      required: true
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
