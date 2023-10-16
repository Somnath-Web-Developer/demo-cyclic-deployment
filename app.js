//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const { default: mongoose } = require("mongoose");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

mongoose.connect("mongodb+srv://Somnath:somnath1678@cluster0.obcpts6.mongodb.net/todolistDB");

const itemSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
  name: "Welcome to your todolist."
});
const item2 = new Item ({
  name: "Hit + button to add a new item."
});
const item3 = new Item ({
  name: "<--- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];




app.get("/", function(req, res) {

  if (defaultItems === 0) {

  }

  Item.find()
  .then(function(foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems)
      .then(function(){
        console.log("Successfully saved default items to DB.");
      })
      .catch(function(err){
        console.log(err);
      });
      res.redirect("/");
    } else {

      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })
  .catch(function(err){
    console.log(err);
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
   const item = new Item  ({
    name: itemName,
   });

   item.save();
   res.redirect("/")

});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox ;
  Item.findByIdAndRemove(checkedItemId)
  .then(function() {
    console.log("Successfully Deleted!");
    res.redirect("/")
  })
  .catch(function(err) {
    console.log(err);
  });
  
});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

// app.get("/:customListName" , function(req, res) {
//   const customListName = req.params.customListName;

  

//   list.save();

//   // List.findOne({name: customListName}, function(err, fouundList){
//   //   if (!err) {
//   //     if (!fouundList) {
//   //       console.log("Doesn't exist");
//   //     } 
//   //   } else {
//   //     console.log("Exists");
//   //   }
//   // })

//   List.findOne({name: customListName})
//   .then (function (fouundList) {
//     if (!fouundList) {
//       const list = new List({
//         name: customListName,
//         items: defaultItems
//       });

//       list.save();
//     } else {
//       res.render ("list", {listTitle: fouundList.name , newListItems: fouundList.items});
//     }
//   })
//   .catch(function(err) {
//     console.log(err);
//   })
// });

const PORT = process.env.PORT || 3000

app.listen(PORT, function() {
  console.log(`Server started on port ${port}`);
});