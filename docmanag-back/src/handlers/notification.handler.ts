import { Request, Response, NextFunction } from 'express';
import Notification from '../models/notification.js';

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    return res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ message: 'Notification introuvable' });
    return res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    return res.status(200).json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) return res.status(404).json({ message: 'Notification introuvable' });
    return res.status(200).json({ message: 'Notification supprimée' });
  } catch (error) {
    next(error);
  }
};

export const deleteAllNotifications = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    await Notification.deleteMany({});
    return res.status(200).json({ message: 'Toutes les notifications ont été supprimées' });
  } catch (error) {
    next(error);
  }
};
