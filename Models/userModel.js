const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const userScheema = new mongoose.Schema({
    name: {
        type: String,
        required:[true,'user name is required']
    },
    email: {
        type: String,
        required: [true, 'user must be enter email'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail,'please provide a valid email']
    },
    phone: {
        type: Number,
        maxlength: [11, 'please enter the correct number'],
        required:true
        
    },
    photo: String,
    roule: {
        type: String,
        enum: ['user', 'admin','lead-guied'],
        default:'user',
    },
    password: {
        type: String,
        minlength: [8, 'password must be greater or equal 8 character'],
        required: true,
        select:false
    },
    confiramPassword: {
        type: String,
        required: [true, 'Please confiram password'],
        validate: {
            //this only work on create ,save
            validator: function (el) {
                return el === this.password;
            },
            message:'Password are not same'
            
        }
        
    },
    passwordresettoken: String,
    passwordresetExpire:String,
    passwordchangedAt: Date,
    active: {
        type: Boolean,
        default: true,
        select:false
    }
   
});

userScheema.pre('save', async function (next) {
    //only run this function if password was actually modified
    if (!this.isModified('password')) return next();
    //Hash the password with cast of 12
    this.password = await bcrypt.hash(this.password, 12);
    //delete confirampassword
    this.confiramPassword = undefined;
});
userScheema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordchangedAt = Date.now() - 1000;
    next();
});
userScheema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}
userScheema.pre(/^find/, function (next) {
    // this point to the surrent query
    this.find({ active: { $ne: false }});
    next();
});

userScheema.methods.changedPasswordAfter = function (JWTTimestemp)
{
    if (this.passwordchangedAt) {
        const changedTimestemp = parseInt(this.passwordchangedAt.getTime() / 1000);
        return JWTTimestemp < changedTimestemp;
    }
    return false;
}
    
userScheema.methods.createPasswordresetToken = function () {
    const resettoken = crypto.randomBytes(32).toString('hex');
    this.passwordresettoken = crypto.createHash('sha256').update(resettoken).digest('hex');
    this.passwordresetExpire = Date.now() + 10 * 60 * 1000;
    return resettoken;
};
const User = mongoose.model('User', userScheema);
module.exports = User;