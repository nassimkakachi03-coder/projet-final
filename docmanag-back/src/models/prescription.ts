import mongoose, { Schema, Document } from 'mongoose';

export interface IPrescription extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  patientName?: string;
  doctorName?: string;
  medications: Array<{ name: string; dosage: string; frequency?: string; duration?: string; instructions?: string }>;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema: Schema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User' },
    patientName: { type: String, default: '' },
    doctorName: { type: String, default: '' },
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, default: '' },
        duration: { type: String, default: '' },
        instructions: { type: String, default: '' }
      }
    ],
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
