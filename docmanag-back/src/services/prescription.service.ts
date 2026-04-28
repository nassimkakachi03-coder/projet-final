import Prescription from '../models/prescription.js';

export const createPrescription = async (data: any) => {
  if (Array.isArray(data.medications)) {
    data.medications = data.medications.map((med: any) => ({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency || '',
      duration: med.duration || '',
      instructions: med.instructions || '',
    }));
  }
  return await Prescription.create(data);
};

export const getPrescriptions = async () => {
  return await Prescription.find()
    .populate('patientId', 'firstName lastName')
    .sort({ createdAt: -1 });
};

export const getPrescriptionById = async (id: string) => {
  return await Prescription.findById(id);
};

export const deletePrescription = async (id: string) => {
  return await Prescription.findByIdAndDelete(id);
};
