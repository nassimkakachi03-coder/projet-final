import Appointment from '../models/appointment.js';
import ArchivedPatient from '../models/archivedPatient.js';
import Invoice from '../models/invoice.js';
import Patient from '../models/patient.js';
import PatientAccount from '../models/patientAccount.js';
import Payment from '../models/payment.js';
import Prescription from '../models/prescription.js';

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const normalizeEmail = (value: unknown) => normalizeText(value).toLowerCase();
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const appendUniqueNote = (currentValue: string, incomingValue: string) => {
  if (!incomingValue) return currentValue;
  if (!currentValue) return incomingValue;
  if (currentValue.includes(incomingValue)) return currentValue;
  return `${currentValue}\n\n${incomingValue}`;
};

const resolveAccountId = async (email: string) => {
  if (!email) return undefined;
  const account = await PatientAccount.findOne({ email }).select('_id');
  return account?._id;
};

const toPlainObject = (document: any) => (document ? document.toObject({ depopulate: true }) : null);

const findExistingPatient = async (data: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}) => {
  if (data.email) {
    const byEmail = await Patient.findOne({ email: data.email });
    if (byEmail) return byEmail;
  }

  if (data.phone && data.firstName && data.lastName) {
    return Patient.findOne({
      phone: data.phone,
      firstName: { $regex: `^${escapeRegex(data.firstName)}$`, $options: 'i' },
      lastName: { $regex: `^${escapeRegex(data.lastName)}$`, $options: 'i' },
    });
  }

  return null;
};

export const createPatient = async (data: any) => {
  const payload = {
    firstName: normalizeText(data.firstName),
    lastName: normalizeText(data.lastName),
    phone: normalizeText(data.phone),
    email: normalizeEmail(data.email),
    source: data.source || 'admin',
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    gender: normalizeText(data.gender),
    address: normalizeText(data.address),
    medicalHistory: normalizeText(data.medicalHistory),
    caseSummary: normalizeText(data.caseSummary),
    careNotes: normalizeText(data.careNotes),
    xRayUrl: normalizeText(data.xRayUrl),
    prescriptionUrl: normalizeText(data.prescriptionUrl),
  };

  const existingPatient = await findExistingPatient(payload);
  const accountId = await resolveAccountId(payload.email);

  if (existingPatient) {
    existingPatient.firstName = payload.firstName || existingPatient.firstName;
    existingPatient.lastName = payload.lastName || existingPatient.lastName;
    existingPatient.phone = payload.phone || existingPatient.phone;
    existingPatient.email = payload.email || existingPatient.email;
    existingPatient.source = existingPatient.source || payload.source;
    existingPatient.gender = payload.gender || existingPatient.gender;
    existingPatient.address = payload.address || existingPatient.address;
    existingPatient.medicalHistory = appendUniqueNote(existingPatient.medicalHistory || '', payload.medicalHistory || '');
    existingPatient.caseSummary = appendUniqueNote(existingPatient.caseSummary || '', payload.caseSummary || '');
    existingPatient.careNotes = appendUniqueNote(existingPatient.careNotes || '', payload.careNotes || '');
    existingPatient.xRayUrl = payload.xRayUrl || existingPatient.xRayUrl;
    existingPatient.prescriptionUrl = payload.prescriptionUrl || existingPatient.prescriptionUrl;
    if (payload.dateOfBirth) existingPatient.dateOfBirth = payload.dateOfBirth;
    if (accountId) existingPatient.accountId = accountId;
    await existingPatient.save();
    return existingPatient;
  }

  return Patient.create({
    ...payload,
    accountId,
  });
};

export const getPatients = async () => Patient.find().sort({ updatedAt: -1, createdAt: -1 });

export const getPatientById = async (id: string) => Patient.findById(id);

export const updatePatient = async (id: string, data: any) => {
  const patient = await Patient.findById(id);
  if (!patient) return null;

  if (data.firstName !== undefined) patient.firstName = normalizeText(data.firstName);
  if (data.lastName !== undefined) patient.lastName = normalizeText(data.lastName);
  if (data.phone !== undefined) patient.phone = normalizeText(data.phone);
  if (data.email !== undefined) {
    patient.email = normalizeEmail(data.email);
    patient.accountId = await resolveAccountId(patient.email || '');
  }
  if (data.source !== undefined) patient.source = data.source;
  if (data.dateOfBirth !== undefined) patient.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : undefined;
  if (data.gender !== undefined) patient.gender = normalizeText(data.gender);
  if (data.address !== undefined) patient.address = normalizeText(data.address);
  if (data.medicalHistory !== undefined) patient.medicalHistory = normalizeText(data.medicalHistory);
  if (data.caseSummary !== undefined) patient.caseSummary = normalizeText(data.caseSummary);
  if (data.careNotes !== undefined) patient.careNotes = normalizeText(data.careNotes);
  if (data.xRayUrl !== undefined) patient.xRayUrl = normalizeText(data.xRayUrl);
  if (data.prescriptionUrl !== undefined) patient.prescriptionUrl = normalizeText(data.prescriptionUrl);

  await patient.save();
  return patient;
};

export const getArchivedPatients = async () => {
  const archives = await ArchivedPatient.find().sort({ deletedAt: -1, createdAt: -1 });

  return archives.map((archive) => ({
    _id: archive._id,
    patient: {
      firstName: archive.patient?.firstName || '',
      lastName: archive.patient?.lastName || '',
      phone: archive.patient?.phone || '',
      email: archive.patient?.email || '',
      source: archive.patient?.source || '',
    },
    stats: archive.stats,
    deletedAt: archive.deletedAt,
    deletedBy: archive.deletedBy,
  }));
};

export const getArchivedPatientById = async (id: string) => ArchivedPatient.findById(id);

export const deletePatient = async (id: string, deletedBy?: { id?: string; role?: string }) => {
  const patient = await Patient.findById(id);
  if (!patient) return null;

  const [appointments, prescriptions, invoices, linkedAccount] = await Promise.all([
    Appointment.find({ patientId: id }).sort({ date: -1, createdAt: -1 }),
    Prescription.find({ patientId: id }).sort({ date: -1, createdAt: -1 }),
    Invoice.find({ patientId: id }).sort({ createdAt: -1 }),
    patient.accountId
      ? PatientAccount.findById(patient.accountId)
      : PatientAccount.findOne({ patientId: patient._id }),
  ]);

  const invoiceIds = invoices.map((invoice) => invoice._id);
  const payments = invoiceIds.length
    ? await Payment.find({ invoiceId: { $in: invoiceIds } }).sort({ date: -1, createdAt: -1 })
    : [];

  await ArchivedPatient.create({
    originalPatientId: patient._id.toString(),
    patient: toPlainObject(patient),
    account: toPlainObject(linkedAccount),
    appointments: appointments.map((appointment) => toPlainObject(appointment)),
    prescriptions: prescriptions.map((prescription) => toPlainObject(prescription)),
    invoices: invoices.map((invoice) => toPlainObject(invoice)),
    payments: payments.map((payment) => toPlainObject(payment)),
    deletedAt: new Date(),
    deletedBy: {
      userId: deletedBy?.id || '',
      role: deletedBy?.role || '',
    },
    stats: {
      appointmentCount: appointments.length,
      prescriptionCount: prescriptions.length,
      invoiceCount: invoices.length,
      paymentCount: payments.length,
    },
  });

  await Promise.all([
    payments.length ? Payment.deleteMany({ _id: { $in: payments.map((payment) => payment._id) } }) : Promise.resolve(),
    invoiceIds.length ? Invoice.deleteMany({ _id: { $in: invoiceIds } }) : Promise.resolve(),
    Prescription.deleteMany({ patientId: id }),
    Appointment.deleteMany({ patientId: id }),
    linkedAccount ? PatientAccount.deleteOne({ _id: linkedAccount._id }) : PatientAccount.deleteMany({ patientId: patient._id }),
    Patient.deleteOne({ _id: patient._id }),
  ]);

  return patient;
};
