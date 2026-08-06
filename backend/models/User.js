const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  expires: Date,
});

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: { type: String, enum: ['student', 'admin', 'instructor'], default: 'student' },
    avatar: { type: String, default: '' },
    institution: { type: String, default: '' },
    bio: { type: String, default: '' },
    points: { type: Number, default: 0 },
    badges: [
      {
        id: String,
        name: String,
        description: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    streak: { type: Number, default: 1 },
    joinedAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    isEmailVerified: { type: Boolean, default: true },
    settings: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      defaultAlgorithmView: { type: String, enum: ['2d', '3d'], default: '2d' },
      animationSpeed: { type: Number, default: 1 },
      showExplanations: { type: Boolean, default: true },
    },
    progress: {
      algorithms: [
        {
          algorithmId: String,
          name: String,
          completed: { type: Boolean, default: false },
          score: { type: Number, default: 0 },
          attempts: { type: Number, default: 0 },
          lastPracticed: Date,
          masteryLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'beginner' },
        },
      ],
      totalPracticeTime: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      rank: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      experience: { type: Number, default: 0 },
      nextLevelExp: { type: Number, default: 100 },
    },
    refreshTokens: [RefreshTokenSchema],
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
  },
  { timestamps: true }
);

// Indexes for performance
UserSchema.index({ points: -1 });
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

// Hash password before save
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.generatePasswordReset = function () {
  this.passwordResetToken = crypto.randomBytes(20).toString('hex');
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generateEmailVerification = function () {
  this.emailVerificationToken = crypto.randomBytes(20).toString('hex');
};

// Transform to sanitize sensitive fields when serialized to JSON
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : undefined;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationToken;
    return ret;
  },
});

UserSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : undefined;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationToken;
    return ret;
  },
});

module.exports = mongoose.model('User', UserSchema);
