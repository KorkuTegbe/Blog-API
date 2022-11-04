require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Blog = require("../models/blog.model");
const appError = require('../utils/appError')

exports.createBlog = async (req, res, next) => {
  try {
        req.body.author = req.user
        const blog = await Blog.create(req.body)
        // Response
        return res.status(201).json({
        status: "success",
        data: {
                blog,
              },
        });

    } catch (err) {
        return next(new appError(err.statusCode, err))
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
        const blogId = req.params.id
        const body = req.body
        const blog = await Blog.findById(blogId)
        console.log(blog)
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
        console.log(err)
        return new appError(err.statusCode, err)
    }   
}


exports.deleteBlog = async (req,res,next) => {
    try{
        //  1.get blog id and search
        const blogId = req.params.id
        const blog = await Blog.findById(blogId)

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