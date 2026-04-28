import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  source: 'admin' | 'landing' | 'patient-portal';
  accountId?: mongoose.Types.ObjectId;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  medicalHistory?: string;
  caseSummary?: string;
  careNotes?: string;
  xRayUrl?: string;
  prescriptionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    source: {
      type: String,
      enum: ['admin', 'landing', 'patient-portal'],
      default: 'admin',
    },
    accountId: { type: Schema.Types.ObjectId, ref: 'PatientAccount' },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', ''], default: '' },
    address: { type: String, default: '' },
    medicalHistory: { type: String, default: '' },
    caseSummary: { type: String, default: '' },
    careNotes: { type: String, default: '' },
    xRayUrl: { type: String, default: '' },
    prescriptionUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IPatient>('Patient', PatientSchema);
