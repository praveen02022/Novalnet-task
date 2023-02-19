const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const crypto = require("crypto");
const resetToken = crypto.randomBytes(20).toString('hex');
const userSchema = new Schema({
  name: {
    type: String,
    min: 3,
    max: 255,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.getResetPasswordToken = function () {
  this.resetpasswordtoken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
}
const User = mongoose.model("user", userSchema);

const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    password:Joi.string().min(3).max(255).required(),
    mobile:Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
  });
  return schema.validate(user);
};



module.exports = {
  User,
  validate,
};
