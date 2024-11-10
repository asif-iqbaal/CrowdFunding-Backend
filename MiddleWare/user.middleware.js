import jwt from 'jsonwebtoken'
// MIDDLEWARE TO CHECK USER ARE AUTHENTICATED OR NOT
function userMiddleware(req,res,next){  
   // console.log(req.cookies['token']);
    const token = req.headers.authorization;
   // console.log("token is" , token);
    const word = token.split(" ");
    //console.log(word);
    const jwtToken = word[1];
   // console.log(jwtToken);
    const decodedValue = jwt.verify(jwtToken,process.env.JWT_SECRET);
   // console.log(decodedValue);
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