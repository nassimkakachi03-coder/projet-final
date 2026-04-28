import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service.js';

export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};
