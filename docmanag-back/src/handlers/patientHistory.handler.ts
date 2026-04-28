import { NextFunction, Request, Response } from 'express';
import { buildPatientHistory } from '../services/patientHistory.service.js';

export const getPatientHistory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const history = await buildPatientHistory(req.params.id as string);
    if (!history) return res.status(404).json({ message: 'Patient non trouvé.' });
    return res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};
