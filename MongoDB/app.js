const express = require('express')
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://temp:passwordpassword@cluster0.vpus0l7.mongodb.net/UserData?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log("Connect to database"))
.catch((err) => console.log("New error", err));

const userSchema = new mongoose.Schema({
    firstname : {
        required : true,
        type : String,
    },
    lastname : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    jobTitle : {
        type : String
    },
    gender : {
        type : String,
        required : true
    },
},
{timestamps :true}
);

const User = mongoose.model('user', userSchema);


app.get("/hello", (req,res) => {
    res.send("Hello WORLD!!");
})

app.get("/json", (req,res) => {
    res.json({"msg" : "hello world!"});
})

app.get("/api/users", async(req,res) => {
    try{
        const users = await User.find();
        res.json(users);
    }
    catch(e) {
        res.send(500).json({
            "msg" : "Error fetching users"
        });
    }
});

app.get("/api/users/:user", async(req,res) => {
    try{
        const users = await User.findById(req.params.user);
        res.json(users);
    }
    catch(e) {
        res.status(500).json({
            "msg" : "Error fetching users"
        });
    }
});




app.post("/api/users", async (req,res) => {
    const body = req.body;
    if (
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ){
        return res.status(400).json({msg : "All fields are required"})
    }

    const result = await User.create({
    firstname : body.first_name,
    lastname : body.last_name,
    email : body.email,
    gender : body.gender,
    jobTitle : body.job_title
});
    return res.status(201).json({
        msg: "success"
    })
});


app.patch("/api/users/:id", async (req,res) => {
    const request = await User.findByIdAndUpdate(req.params.id, {lastname : "Changed"});
    res.json({status : "Updated"});

})


app.delete("/api/users/:user", async (req, res)=> {
    try{
        const  result = await User.findByIdAndDelete(req.params.user);
    if(!result) {
        res.status(404).json({msg : "The user does not exist"});
    }
    res.json({"msg" : "User deleted"});
    } catch(err) {
        res.status(500).json({
            "Error" : err.msg
        })
    }
});



app.listen(3000, () => {
    console.log("Listening to port 3000");
})