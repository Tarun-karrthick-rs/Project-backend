var express=require('express')
var mdb=require('mongoose')
var cors=require('cors')
var bodyParser=require('body-parser')
var User=require('./models/users.js')
var app=express()
var allowedOrigins=["http://localhost:3000" ,"https://project-frontend-eta-seven.vercel.app"]
app.use(
    cors({
        origin:allowedOrigins,
        credentials:true,
        methods:["GET","POST"]
    })
)
app.use(
    bodyParser.json()
)
mdb.connect("mongodb+srv://Tarun_Karrthick_R_S:tarun%402004@globalserver.iee3z.mongodb.net/Profile")
var db=mdb.connection
db.once("open",()=>{
    console.log("MongoDB connection successful")
})
app.get("/",(req,res)=>{
    res.send("Welcome to backend Server")
})
app.post("/login",async(request,response)=>{
    try {
        const { email, username, password } = request.body;
        let user = await User.findOne({ email: email });
        if (user) {
            if (user.password === password) {
                console.log("Login Successful");
                return response.send("Login Success");
            } else {
                console.log("Invalid password for email");
                return response.send("Invalid Password");
            }
        }
        user = await User.findOne({ username: username });
        if (user) {
            if (user.password === password) {
                console.log("Login Successful");
                return response.send("Login Success");
            } else {
                console.log("Invalid password for username");
                return response.send("Invalid Password");
            }
        }

        console.log("Account doesn't exist");
        return response.send("Account Doesn't Exist");

    } catch (error) {
        console.error("Error during login:", error);
        return response.status(500).json({ message: "An error occurred during login" });
    }
})
app.post("/signup",async(request,response)=>{
    try {
        var { email, fullname, username, password, confirmpassword } = request.body;
        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return response.send("Account already exist!")
        }
        existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return response.send("Account already exist!")
        }
        if (password !== confirmpassword) {
            return response.send("Password doesn't match")
        }

        var newUser = new User({
            email: email,
            username: username,
            fullname: fullname,
            password: password,
            confirmpassword: confirmpassword
        });

        await newUser.save();
        return response.send("Sign Up Successful")

    } catch (error) {
        console.error("Error during signup:", error);
        return response.status(500).json({ message: "An error occurred during signup" });
    }
})
app.listen(4000,()=>console.log("backend started"))