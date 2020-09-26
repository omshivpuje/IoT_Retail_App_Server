const express = require("express");
const router = express.Router();
const IO = require("../app").SOCKETIO;
const Inventory = require("../models/inventory");
const Archive = require("../models/archive");
//Get status
var allItems = [];
router.get("/getAllItems", (req, res) => {
    Inventory.getItems((err, items) => {
        if (err) {
            res.json({
                success: false,
                msg: "some error in db operation"
            });
        } else {
            if (items.length == 0) {
                res.json({
                    success: false,
                    msg: "no items found"
                });
            } else {
                res.json({
                    success: true,
                    msg: items
                });
            }
        }
    });
});

router.post("/updateInventory", (req, res, next) => {
    var newItem = req.body;
    newItem.discount = newItem.discountPercent / 100 * newItem.price;
    newItem.discountedPrice = newItem.price - newItem.discount;
    Inventory.updateInventory(newItem, (err, item) => {
        if (err) {
            res.json({
                success: false,
                msg: "some error in db operation"
            });
        } else {
            if (!item) {
                res.json({
                    success: false,
                    msg: "no items added"
                });
            } else {
                res.json({
                    success: true,
                    msg: item
                });
            }
        }
    });
});
router.post("/addItem", (req, res, next) => {
    var newItem = req.body;
    newItem.discount = newItem.discountPercent / 100 * newItem.price;
    newItem.discountedPrice = newItem.price - newItem.discount;
    Inventory.getItemByBarCode(req.body.barCode, (err, item) => {
        if (item) {
            var updateItem = {
                barCode: item.barCode,
                quantity: Number(item.quantity) + Number(newItem.quantity),
                discountPercent: newItem.discountPercent,
                discount: newItem.discount,
                discountedPrice: newItem.discountedPrice,
                price: newItem.price
            };
            Inventory.updateItem(updateItem, {}, item => {
                res.json({
                    success: true,
                    msg: "Item Updated"
                });
            });
        } else {
            Inventory.addItem(newItem, (err, item) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: "some error in db operation"
                    });
                } else {
                    if (!item) {
                        res.json({
                            success: false,
                            msg: "no items added"
                        });
                    } else {
                        res.json({
                            success: true,
                            msg: "item purchased"
                        });
                    }
                }
            });
        }
    });
});

router.post("/purchase", (req, res, next) => {

    var count = 0;
    // console.log(req.body);
    allItems.push(req.body.itemPurchased);
    // console.log(allItems);

    allItems.forEach(items => {
        (element => {
            Inventory.getItemByBarCode(element.barCode, (err, item) => {
                var updateItem = {
                    barCode: item.barCode,
                    quantity: Number(Number(item.quantity) - Number(element.quantity))
                };
                element.quantity = updateItem.quantity;
                Inventory.purchaseItem(updateItem, {}, item => {
                    count = count + 1;
                    if (count == allItems.length) {
                        res.json({
                            success: true,
                            msg: count
                        });

                    }
                });
            });
        });
        Archive.addToArchive(req.body, (err, item) => {
            if (err) {
                // res.json({
                //     success: false,
                //     msg: "some error in db operation"
                // });
                console.log(error);
            }
            else {
                // res.json({
                //     success: true,
                //     msg: "Users data successfully Added to Archieve"
                // });
                console.log("Added user data to Archieve", req.body);
            }
        });
    });
});
module.exports = router;