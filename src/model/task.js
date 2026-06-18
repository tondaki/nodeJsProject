const mongo = require("mongoose");

const taskSchema = new mongo.Schema(
  {
    title: String,
    description: String,

    status: {
      type: String,
      enum: ["todo", "doing", "done"],
      default: "todo",
    },
    user: {
      type: mongo.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
const Task = mongo.model("Task", taskSchema);

module.exports = Task;
