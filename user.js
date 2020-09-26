const express = require("express");
const router = express.Router();
const IO = require("../app").SOCKETIO;
const User = require("../models/user");

// Retrive all users details
router.get("/getAllUsers", (req, res) => {
    console.log(req.body);
    
    User.getUsers((err, users) => {
        if (err) {
            res.json({
                success: false,
                msg: "some error in db operation"
            });
        } else {
            if (users.length == 0) {
                res.json({
                    success: false,
                    msg: "no users found"
                });
            } else {
                res.json({
                    success: true,
                    msg: users
                });
            }
        }
    });
});

router.post("/register", (req, res, next) => {
    User.getUserByEmail(req.body.email, (err, user) => {
        if (user) {
            res.json({
                success: false,
                msg: "user allready exists"
            });
        } else {
            User.addUser(req.body, (err, user) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: "some error in db operation"
                    });
                } else {
                    if (!user) {
                        res.json({
                            success: false,
                            msg: "no users added"
                        });
                    } else {
                        res.json({
                            success: true,
                            msg: user
                        });
                    }
                }
            });
        }
    });
});

router.delete("/deleteUserByName/:name", (req, res, next) => {
    name = req.params.name;
    User.deleteUserByName(name, (err, user) => {
        if (!user) {
            res.json({
                success: false,
                msg: "user is not present"
            });
        } else {
            res.json({
                success: true,
                msg: user
            });
        }
    });
});

router.put("/updateUserInfo/:name", (req, res, next) => {
    User.updateUser(req.params.name, req.body, (err, user) => {
        if (!user) {
            res.json({
                success: false,
                msg: "user is not present"
            });
        } else {
            res.json({
                success: true,
                msg: user
            });
        }
    });
});

router.post("/login", (req, res, next) => {
    User.getUserByEmail(req.body.email, (err, user) => {
        if (!user) {
            res.json({
                success: false,
                msg: "user not registered"
            });
        } else {
            if (user.password == req.body.password) {
                res.json({
                    success: true,
                    msg: user
                });
            } else {
                res.json({
                    success: false,
                    msg: "password missmatch"
                });
            }
        }
    });
});
module.exports = router;