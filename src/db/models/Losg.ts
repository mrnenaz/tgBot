import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TGLogsSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  buttons: {
    type: Object,
    required: true,
  },
  memberInfo: {
    type: Array,
    required: false,
  },
});

export const TGLogs = mongoose.model("TGLogs", TGLogsSchema);
