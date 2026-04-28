import Appointment from '../models/appointment.js';
import Invoice from '../models/invoice.js';
import Patient from '../models/patient.js';
import Payment from '../models/payment.js';
import Prescription from '../models/prescription.js';

export const buildPatientHistory = async (patientId: string) => {
  const [patient, appointments, prescriptions, invoices] = await Promise.all([
    Patient.findById(patientId),
    Appointment.find({ patientId }).sort({ date: -1, createdAt: -1 }),
    Prescription.find({ patientId }).sort({ date: -1, createdAt: -1 }),
    Invoice.find({ patientId }).sort({ createdAt: -1 }),
  ]);

  if (!patient) {
    return null;
  }

  const invoiceIds = invoices.map((invoice) => invoice._id);
  const payments = invoiceIds.length
    ? await Payment.find({ invoiceId: { $in: invoiceIds } })
        .populate({
          path: 'invoiceId',
          select: 'patientId patientName totalAmount currency status createdAt',
          populate: { path: 'patientId', select: 'firstName lastName' },
        })
        .sort({ date: -1, createdAt: -1 })
    : [];

  const careTimeline = [
    ...appointments.map((appointment) => ({
      id: appointment._id,
      type: 'appointment',
      label: appointment.reason || 'Rendez-vous',
      date: appointment.date,
      status: appointment.status,
      note: appointment.notes || '',
    })),
    ...prescriptions.map((prescription) => ({
      id: prescription._id,
      type: 'prescription',
      label: 'Ordonnance',
      date: prescription.date || prescription.createdAt,
      status: '',
      note: prescription.notes || '',
    })),
    ...invoices.map((invoice) => ({
      id: invoice._id,
      type: 'invoice',
      label: invoice.items?.map((item) => item.description).join(', ') || 'Facture',
      date: invoice.createdAt,
      status: invoice.status,
      note: `${invoice.totalAmount.toLocaleString('fr-DZ')} DZD`,
    })),
    ...payments.map((payment) => ({
      id: payment._id,
      type: 'payment',
      label: 'Paiement',
      date: payment.date || payment.createdAt,
      status: payment.method,
      note: `${payment.amount.toLocaleString('fr-DZ')} DZD`,
    })),
  ].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  return {
    patient,
    appointments,
    prescriptions,
    invoices,
    payments,
    careTimeline,
    stats: {
      appointmentCount: appointments.length,
      prescriptionCount: prescriptions.length,
      invoiceCount: invoices.length,
      paymentCount: payments.length,
      totalPaid: payments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
      lastCareDate: careTimeline[0]?.date || null,
    },
  };
};
