import { Router } from "express";

const templateRouter = Router();

templateRouter.get("/", (req, res) =>
  res.send({ message: "GET All Templates" }),
);
templateRouter.get("/me", (req, res) =>
  res.send({ message: "GET All User Templates" }),
);
templateRouter.get("/template", (req, res) =>
  res.send({ message: "GET Template Details" }),
);
templateRouter.post("/me", (req, res) =>
  res.send({ message: "CREATE Template " }),
);
templateRouter.put("/template", (req, res) =>
  res.send({ message: "UPDATE Template " }),
);
templateRouter.delete("/template", (req, res) =>
  res.send({ message: "DELETE Template " }),
);

export default templateRouter;
