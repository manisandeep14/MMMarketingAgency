import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/* ---------------- ADDRESS SCHEMA ---------------- */
const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

/* ---------------- USER SCHEMA ---------------- */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },

    /* ---------------- EMAIL AUTH (EXISTING) ---------------- */
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true, // allows Google users without email/password issues
    },

    password: {
      type: String,
      minlength: 6,
      select: false, // never return password by default
    },

    /* ---------------- GOOGLE AUTH (NEW) ---------------- */
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows non-google users
    },

    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    /* ---------------- ROLE ---------------- */
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    /* ---------------- VERIFICATION ---------------- */
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
      index: true,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    /* ---------------- ADDRESS ---------------- */
    addresses: [addressSchema],
  },
  { timestamps: true }
);

/* ---------------- PASSWORD HASH ---------------- */
userSchema.pre('save', async function (next) {
  // Only hash password for local (email/password) users
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ---------------- PASSWORD COMPARE ---------------- */
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
