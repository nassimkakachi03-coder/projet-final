import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  patientId: mongoose.Types.ObjectId;
  patientName?: string;
  items: Array<{ description: string; cost: number }>;
  totalAmount: number;
  currency: string;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    patientName: { type: String, default: '' },
    items: [
      {
        description: { type: String, required: true },
        cost: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    currency: { type: String, enum: ['DZD'], default: 'DZD' },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
