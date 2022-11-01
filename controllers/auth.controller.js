require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user.model')


  
const signup = async (req,res) => {
    try{
        const {email, first_name, last_name, password, passwordConfirm} = req.body
    // input validation
        if(!(email && first_name && last_name && password && passwordConfirm)){
            res.status(400).json({
                status: 'failed',
                message: 'All fields are required'
            })
        }

        // check if user already exists
        const oldUser = await User.findOne({email})
        if(oldUser){
            res.status(409).json({
                status: 'failed',
                message: 'User already exists. Please login'
            })
        }
        // if passwords match
        
        const user = await User.create({
            email,
            first_name,
            last_name,
            password,
            passwordConfirm
        })

        
        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        const cookieOptions = {
            expires: new Date(
            //   Date.now() + process.env.jwt_cookie_expires * 60 * 60 * 1000
                Date.now() + 1 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        
          //Send Token To Client
        res.cookie('jwt', token, cookieOptions);

        res.status(201).json({
            status: 'success',
            message: 'signup successful',
            data: {
                user,
                token
            }
        })         
        
    }catch(err){
        res.status(500).json({
            message: 'oops something went wrong',
            data: err
        })
    }
    
}

const login = async (req, res) => {

    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        // user.token = token;
        const cookieOptions = {
            expires: new Date(
            //   Date.now() + process.env.jwt_cookie_expires * 60 * 60 * 1000
                Date.now() + 1 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        
          //Send Token To Client
        res.cookie('jwt', token, cookieOptions);

        // user
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                userId: user.id,
                email: user.email,
                token
            }
        });
      }else{
        res.status(400).json({
            message: 'Incorrect login details'
        });
      }
      
    } catch (err) {
      console.log(err);
    }
};

const reset = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    signup,
    login,
    reset
}