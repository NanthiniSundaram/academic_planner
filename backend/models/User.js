import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name:{
        type:String, 
        required:true,
        trim:true
    },
    email:{
        type:String, 
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type: String, 
        required:true,
        minlength:6
    },
    studentId:{
        type:String, 
        unique:true, 
        sparse:true
    },
    major:{
        type:String, 
        trim:true
    },
    year: {
        type:Number, 
        min:1, 
        max:6
    },
    preferences : {
        studyHours: {
            type:Number, 
            default:4
        },
        preferredTimeSlots: [{
            day:{
                type:String, 
                enum:['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            },
            startTime:String, 
            endTime: String
        }],
        notificationSettings: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true }
        }
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    isActive: {
        type:Boolean, 
        default: true
    }

    }, {
    timestamps:true
});

//Hash password before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Compare password method
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}
const User = mongoose.model('User', userSchema);
export default User;

