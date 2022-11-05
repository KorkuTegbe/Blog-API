const router = require('express').Router()
const blogController = require('../controllers/blog.controller')
const authController = require('../controllers/auth.controller')

router.post('/', authController.authorize,  blogController.createBlog)
router.get('/', blogController.getBlogs)
router.get('/:blogId', blogController.getABlog)
router.patch('/update/:blogId', authController.authorize, blogController.updateBlog)
router.get('/:id', authController.authorize, blogController.getOwnerBlogs)
router.delete('/delete/:blogId', authController.authorize, blogController.deleteBlog)



module.exports = router