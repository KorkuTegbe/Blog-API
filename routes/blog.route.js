const router = require('express').Router()
const blogController = require('../controllers/blog.controller')
const authController = require('../controllers/auth.controller')

router.post('/', authController.authorize,  blogController.createBlog)
router.get('/', blogController.getBlogs)
router.patch('/update/:id', authController.authorize, blogController.updateBlog)
router.delete('/delete/:id', authController.authorize, blogController.deleteBlog)



module.exports = router