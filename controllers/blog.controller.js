require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Blog = require("../models/blog.model");
const appError = require('../utils/appError')

exports.createBlog = async (req, res) => {
  try {
    // const { title, tags, body, description } = req.body;
    // const { userId } = req.params;
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    //   return res.status(403).json({
    //     status: 403,
    //     message: "FORBIDDEN",
    //   });
    // }

    // const token = authHeader.split(" ")[1];

    // // verify token
    // const verifyToken = jwt.verify(token, process.env.TOKEN_KEY);
    
    // const readingTime = "2mins"; //algo to calc reading time
    // if(verifyToken.user_id == userId){
        
        // const blog = await Blog.create({
        //     title,
        //     tags,
        //     body,
        //     description,
        //     author: verifyToken.user_id,
        //     reading_time: readingTime,
        // });
        req.body.author = req.user_id
        // console.log(req.body.author)
        const blog = await Blog.create(req.body)
    // Response
        return res.status(201).json({
        status: "success",
        data: {
                blog,
              },
            });
        // }else{
        //     return res.status(403).json({
        //         status: "failed",
        //         message: "log in",
        //     })
        // }

    } catch (err) {
        // res.status(err.statusCode).json({
        //     status: statusCode,
        //     message: 'Something went wrong'
        // })
        return next(new appError)
  }
}

