require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app=express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect(process.env.Mongo);

const itemSchema={
    name:String
};

const Item=mongoose.model("Item",itemSchema);

const Item1=new Item({
    name:"Meditation"
});
const Item2=new Item({
    name:"developing a website"
});
const Item3=new Item({
    name:"learning a new recipe"
});

const defaultItems=[Item1,Item2,Item3];

app.get("/",function(req,res){
    
    var today=new Date();
    var options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };

    var day=today.toLocaleDateString("en-US",options);
  
      
    Item.find().then(response =>{
        if(response.length===0){
            Item.insertMany(defaultItems);
            res.redirect("/");
        }
        else{

            res.render("list",{ListTitle:day,newListItems:response});  
        }
    });
    
    

})

app.post("/",function(req,res){
    const itemName=req.body.newItem;
   
    const item=new Item({

        name:itemName
    });

    item.save();

    res.redirect("/");
    
})

app.post("/delete",async function(req,res){

    const checkedItemId=req.body.checkbox;
    
    await Item.findByIdAndRemove(checkedItemId);
    res.redirect("/");
});

app.get("/work",function(req,res){
    res.render("list",{ListTitle:"Work List",newListItems:workItems});  

})

app.listen(3000,function(){
    console.log("server running on port 3000");
})
