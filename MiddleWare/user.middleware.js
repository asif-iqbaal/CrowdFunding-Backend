import jwt from 'jsonwebtoken'
// MIDDLEWARE TO CHECK USER ARE AUTHENTICATED OR NOT
function userMiddleware(req,res,next){  
    const token = req.headers.authorization;
    const word = token.split(" ");
    const jwtToken = word[1];
    const decodedValue = jwt.verify(jwtToken,process.env.JWT_SECRET);
    if(decodedValue.user.username){
        req.username = decodedValue.user.username;
        req._id = decodedValue.user.id;
        next();
    }
    else{
        res.status(403).json({
            msg : "you are not authenticated"
        })
    }
}
export default userMiddleware;