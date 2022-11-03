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

exports.getBlogs = async (req,res,next) => {
    let query = Blog.find();

    if (req.query.state == 'draft'){
        return next(new appError(403, 'You cannot view unpublished blogs'))
    }else{
        query = Blog.find(req.query)
    }
    const blog = await query;

    res.status(200).json({
        status: 'success',
        results: blog.length,
        data: {
            blog
        }
    })
}

exports.updateBlog = async (req,res,next) => {
    try{
        //  1.get blog id and search
        const blogId = req.params.blogId
        const body = req.body
        const blog = await Blog.find(blogId)

        // when blog is not found
        if(!blogId) return next(new appError(404, 'Blog not found'))

        // is user blog owner? do update
        if(blog.author.id === req.user.id){
            const update = await Blog.findByIdAndUpdate(blogId, body, {
                new: true,
                runValidators: true,
            })

            res.status(200).json({
                status: 'success',
                data: {
                    update
                }
            })

        }else{
            return next(new appError(403, 'Unauthorized'))
        }
    }catch (err){
        return new appError(err.statusCode, err)
    }   
}


exports.deleteBlog = async (req,res,next) => {
    try{
        //  1.get blog id and search
        const blogId = req.params.blogId
        const blog = await Blog.find(blogId)

        // when blog is not found
        if(!blogId) return next(new appError(404, 'Blog not found'))

        // is user blog owner? do update
        if(blog.author.id === req.user.id){
            const blogToDelete = await Blog.findByIdAndDelete(blogId)

            res.status(200).json({
                status: 'success',
                data: null
            })

        }else{
            return next(new appError(403, 'Unauthorized, you cannot delete this blog'))
        }
    }catch (err){
        return new appError(err.statusCode, err)
    }   
}