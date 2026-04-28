import { Request, Response, NextFunction } from 'express';
import * as inventoryService from '../services/inventory.service.js';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await inventoryService.createItem(req.body);
    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await inventoryService.getItems();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await inventoryService.updateItem(req.params.id as string, req.body);
    if (!data) return res.status(404).json({ message: 'Item not found' });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await inventoryService.deleteItem(req.params.id as string);
    if (!data) return res.status(404).json({ message: 'Item not found' });
    return res.status(200).json({ message: 'Article supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
};
