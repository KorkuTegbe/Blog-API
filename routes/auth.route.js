// const router = require('express').Router()
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// require('dotenv').config()

// const blogController = require('../controllers/blog.controller')
// const userModel = require('../models/user.model')

// router.post('/register', async (req,res)=>{
//     try{
//         const { first_name, last_name, email, password } = req.body

//         if(!(first_name && last_name && email && password)){
//             res.status(400).json({
//                 message: 'All fields required'
//             })
//         }

//         const oldUser = await userModel.findOne({email})
//         if(oldUser){
//             res.status(409).json({
//                 message: 'User already exists. Login to continue'
//             })
//         }

//         const encryptedPassword = await bcrypt.hash(password, 10)

//         const user = await userModel.create({
//             first_name, 
//             last_name,
//             email: email.toLowerCase(),
//             password: encryptedPassword
//         })

//         // token
//         const token = jwt.sign(
//             { user_id: user._id, email},
//             process.env.TOKEN_KEY,
//             {
//                 expiresIn: '1h'
//             }
//         );

//         user.token = token

//         res.status(201).json({
//             message: 'User registration successful',
//             user: user
//         })

//     }catch(err){
//         res.send(err)
//     }
// } )

// router.post('/login', async (req,res) => {
//     try{
//         const { email, password } = req.body

//         if(!( email && password)){
//             res.status(400).json({
//                 message: 'All fields required'
//             })
//         }

//         const user = await userModel.findOne({email})
    
//         const verifyPassword = bcrypt.compare(user.password, password)
//         if(user && verifyPassword ){
//             // token
//             const token = jwt.sign(
//             { user_id: user._id, email},
//             process.env.TOKEN_KEY,
//             {
//                 expiresIn: '1h'
//             }
//             );

//             user.token = token

//             res.status(201).json({
//                 message: 'Login successful',
//                 user: user
//             })
//         }
        
//         res.status(400).json({
//             message: 'Invalid Credentials'
//         })

//     }catch(err){
//         res.send(err)
//     }
    
// })


module.exports = router