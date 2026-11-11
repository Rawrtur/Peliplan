import mongoose from "mongoose";
import Template from "../models/template.model.js";

export const getAllTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find();
    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTemplates = async (req, res, next) => {
  try {

    const templates = await Template.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

export const createTemplate = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { title, todos } = req.body;

    session.startTransaction();

    await Template.create(
      [
        {
          title,
          todos,
          user: req.user._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Template created successfully",
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    await session.endSession();
  }
};

export const updateTemplate = async (req, res, next) => {
  // const session = await mongoose.startSession();

  try {
    const { title, todos, id } = req.body;

    // session.startTransaction();

    const template = await Template.findOne({ user: req.user._id, _id: id });

    if (!template) {
      const error = new Error("Template not found");
      error.statusCode = 404;
      throw error;
    }

    template.title = title;
    template.todos = todos;

    await template.save();

    res.status(201).json({
      success: true,
      message: "Template successfully updated",
    });
  } catch (error) {
    next(error);
  }
};

export const getTemplateDetails = async (req, res, next) => {
  try {
    const { id } = req.body;

    const template = await Template.findOne({ user: req.user._id, _id: id });

    if (!template) {
      const error = new Error("Template not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteTemplate = async (req,res,next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        await Template.deleteMany({user: req.user._id, _id: req.body.id});

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "Template deleted successfully"
        });

    } catch (error) {
        if (session.inTransaction()) {
            session.abortTransaction();
        }
        next(error);
    } finally {
        await session.endSession();
    }
}