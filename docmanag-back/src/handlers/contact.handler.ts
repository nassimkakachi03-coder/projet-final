import { NextFunction, Request, Response } from 'express';
import Contact from '../models/contact.js';
import Patient from '../models/patient.js';
import Notification from '../models/notification.js';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const firstName = (req.body.firstName || '').trim();
    const lastName = (req.body.lastName || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const phone = (req.body.phone || '').trim();
    const subject = (req.body.subject || 'Message depuis le site').trim();
    const message = (req.body.message || '').trim();

    // Try to link to an existing patient, or create one — never block the message
    let linkedPatientId: any = null;
    if (firstName && lastName) {
      try {
        let patient = email
          ? await Patient.findOne({ email })
          : await Patient.findOne({ firstName: new RegExp(`^${firstName}$`, 'i'), lastName: new RegExp(`^${lastName}$`, 'i') });

        if (!patient) {
          patient = await Patient.create({
            firstName,
            lastName,
            phone,
            email,
            source: 'landing',
            caseSummary: subject,
            careNotes: `Message site web: ${message}`,
          });
          
          await Notification.create({
            title: 'Nouveau patient (via Contact)',
            message: `${firstName} ${lastName} a été créé automatiquement via le formulaire de contact.`,
            type: 'NewPatient',
            link: `/patients/${patient._id}`
          });
        }
        linkedPatientId = patient._id;
      } catch (patientError) {
        // Patient linking failed — continue with message creation anyway
        console.error('Patient linking failed (non-blocking):', patientError);
      }
    }

    const contact = await Contact.create({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      subject,
      message,
      patientId: linkedPatientId,
      read: false,
    });

    await Notification.create({
      title: 'Nouveau message reçu',
      message: `${firstName} ${lastName} a envoyé: "${subject}".`,
      type: 'NewMessage',
      link: `/messages`
    });

    return res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!contact) return res.status(404).json({ message: 'Message non trouvé.' });
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Message non trouvé.' });
    return res.status(200).json({ message: 'Message supprimé.' });
  } catch (error) {
    next(error);
  }
};
