import { Request, Response, NextFunction } from 'express';
import * as billingService from '../services/billing.service.js';

export const createInvoice = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await billingService.createInvoice(req.body);
    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllInvoices = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await billingService.getInvoices();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const id = req.params.id as string;
    const invoice = await billingService.updateInvoice(id, req.body);
    if (!invoice) return res.status(404).json({ message: 'Facture non trouvée' });
    return res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const id = req.params.id as string;
    const invoice = await billingService.deleteInvoice(id);
    if (!invoice) return res.status(404).json({ message: 'Facture non trouvée' });
    return res.status(200).json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};

export const payInvoice = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await billingService.processPayment(req.body);
    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllPayments = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await billingService.getPayments();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
