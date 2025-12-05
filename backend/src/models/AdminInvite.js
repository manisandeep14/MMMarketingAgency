// backend/src/models/AdminInvite.js
import mongoose from 'mongoose';

const adminInviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true, index: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // optional expiry
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional: which admin created it
});

export default mongoose.model('AdminInvite', adminInviteSchema);
