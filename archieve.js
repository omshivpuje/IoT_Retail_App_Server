const express = require("express");
const router = express.Router();
const IO = require("../app").SOCKETIO;
const Archieve = require("../models/archive");
//Get status
router.get("/getAllarchives", (req, res) => {
    Archieve.getArchives((err, usersData) => {
        // console.log(usersData);
        if (err) {
            res.json({
                success: false,
                msg: "some error in archieve operation"
            });
        } else {
            if (usersData.length == 0) {
                res.json({
                    success: false,
                    msg: "no users data found"
                });
            } else {
                res.json({
                    success: true,
                    msg: usersData
                });
            }
        }
    });
});

module.exports = router;