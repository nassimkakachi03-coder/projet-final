import { NextFunction, Request, Response } from 'express';
import * as appointmentService from '../services/appointment.service.js';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    return res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const appointments = await appointmentService.getAppointments();
    return res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id as string);
    if (!appointment) return res.status(404).json({ message: 'Rendez-vous introuvable.' });
    return res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const appointment = await appointmentService.updateAppointment(req.params.id as string, req.body);
    if (!appointment) return res.status(404).json({ message: 'Rendez-vous introuvable.' });
    return res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const appointment = await appointmentService.deleteAppointment(req.params.id as string);
    if (!appointment) return res.status(404).json({ message: 'Rendez-vous introuvable.' });
    return res.status(200).json({ message: 'Rendez-vous supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
};
