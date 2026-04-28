import Invoice from '../models/invoice.js';
import Payment from '../models/payment.js';

export const createInvoice = async (data: any) => {
  const items = Array.isArray(data.items) ? data.items : [];
  const totalAmount = items.reduce((sum: number, item: any) => sum + (Number(item.cost) || 0), 0);

  return Invoice.create({
    ...data,
    items,
    totalAmount: totalAmount || Number(data.totalAmount) || 0,
    currency: 'DZD',
  });
};

export const getInvoices = async () =>
  Invoice.find().populate('patientId', 'firstName lastName').sort({ createdAt: -1 });

export const getInvoiceById = async (id: string) => Invoice.findById(id);

export const updateInvoice = async (id: string, data: any) => {
  const items = Array.isArray(data.items) ? data.items : [];
  const totalAmount = items.reduce((sum: number, item: any) => sum + (Number(item.cost) || 0), 0);

  return Invoice.findByIdAndUpdate(
    id,
    {
      ...data,
      items,
      totalAmount: totalAmount || Number(data.totalAmount) || 0,
      currency: 'DZD',
    },
    { new: true }
  );
};

export const deleteInvoice = async (id: string) => {
  await Payment.deleteMany({ invoiceId: id });
  return Invoice.findByIdAndDelete(id);
};

export const updateInvoiceStatus = async (id: string, status: string) =>
  Invoice.findByIdAndUpdate(id, { status }, { new: true });

export const processPayment = async (data: any) => {
  const invoice = await Invoice.findById(data.invoiceId);
  if (!invoice) {
    throw new Error('Facture introuvable.');
  }

  const payment = await Payment.create({
    ...data,
    amount: Number(data.amount) || 0,
    currency: 'DZD',
    exchangeRate: 1,
    date: data.date ? new Date(data.date) : new Date(),
  });

  const payments = await Payment.find({ invoiceId: data.invoiceId });
  const paidTotal = payments.reduce((sum, current) => sum + (current.amount || 0), 0);
  invoice.status = paidTotal >= invoice.totalAmount ? 'Paid' : 'Pending';
  invoice.currency = 'DZD';
  await invoice.save();

  return payment.populate({
    path: 'invoiceId',
    select: 'patientId patientName totalAmount currency status createdAt',
    populate: { path: 'patientId', select: 'firstName lastName' },
  });
};

export const getPayments = async () =>
  Payment.find()
    .populate({
      path: 'invoiceId',
      select: 'patientId patientName totalAmount currency status createdAt',
      populate: { path: 'patientId', select: 'firstName lastName' },
    })
    .sort({ date: -1, createdAt: -1 });
