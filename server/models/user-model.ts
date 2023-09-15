import mongoose,{Document,Model,Schema} from 'mongoose';
import bcrypt from 'bcryptjs'


const emailRegexPattern: RegExp= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document{

    name:string;
    email:string;
    password:string;
    avatar:{
        public_id:string;
        url:string;
    },
    role:string;
    isVerified:boolean;
    course: Array<{courseId: string}>;
    comparePassword:(password: string)=>Promise<boolean>
};

const UserSchema : Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'enter your username'],
    },
    email:{
        type:String,
        required:[true,'enter your email'],
        validate:{
            validator: function(value:string){
                return emailRegexPattern.test(value);
            },
            message:'please enter a valid mail id',
        },
        unique:true,
    },

    password:{
        type:String,
        select:false,
        require:[true,'please enter the correct password'],
        minlength:[6,'password must be at least 6 character ']

    },

    avatar:{
        public_id:String,
        url:String
    },
    role:{
        type:String,
        default:'user',

    },
    isVerified:{
        type:Boolean,
        default:false
    },
    course:[
        {
            courseId:String
        }
    ],

},{timestamps:true})

//hash password

UserSchema.pre<IUser>('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});


//compare password

UserSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean>{
    return await bcrypt.compare(enteredPassword,this.password);
};

const UserModel:Model <IUser> = mongoose.model('user', UserSchema);

export default UserModel;