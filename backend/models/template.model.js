import mongoose from "mongoose";

const templateSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Template Title is required"],
      trim: true,
      minLength: 2,
      maxLength: 15,
    },
    todos: [
      {
        name: {
          type: String,
          required: [true, "Todo Name is required"],
        },
        startTime: {
          type: Date,
        },
        endTime: {
          type: Date,
        },
        duration: {
          type: Number
        }
      },
    ],
  },
  { timestamps: true },
);

const Template = mongoose.model("Template", templateSchema);

export default Template;
