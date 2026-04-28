import { Request, Response, NextFunction } from 'express';
import * as prescriptionService from '../services/prescription.service.js';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await prescriptionService.createPrescription(req.body);
    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await prescriptionService.getPrescriptions();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await prescriptionService.getPrescriptionById(req.params.id as string);
    if (!data) return res.status(404).json({ message: 'Prescription not found' });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await prescriptionService.deletePrescription(req.params.id as string);
    if (!data) return res.status(404).json({ message: 'Prescription not found' });
    return res.status(200).json({ message: 'Ordonnance supprimée avec succès.' });
  } catch (error) {
    next(error);
  }
};
