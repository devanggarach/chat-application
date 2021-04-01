const joi = require("joi");
const secure = require("../config/secure");
const { validate } = require("../models/users.model");
const formValidation = {};
/*
formValidation.signup is a middleware it will be called before it goes to signup controller,
here we pass three argument req,res,next, in we get request(req) all the values passed from client machiine,
and using joi library we validate all the fields, if all validation are correct then we will move them to next, to procede into contoller,
else we give an error on retutn.
*/
    formValidation.signup = (req, res, next) => {
            const joiSchema = joi.object().keys({
            fname: joi.string().trim().min(3).required(), 
            lname: joi.string().trim().min(3).required(),
            username: joi.string().trim().min(3).required(),
            email: joi.string().trim().email().required(),
            password: joi.string().trim().min(6).max(20).required(),
            repassword: joi.any().valid(joi.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' })
        })
        const validation = joiSchema.validate({
            fname: secure.decrypt(req.body.fname),
            lname: secure.decrypt(req.body.lname),
            username: secure.decrypt(req.body.username),
            email: secure.decrypt(req.body.email),
            password: secure.decrypt(req.body.password),
            repassword: secure.decrypt(req.body.repassword)
        });
        if(validation.error){
            res.send({ "Error": validation.error })
        }
        else next();
    }

/*
formValidation.signin is a middleware it will be called before it goes to signin controller,
here we pass three argument req,res,next, in request(req) we get all the values passed from client machiine,
and using joi library we validate all the fields, if all validation are correct then we will move them to next, to procede into contoller,
else we give an error on retutn.
*/
    formValidation.login = (req, res, next) => {
        const joiSchema = joi.object().keys({
            username: joi.string().trim().required(),
            password: joi.string().trim().required()
        })
        const validation = joiSchema.validate({
            username: secure.decrypt(req.body.username),
            password: secure.decrypt(req.body.password)
        });
        if(validate.error){
            res.send({ "Error": validate.error });
        }
        else next();
    }
module.exports = formValidation;