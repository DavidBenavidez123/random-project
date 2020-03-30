const express = require("express");

const router = express.Router();

const userRoute = require("../routes/user");

router.use("/user", userRoute);


router.get("/", (req, res) => {
    res.send("API works.");
});

module.exports = router;