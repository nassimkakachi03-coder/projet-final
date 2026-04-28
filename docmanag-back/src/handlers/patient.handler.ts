import { NextFunction, Request, Response } from 'express';
import * as patientService from '../services/patient.service.js';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const isLandingRegistration = req.originalUrl.endsWith('/patients/register');
    const patient = await patientService.createPatient({
      ...req.body,
      source: req.body.source || (isLandingRegistration ? 'landing' : 'admin'),
    });
    return res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const patients = await patientService.getPatients();
    return res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
};

export const getArchivedAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const archives = await patientService.getArchivedPatients();
    return res.status(200).json(archives);
  } catch (error) {
    next(error);
  }
};

export const getArchivedOne = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const archive = await patientService.getArchivedPatientById(req.params.archiveId as string);
    if (!archive) return res.status(404).json({ message: 'Archive introuvable.' });
    return res.status(200).json(archive);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const patient = await patientService.getPatientById(req.params.id as string);
    if (!patient) return res.status(404).json({ message: 'Patient non trouve.' });
    return res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const patient = await patientService.updatePatient(req.params.id as string, req.body);
    if (!patient) return res.status(404).json({ message: 'Patient non trouve.' });
    return res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authReq = req as any;
    const patient = await patientService.deletePatient(req.params.id as string, authReq.user);
    if (!patient) return res.status(404).json({ message: 'Patient non trouve.' });
    return res.status(200).json({ message: 'Patient archive avec succes.' });
  } catch (error) {
    next(error);
  }
};
