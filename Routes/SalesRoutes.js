const express = require('express')
const router = express.Router()
const Queries = require('../SQL/Queries/Queries.json')
const connection = require('../database')


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
