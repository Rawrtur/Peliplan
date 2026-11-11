import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import authorizeAdmin from "../middlewares/admin.middleware.js";
import {
  createTemplate,
  deleteTemplate,
  getAllTemplates,
  getTemplateDetails,
  getUserTemplates,
  updateTemplate,
} from "../controllers/template.controller.js";

const templateRouter = Router();

// Admin Route
templateRouter.get("/", authorize, authorizeAdmin, getAllTemplates);

templateRouter.get("/me", authorize, getUserTemplates);

templateRouter.get("/template", authorize, getTemplateDetails);

templateRouter.post("/me", authorize, createTemplate);

templateRouter.put("/template", authorize, updateTemplate);

templateRouter.delete("/template", authorize, deleteTemplate);

export default templateRouter;
