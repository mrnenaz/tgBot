import mongoose from "mongoose";

const Schema = mongoose.Schema;
const TGPostsSchema = new Schema({
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
  buttonCaption: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
  buttons: {
    type: Object,
    required: true,
  },
});

export const TGPosts = mongoose.model("TGPosts", TGPostsSchema);
