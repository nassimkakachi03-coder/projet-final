import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    threshold: { type: Number, required: true, default: 5 },
    supplier: { type: String, default: '' },
    category: { type: String, default: 'Consommables' },
  },
  { timestamps: true }
);

const InventoryItem = mongoose.models.InventoryItem || mongoose.model('InventoryItem', itemSchema);

const sampleItems = [
  { name: "Alvéogyl (Pâte alvéolaire)", quantity: 15, unit: "Unités", threshold: 5, supplier: "Septodont", category: "Chirurgie" },
  { name: "Eugenol pur", quantity: 20, unit: "Unités", threshold: 5, supplier: "Dentsply", category: "Chirurgie" },
  { name: "Sutures Vicryl 4-0 (Ethicon)", quantity: 50, unit: "Unités", threshold: 10, supplier: "Ethicon", category: "Chirurgie" },
  { name: "Bio-Oss (Grenat osseux 0.5g)", quantity: 10, unit: "Unités", threshold: 3, supplier: "Geistlich", category: "Chirurgie" },
  { name: "Lames de bistouri n°15", quantity: 100, unit: "Boîtes", threshold: 20, supplier: "Swann-Morton", category: "Chirurgie" },
  
  { name: "Composite Nano-hybride A2", quantity: 25, unit: "Seringues", threshold: 5, supplier: "3M ESPE", category: "Consommables" },
  { name: "Etching Gel (Acide 37%)", quantity: 12, unit: "Seringues", threshold: 4, supplier: "Ivoclar", category: "Consommables" },
  { name: "Rouleaux de coton (N°2)", quantity: 500, unit: "Boîtes", threshold: 100, supplier: "Roeko", category: "Consommables" },
  { name: "Gants Nitrile (M)", quantity: 30, unit: "Boîtes", threshold: 10, supplier: "Ansell", category: "Consommables" },
  
  { name: "Boitiers Métalliques (Ricketts)", quantity: 20, unit: "Kits", threshold: 5, supplier: "Ormco", category: "Orthodontie" },
  { name: "Arcs NiTi .014 (Supérieur)", quantity: 40, unit: "Unités", threshold: 10, supplier: "GAC", category: "Orthodontie" },
  
  { name: "Chlorhexidine 0.2% (Sol.)", quantity: 15, unit: "Bouteilles", threshold: 5, supplier: "Curaprox", category: "Hygiène" },
  { name: "Lingettes Désinfectantes", quantity: 20, unit: "Boîtes", threshold: 5, supplier: "Anios", category: "Hygiène" }
];

async function generateStock() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("Connecté à MongoDB.");
    
    // Check if empty
    const count = await InventoryItem.countDocuments();
    if (count === 0) {
      await InventoryItem.insertMany(sampleItems);
      console.log("🔥 Nouveaux articles de stock insérés avec succès !");
    } else {
      console.log("Le stock n'est pas vide, aucun article inséré pour éviter les doublons.");
    }
  } catch (error) {
    console.error("Erreur:", error.message);
  } finally {
    process.exit();
  }
}

generateStock();
