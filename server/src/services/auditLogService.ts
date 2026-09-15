import { prisma } from "../lib/prisma";

type CreateAuditLogData = {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description?: string;
};

export async function createAuditLog(data: CreateAuditLogData) {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      description: data.description,
    },
  });
}

export async function getAuditLogs() {
  return prisma.auditLog.findMany({
    select: {
      logId: true,
      action: true,
      entityType: true,
      entityId: true,
      description: true,
      timestamp: true,
      user: {
        select: {
          displayId: true,
          fullName: true,
          username: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
}
