const router = require('express').Router()
const blogController = require('../controllers/blog.controller')
const authController = require('../controllers/auth.controller')

router.post('/', authController.authorize,  blogController.createBlog)
// router.patch('/:userId/:blogId', blogController.editBlog)



module.exports = router