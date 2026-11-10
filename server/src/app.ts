import "dotenv/config";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import { DB_POOL_MAX } from "./lib/dbConfig";

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
import passwordResetRoutes from "./routes/passwordReset";
import avatarRoutes from "./routes/avatar";
import auditLogRoutes from "./routes/auditLogs";
import clinicSettingsRoutes from "./routes/clinicSettings";

const app = express();
app.disable("x-powered-by");
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    strictTransportSecurity: isProduction ? undefined : false,
  })
);

const PgSession = connectPgSimple(session);

const sessionStore = new PgSession({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: DB_POOL_MAX,
  }),
  createTableIfMissing: true,
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      /*
       * On Vercel the frontend and API share one origin, so "lax" is correct
       * (and safer). Other production hosts that serve the frontend from a
       * different site still need "none".
       */
      sameSite: isProduction && !process.env.VERCEL ? "none" : "lax",
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
app.use("/api/auth", passwordResetRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/patient-profile", patientProfileRoutes);
app.use("/api/users", userProfileRoutes);
app.use("/api/users", avatarRoutes);
app.use("/api/users", passwordRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/clinic-settings", clinicSettingsRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/patients", patientCreateRoutes);
app.use("/api/patients", patientUpdateRoutes);
app.use("/api/users", userRoutes);

/* Handle unknown routes consistently. */
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({
      error: "API endpoint not found.",
    });
    return;
  }

  res.status(404).json({
    error: "Route not found.",
  });
});

/* Handle unexpected errors without exposing internal details. */
const errorHandler: express.ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  _next
) => {
  console.error("Unhandled server error:", err);

  if (res.headersSent) {
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as { status?: unknown }).status === "number"
  ) {
    const status = (err as { status: number }).status;

    if (status >= 400 && status < 500) {
      return res.status(status).json({
        error:
          status === 413
            ? "Request payload is too large."
            : status === 400
              ? "Invalid request payload."
              : "Invalid request.",
      });
    }
  }

  return res.status(500).json({
    error: "An unexpected server error occurred.",
  });
};

app.use(errorHandler);
export default app;

