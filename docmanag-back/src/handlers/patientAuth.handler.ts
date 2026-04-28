import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Appointment from '../models/appointment.js';
import Notification from '../models/notification.js';
import Patient from '../models/patient.js';
import PatientAccount from '../models/patientAccount.js';
import { buildPatientHistory } from '../services/patientHistory.service.js';
import { generateToken } from '../utils/jwt.js';
import { validatePatientAppointmentSlot } from '../utils/patientAppointmentRules.js';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await PatientAccount.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: 'Un compte avec cet email existe deja.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let patient = await Patient.findOne({ email: normalizedEmail });
    if (!patient) {
      patient = await Patient.create({
        firstName,
        lastName,
        phone,
        email: normalizedEmail,
        source: 'patient-portal',
        medicalHistory: 'Inscription via le site web',
      });
    } else {
      patient.firstName = patient.firstName || firstName;
      patient.lastName = patient.lastName || lastName;
      patient.phone = patient.phone || phone;
      patient.email = patient.email || normalizedEmail;
      patient.source = 'patient-portal';
      if (!patient.medicalHistory) {
        patient.medicalHistory = 'Inscription via le site web';
      }
      await patient.save();
    }

    const account = await PatientAccount.create({
      email: normalizedEmail,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      patientId: patient._id,
    });

    patient.accountId = account._id as any;
    await patient.save();

    const token = generateToken(account._id.toString(), 'Patient');

    await Notification.create({
      title: 'Nouveau patient inscrit',
      message: `${firstName} ${lastName} vient de creer son espace patient en ligne.`,
      type: 'NewPatient',
      link: `/patients/${patient._id}/history`,
    });

    return res.status(201).json({
      message: 'Compte cree avec succes.',
      token,
      user: {
        id: account._id,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        patientId: patient._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const account = await PatientAccount.findOne({ email: email.toLowerCase() });
    if (!account) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const token = generateToken(account._id.toString(), 'Patient');
    return res.status(200).json({
      message: 'Connexion reussie.',
      token,
      user: {
        id: account._id,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        patientId: account.patientId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authReq = req as any;
    const account = await PatientAccount.findById(authReq.user?.id).select('-password');
    if (!account) return res.status(404).json({ message: 'Compte non trouve.' });
    return res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};

export const getMyHistory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authReq = req as any;
    if (authReq.user?.role !== 'Patient') {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    const account = await PatientAccount.findById(authReq.user?.id).select('-password');
    if (!account) return res.status(404).json({ message: 'Compte non trouve.' });
    if (!account.patientId) return res.status(404).json({ message: 'Dossier patient introuvable.' });

    const history = await buildPatientHistory(account.patientId.toString());
    if (!history) return res.status(404).json({ message: 'Patient non trouve.' });

    return res.status(200).json({
      account,
      ...history,
    });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authReq = req as any;
    if (authReq.user?.role !== 'Patient') {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    const account = await PatientAccount.findById(authReq.user?.id).select('-password');
    if (!account) return res.status(404).json({ message: 'Compte non trouve.' });
    if (!account.patientId) return res.status(404).json({ message: 'Dossier patient introuvable.' });

    const { date, reason, notes } = req.body;
    if (!date || !reason) {
      return res.status(400).json({ message: 'La date et le motif sont requis.' });
    }

    const appointmentDate = new Date(date);
    const slotError = validatePatientAppointmentSlot(appointmentDate, reason);
    if (slotError) {
      return res.status(400).json({ message: slotError });
    }

    const patient = await Patient.findById(account.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : `${account.firstName} ${account.lastName}`;

    const appointment = await Appointment.create({
      patientId: account.patientId,
      patientName,
      date: appointmentDate,
      reason: reason.trim(),
      notes: notes?.trim() || 'Rendez-vous pris en ligne par le patient',
      status: 'EnCours',
    });

    await Notification.create({
      title: 'Nouvelle demande de rendez-vous',
      message: `${patientName} a demande un rendez-vous le ${appointmentDate.toLocaleDateString('fr-FR')} pour le motif : ${reason}.`,
      type: 'NewAppointment',
      link: '/agenda',
    });

    return res.status(201).json({
      message: 'Rendez-vous cree avec succes. Le cabinet vous contactera pour confirmer.',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedicalProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authReq = req as any;
    if (authReq.user?.role !== 'Patient') {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    const account = await PatientAccount.findById(authReq.user?.id).select('-password');
    if (!account) return res.status(404).json({ message: 'Compte non trouve.' });
    if (!account.patientId) return res.status(404).json({ message: 'Dossier patient introuvable.' });

    const { medicalHistory, xRayUrl, prescriptionUrl } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      account.patientId,
      {
        ...(medicalHistory !== undefined && { medicalHistory }),
        ...(xRayUrl !== undefined && { xRayUrl: xRayUrl.trim() }),
        ...(prescriptionUrl !== undefined && { prescriptionUrl: prescriptionUrl.trim() }),
      },
      { new: true }
    );

    if (!patient) return res.status(404).json({ message: 'Patient non trouve.' });

    await Notification.create({
      title: 'Mise a jour du dossier medical',
      message: `${patient.firstName} ${patient.lastName} vient d'ajouter de nouvelles informations ou documents a son dossier.`,
      type: 'ProfileUpdate',
      link: `/patients/${patient._id}/history`,
    });

    return res.status(200).json({
      message: 'Dossier medical mis a jour avec succes.',
      patient: {
        medicalHistory: patient.medicalHistory,
        xRayUrl: patient.xRayUrl,
        prescriptionUrl: patient.prescriptionUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
