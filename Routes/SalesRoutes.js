const express = require("express");
const router = express.Router();
const connection = require("../database");
const Queries = require("../SQL/Queries/Queries.json");



router.get('/allCustomers', async (req, res) => {
    try{
        const query = "SELECT * FROM Customer";
        const result = await connection.query(query);
        return res.status(200).send(result[0]);
    }catch(error){
        console.log("Error in the getcustomers ", error);
        return res.status(500).send({
            error: "Internal Server error..."
        })
    }
});


router.get('/customers', async (req, res) => {
    try {
        const query = Queries.customerQueries.getCustomers;
        const [results] = await connection.query(query);
        return res.status(200).send(results);
    } catch (err) {
        console.log("Error in the getcustomers ", err);
        return res.status(500).send({
            error: "Internal Server error..."
        });
    }
});


router.get('/viewOrders/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const query = Queries.orderQueries.getCustomerOrders;
        const [results] = await connection.query(query, [customerId]);
        return res.status(200).send(results);
    } catch (err) {
        console.log("Error in the getcustomers ", err);
        return res.status(500).send({
            error: "Internal Server error..."
        });
    }
});


router.get('/stateSales', async (req, res) => {
    try {
        const query = Queries.orderQueries.getStateSales;
        const [results] = await connection.query(query);
        return res.status(200).send(results);
    } catch (err) {
        console.log("Error in the getcustomers ", err);
        return res.status(500).send({
            error: "Internal Server error..."
        });
    }
});


module.exports = router