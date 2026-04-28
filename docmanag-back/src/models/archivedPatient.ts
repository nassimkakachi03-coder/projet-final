import mongoose, { Document, Schema } from 'mongoose';

export interface IArchivedPatient extends Document {
  originalPatientId: string;
  patient: Record<string, any>;
  account?: Record<string, any> | null;
  appointments: Record<string, any>[];
  prescriptions: Record<string, any>[];
  invoices: Record<string, any>[];
  payments: Record<string, any>[];
  deletedAt: Date;
  deletedBy?: {
    userId?: string;
    role?: string;
  };
  stats: {
    appointmentCount: number;
    prescriptionCount: number;
    invoiceCount: number;
    paymentCount: number;
  };
}

const ArchivedPatientSchema = new Schema(
  {
    originalPatientId: { type: String, required: true, index: true },
    patient: { type: Schema.Types.Mixed, required: true },
    account: { type: Schema.Types.Mixed, default: null },
    appointments: { type: [Schema.Types.Mixed], default: [] },
    prescriptions: { type: [Schema.Types.Mixed], default: [] },
    invoices: { type: [Schema.Types.Mixed], default: [] },
    payments: { type: [Schema.Types.Mixed], default: [] },
    deletedAt: { type: Date, default: Date.now, index: true },
    deletedBy: {
      userId: { type: String, default: '' },
      role: { type: String, default: '' },
    },
    stats: {
      appointmentCount: { type: Number, default: 0 },
      prescriptionCount: { type: Number, default: 0 },
      invoiceCount: { type: Number, default: 0 },
      paymentCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IArchivedPatient>('ArchivedPatient', ArchivedPatientSchema);
