const express = require('express')
const router = express.Router()
const Queries = require('../SQL/Queries/Queries.json')
const connection = require('../database')

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
        console.log("Error in the get customers ", err);
        return res.status(500).send({
            error: "Internal Server error..."
        });
    }
});


router.get('/clients', async (req, res)=>{
    try{
        const NumOfClients = await connection.query(Queries.customerQueries.getTotalCustomers)
        res.send(NumOfClients[0][0])
    }
    catch(err){
        console.log(err)
        res.send('Some error occured')
    }
})

router.get('/salesCount', async(req, res)=>{ 
    try{
        const NumOfSales = await connection.query(Queries.orderQueries.getSales)
        res.send(NumOfSales[0][0]);
    }
    catch(err){
        console.log(err)
        res.send('Some error occured')
    }
})

router.get('/invoices', async(req, res)=>{
    try{
        const Invoices = await connection.query(Queries.invoiceQueries.getAllInvoices)
        res.send(Invoices[0])
    }
    catch(err){
        console.log(err) 
        res.send('Some error occured')  
    }
})

router.get('/shipments', async(req, res)=>{
    try{
        const shipments = await connection.query(Queries.shipmentQueries.getShipmentTables)
        res.send(shipments[0])
    }
    catch(err){
        console.log(err)
        res.send('Some error occured')
    }
})



module.exports = router;
