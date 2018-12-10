const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req,res,next) => {
    User.findById('5c0e7df65e11c05f03572c85')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    })
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://keren:EFB2txAN8gUmOTxq@cluster0-89ged.mongodb.net/onlineShop?retryWrites=true",
    { useNewUrlParser: true }
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Keren",
          email: "hkr.he@outlook.com",
          cart: {
            item: []
          }
        });
        console.log(user);
        user.save();
      }
    });
    console.log("connect!");
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
