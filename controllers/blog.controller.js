require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Blog = require("../models/blog.model");
const appError = require('../utils/appError')


const readingTime = (blog) => {
    const wordCount = blog.split(' ').length
    // assuming the average person reads 200 words a minute
    const wordsPerMin = wordCount / 200
    return Math.round(wordsPerMin) === 0 ? 1 : Math.round(wordsPerMin)
}

exports.createBlog = async (req, res, next) => {
  try {
        req.body.author = req.user

        const blog = await Blog.create(req.body)
        
        blog.reading_time = readingTime(blog.body)

        blog.save()

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

    const { query } = req
        const { state, 
            page = 1, 
            per_page = 5, 
            author, 
            title, 
            tags, 
            read_count, 
            reading_time, 
            createdAt,
            order_by = 'reading_time',
            order = 'asc' } = query

        const findQuery = {}
        const sortQuery = {}
        
        findQuery.state = 'published'
        
        if(state){
           if (state=='draft'){
            return next(new appError(403, 'You cannot view unpublished blogs'))
            } 
        }
        
        
        if(author){
            findQuery.author = author
        }
        if(title){
            findQuery.title = title
        }
        if(tags){
            // findQuery.tags = tags
            findQuery.tags =  { $in: tags }
        }

        if (createdAt){
            sortQuery.createdAt = {
                $gt: new Date(createdAt).toISOString(),
                $lt: new Date(createdAt).toISOString(),
            }
        }

        const sortAttributes = order_by.split(',')

        for(const attribute of sortAttributes){
            if(order === 'asc' && order_by){
            sortQuery[attribute] = 1
            } else {
                sortQuery[attribute] = -1
            }
        }
        

        const blog = await Blog.find()
        .find(findQuery)
        .sort(sortQuery)
        .skip(page)
        .limit(per_page)

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
        const blog = await Blog.findById(blogId)
        
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


exports.getOwnerBlogs = async (req,res,next) => {
    try{
        // get userId
        const userId = req.params.id
        const { query } = req
        const { state, page = 1, per_page = 20 } = query

        const findQuery = {}

        if(state){
            findQuery.state = state
        }
        // query db to find all blogs with author whose id is userId
        const blogs = await Blog.find({author:userId})
        .find(findQuery)
        .skip(page)
        .limit(per_page)

        // response
        res.status(200).json({
            status: 'success',
            results: blogs.length,
            data: {
                blogs
            }
        })
    }catch(err){
        return new appError(err.statusCode, err)
    }
}


exports.getABlog = async (req,res,next) => {
    try{
        const { blogId } = req.params
        const blog = await Blog.findById(blogId)
        // return only published blogs
        if(blog.state == 'published'){
            blog.read_count += 1
            blog.save()

            res.status(200).json({
                status: 'success',
                data: {
                    blog
                }
            })
        }else{
            res.status(200).json({
                status: 'failed',
                message: 'Blog is not published'
            })
        }

    }catch(err){
        return new appError(err.statusCode, err)
    }
}