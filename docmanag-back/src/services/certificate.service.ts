import Certificate from '../models/certificate.js';

export const createCertificate = async (data: any) => {
  return await Certificate.create(data);
};

export const getCertificates = async () => {
  return await Certificate.find().sort({ createdAt: -1 });
};

export const getCertificateById = async (id: string) => {
  return await Certificate.findById(id);
};

export const deleteCertificate = async (id: string) => {
  return await Certificate.findByIdAndDelete(id);
};
