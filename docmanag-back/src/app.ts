import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174,http://localhost:5175")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile/curl) or matching origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Default route for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Dental Clinic API is running' });
});

// Routes
import authRouter from './routers/auth.router.js';
import patientRouter from './routers/patient.router.js';
import patientAuthRouter from './routers/patientAuth.router.js';
import appointmentRouter from './routers/appointment.router.js';
import prescriptionRouter from './routers/prescription.router.js';
import certificateRouter from './routers/certificate.router.js';
import inventoryRouter from './routers/inventory.router.js';
import billingRouter from './routers/billing.router.js';
import dashboardRouter from './routers/dashboard.router.js';
import contactRouter from './routers/contact.router.js';
import notificationRouter from './routers/notification.router.js';

app.use('/api/auth', authRouter);
app.use('/api/patients', patientRouter);
app.use('/api/patient-auth', patientAuthRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/prescriptions', prescriptionRouter);
app.use('/api/certificates', certificateRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/billing', billingRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/contact', contactRouter);
app.use('/api/notifications', notificationRouter);

// Global Error Handler
import { errorHandler } from './middlewares/errorHandler.js';
app.use(errorHandler);

export default app;

