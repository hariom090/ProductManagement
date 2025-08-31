import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    newprice: { type: Number },
    stock: { type: Number, required: true },
    tags : {type : String },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
