import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = 'mongodb+srv://admin:qwerty123@cluster1.gqfxn8y.mongodb.net/docmanag?appName=Cluster1';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Doctor', 'Assistant', 'Receptionist'], default: 'Admin' },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    const existing = await User.findOne({ email: 'admin@admin.com' });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Administrateur',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'Admin'
      });
      console.log("Admin seeded successfully!");
    } else {
      existing.password = await bcrypt.hash('admin123', 10);
      await existing.save();
      console.log("Admin updated successfully!");
    }
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
