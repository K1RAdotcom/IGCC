import express from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import patientRoutes from "./routes/patients";
import patientCreateRoutes from "./routes/patientCreate";
import patientUpdateRoutes from "./routes/patientUpdate";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import visitRoutes from "./routes/visits";
import dashboardRoutes from "./routes/dashboard";
import patientProfileRoutes from "./routes/patientProfile";
import userProfileRoutes from "./routes/userProfile";
import passwordRoutes from "./routes/password";
import auditLogRoutes from "./routes/auditLogs";
import clinicSettingsRoutes from "./routes/clinicSettings";

const app = express();

const PgSession = connectPgSimple(session);

const sessionStore = new PgSession({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    system: "Ikeja Golf Club Clinic",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/patient-profile", patientProfileRoutes);
app.use("/api/users", userProfileRoutes);
app.use("/api/users", passwordRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/clinic-settings", clinicSettingsRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/patients", patientCreateRoutes);
app.use("/api/patients", patientUpdateRoutes);
app.use("/api/users", userRoutes);

export default app;