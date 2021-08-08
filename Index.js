const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json({ limit: 100000000 }));

const userRoute = require('./routs/User')
app.use("/user", userRoute);

const updateRoute = require('./routs/Update')
app.use("/update", updateRoute);


app.listen(3001, (req, res) =>
{
    console.log('server running');
});