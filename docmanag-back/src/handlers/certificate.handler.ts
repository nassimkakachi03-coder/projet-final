import { Request, Response, NextFunction } from 'express';
import * as certificateService from '../services/certificate.service.js';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await certificateService.createCertificate(req.body);
    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await certificateService.getCertificates();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await certificateService.getCertificateById(req.params.id as string);
    if (!data) return res.status(404).json({ message: 'Certificate not found' });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await certificateService.deleteCertificate(req.params.id as string);
    if (!data) return res.status(404).json({ message: 'Certificate not found' });
    return res.status(200).json({ message: 'Certificat supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
};
