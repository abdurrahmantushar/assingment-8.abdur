import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./verifyJWT.js";

export const verifyAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
    return;
  }

  next();
};