import InventoryItem from '../models/inventoryItem.js';

export const createItem = async (data: any) => {
  return await InventoryItem.create(data);
};

export const getItems = async () => {
  return await InventoryItem.find().sort({ createdAt: -1 });
};

export const updateItem = async (id: string, data: any) => {
  return await InventoryItem.findByIdAndUpdate(id, data, { new: true });
};

export const deleteItem = async (id: string) => {
  return await InventoryItem.findByIdAndDelete(id);
};
