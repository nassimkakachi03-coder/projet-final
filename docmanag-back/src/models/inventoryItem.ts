import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  supplier: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true }, // e.g., "boxes", "pieces", "bottles"
    threshold: { type: Number, required: true, default: 5 }, // when to alert low stock
    supplier: { type: String, default: '' },
    category: { type: String, default: 'Consommables', enum: ['Chirurgie', 'Orthodontie', 'Consommables', 'Hygiène', 'Médicaments', 'Prothèses'] },
  },
  { timestamps: true }
);

export default mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
