import { getPatients } from './patient.service.js';
import { getAppointments } from './appointment.service.js';
import { getItems } from './inventory.service.js';
import { getInvoices } from './billing.service.js';

export const getDashboardStats = async () => {
  const patients = await getPatients();
  const appointments = await getAppointments();
  const items = await getItems();
  const invoices = await getInvoices();

  const today = new Date().toDateString();
  const todayAppointments = appointments.filter((a: any) => new Date(a.date).toDateString() === today).length;
  const lowStockItems = items.filter((i: any) => i.quantity <= i.threshold).length;
  const totalRevenue = invoices
    .filter((inv: any) => inv.status === 'Paid')
    .reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);

  return {
    totalPatients: patients.length,
    todayAppointments,
    lowStockItems,
    totalRevenue
  };
};
