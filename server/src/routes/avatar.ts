import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

function getImageMimeType(buffer: Buffer): string | null {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

router.get("/me/avatar", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: req.session.userId!,
      },
      select: {
        profilePhoto: true,
        profilePhotoMimeType: true,
      },
    });

    if (!user?.profilePhoto || !user.profilePhotoMimeType) {
      return res.status(404).end();
    }

    res.setHeader("Content-Type", user.profilePhotoMimeType);
    res.setHeader("Cache-Control", "private, no-store");

    return res.send(user.profilePhoto);
  } catch (error) {
    console.error("Get avatar error:", error);

    return res.status(500).json({
      error: "Could not load profile picture.",
    });
  }
});

router.post(
  "/me/avatar",
  requireAuth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Please choose a profile picture.",
        });
      }

      const mimeType = getImageMimeType(req.file.buffer);

      if (!mimeType) {
        return res.status(400).json({
          error: "Only JPG, PNG, and WebP images are supported.",
        });
      }

      const photoData = new Uint8Array(req.file.buffer.length);
      photoData.set(req.file.buffer);

      await prisma.user.update({
        where: {
          userId: req.session.userId!,
        },
        data: {
          profilePhoto: photoData,
          profilePhotoMimeType: mimeType,
        },
      });

      return res.json({
        message: "Profile picture updated successfully.",
      });
    } catch (error) {
      console.error("Upload avatar error:", error);

      return res.status(500).json({
        error: "Could not update profile picture.",
      });
    }
  }
);

router.delete("/me/avatar", requireAuth, async (req, res) => {
  try {
    await prisma.user.update({
      where: {
        userId: req.session.userId!,
      },
      data: {
        profilePhoto: null,
        profilePhotoMimeType: null,
      },
    });

    return res.json({
      message: "Profile picture removed successfully.",
    });
  } catch (error) {
    console.error("Delete avatar error:", error);

    return res.status(500).json({
      error: "Could not remove profile picture.",
    });
  }
});

export default router;