module.exports = (fn) => {
    return (req,res,next) => {
        fn(req,res,next).catch(next)
    }
}


async(req,res,next) => {
    try {
        
    } catch (err) {
        
    }
}