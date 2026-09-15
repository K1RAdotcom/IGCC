import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { updateMyProfile } from "../services/userProfileService";

const router = Router();

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const user = await updateMyProfile(
      req.session.userId!,
      {
        fullName,
        email,
      }
    );

    return res.json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update my profile error:", error);

    if (error instanceof Error) {
      if (error.message === "User account not found.") {
        return res.status(404).json({
          error: error.message,
        });
      }

      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Could not update profile.",
    });
  }
});

export default router;
