require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Blog = require("../models/blog.model");
const appError = require('../utils/appError')
const slugify = require('slugify')


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

    let query = Blog.find({state : 'published'});

    if (req.query.state == 'draft') {
        return next(new appError(403, 'You cannot access unpublished articles!'));
    } else {
        query = Blog.find(req.query);
    }

    if (req.query.author) {
        const author = req.query.author;
        const user = await User.findOne({ username: author });
        const ID = user.id;
        query = Blog.find({ author: ID });
    }
    
    if (req.query.tag) {
        const tag = req.query.tag.split(',');
        query = Blog.find({ tags: tag });
    }

    if (req.query.title) {
        const title = req.query.title;
        query = Blog.findOne({ title: title });
    }

    if (req.query.read_count) {
        const read_count = req.query.read_count;
        query = Blog.findOne({ read_count: read_count });
    }

    if (req.query.reading_time) {
        const reading_time = req.query.reading_time;
        query = Blog.findOne({ reading_ti: reading_time });
    }

    const page = req.query.page * 1 || 1;
    const per_page = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(per_page);

    const blog = await query
    if (blog.length == 0) return next(new appError(403, 'No Blog Found'))

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