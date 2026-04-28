const GENERAL_AVAILABLE_DAYS = [0, 1, 2, 3, 4, 6];
const ORTHODONTIC_AVAILABLE_DAYS = [2, 6];
const START_MINUTES = 10 * 60;
const END_MINUTES = 18 * 60;

const normalizeReason = (reason: string) =>
  reason
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const isOrthodonticReason = (reason: string) => {
  const normalized = normalizeReason(reason);
  return normalized.includes('orthodont') || normalized.includes('orthodent');
};

export const validatePatientAppointmentSlot = (dateValue: string | Date, reason: string) => {
  const appointmentDate = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(appointmentDate.getTime())) {
    return 'Date de rendez-vous invalide.';
  }

  if (appointmentDate <= new Date()) {
    return 'La date doit etre dans le futur.';
  }

  const totalMinutes = appointmentDate.getHours() * 60 + appointmentDate.getMinutes();
  if (totalMinutes < START_MINUTES || totalMinutes > END_MINUTES) {
    return 'Les rendez-vous en ligne sont disponibles de 10h00 a 18h00.';
  }

  const appointmentDay = appointmentDate.getDay();
  if (isOrthodonticReason(reason)) {
    if (!ORTHODONTIC_AVAILABLE_DAYS.includes(appointmentDay)) {
      return "Le motif Orthodontie est disponible uniquement le mardi et le samedi, entre 10h00 et 18h00.";
    }
    return null;
  }

  if (!GENERAL_AVAILABLE_DAYS.includes(appointmentDay)) {
    return 'Les rendez-vous en ligne sont disponibles du samedi au jeudi.';
  }

  return null;
};

export const patientAppointmentRules = {
  generalDays: GENERAL_AVAILABLE_DAYS,
  orthodonticDays: ORTHODONTIC_AVAILABLE_DAYS,
  startMinutes: START_MINUTES,
  endMinutes: END_MINUTES,
};
