import Joi from 'joi';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import { isEmpty } from 'lodash';



//REGISTER
const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});
exports.userRegister = async (req, res, next) => {

    //validation
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({message:error.details[0].message})
    }

    // If email exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists){
        return res.status(400).send({message:'Email already exists'});
    }
    if (isEmpty(req.body)) return res.status(400).send('EROOR! No data is submitted.');
    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const user = new User({
        email: req.body.email,
        password: hashedPassword
    });

    await user.save()
        .then((doc) => {
            res.status(201).send({message:'Account registered successfully', doc})
        }).catch((err) => {
            res.status(500).send(err)
        })
}

//LOGIN
const schemaLogin = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

exports.userLogin = async (req, res) => {
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(422).send({message:error.details[0].message})

    //check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({message:"User with the email doesn't exist"});

    //Check if the passwords match
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).send({message:'Invalid login credentials'});
    if (match) {
        const accessToken = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '30m' });
        return res.status(201)
            .send({ message: 'Logged In Successfully', accessToken });
    }
    return res.send({message:'An error occurred'}).status(500)
}