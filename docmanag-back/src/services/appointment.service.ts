import Appointment from '../models/appointment.js';

export const createAppointment = async (data: any) => {
  return await Appointment.create(data);
};

export const getAppointments = async () => {
  return await Appointment.find()
    .populate('patientId', 'firstName lastName')
    .sort({ createdAt: -1 });
};

export const getAppointmentById = async (id: string) => {
  return await Appointment.findById(id);
};

export const updateAppointment = async (id: string, data: any) => {
  return await Appointment.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAppointment = async (id: string) => {
  return await Appointment.findByIdAndDelete(id);
};
