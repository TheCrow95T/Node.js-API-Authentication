const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async(req,res)=>{
    //data validate before create
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0],message);

    //Is user in database? check
    const emailExist = await User.findone({email: req.body.email})
    if (emailExist){return res.status(400).send('Email already exist')}

    //Hash password to not save raw password
    const salt = await bcrypt.gentSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        date: req.body.date
    });

    try {
        const saveUser = await  user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

//login
router.post('/login', async (req,res)=>{
    const {error} = loginValidation(req.body);
    if (error) {return res.status(400).send(error.details[0],message)};

    //Is user in database? check
    const user = await User.findOne({email: req.body.email})
    if (!user){return res.status(400).send('Email is not found')};

    //is password correct?
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass){return res.status(400).send('Invalid password')};

    //Create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    
    res.header('auth-token',token).send('token');
})


module.exports = router;