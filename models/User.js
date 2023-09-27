const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "Please add a First name"]
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Please add a Last name"]
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Please give a strong password."],
    minlength: [6, "Password must be of minimum 6 characters."]
  },
  username: {
    type: String,
    required: [true, "Please use a unique username."],
    unique: true,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
    maxLength: [50, "Bio can not be more than 50 characters"]
  },
  sex: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male"
  },
  age: {
    type: Number,
    required: [true, "User age required."],
    min: [5, "The age is beneath the limit of 5 years"]
  },
  height: {
    type: Number,
    required: [true, "User height(in Cm) required."]
  },
  weight: {
    type: Number,
    required: [true, "User body weight(in Kg) required."]
  },
  phone: {
    type: Number,
    length: 10
  },
  totalCaloriesBurned: {
    type: Number,
    default: 0
  },
  totalCaloriesConsumed: {
    type: Number,
    default: 0
  },
  totalCalorieGoal: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// Sign a JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env['JWT_SECRET'], {
        expiresIn: process.env['JWT_EXPIRE']
    });
}
// Match user given password to hashed password in databse
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);