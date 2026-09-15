import { prisma } from "../lib/prisma";

export async function getDashboardStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const totalPatients = await prisma.patient.count();

  const todaysVisits = await prisma.visit.count({
    where: {
      visitDateTime: {
        gte: startOfToday,
        lt: startOfTomorrow,
      },
    },
  });

  const newPatients = await prisma.patient.count({
    where: {
      createdAt: {
        gte: startOfToday,
        lt: startOfTomorrow,
      },
    },
  });

  return {
    totalPatients,
    todaysVisits,
    newPatients,
  };
}
