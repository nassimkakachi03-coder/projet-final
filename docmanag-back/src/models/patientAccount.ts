import mongoose, { Schema, Document } from 'mongoose';

export interface IPatientAccount extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  patientId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PatientAccountSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
  },
  { timestamps: true }
);

export default mongoose.model<IPatientAccount>('PatientAccount', PatientAccountSchema);
