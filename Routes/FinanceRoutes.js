const express = require("express");
const router = express.Router();
const connection = require("../database");
const xlsx = require('xlsx');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Queries = require("../SQL/Queries/Queries.json");



router.post('/customerreg', async (req, res) => {
    try {
        await connection.query(Queries.customerQueries.createCustomerTable);

        const CompanyName = req.body.CompanyName || ''; 
        const PAN = req.body.PAN || null;
        const gstNo = req.body.gstNo || null;
        const Email = req.body.Email || null;
        const Password = req.body.Password || null;
        const phoneNo = req.body.phoneNo || ''; 
        const TelephoneNo = req.body.TelephoneNo || null;
        const address1 = req.body.address1 || null;
        const address2 = req.body.address2 || null;
        const state = req.body.state || null; 
        const city = req.body.city || null; 
        const landmark = req.body.landmark || null;
        const pinCode = req.body.pinCode || null;
        const DateOfReg = getCurrentDateWithoutTime();

        function getCurrentDateWithoutTime() {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}/${month}/${year}`;
        }

        await connection.query(Queries.customerQueries.insertCustomer, [
            CompanyName, PAN, gstNo, Email, Password, phoneNo, TelephoneNo, address1, address2, state, city, landmark, pinCode, DateOfReg
        ]);

        res.send({ message: "Customer created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "User creation failed", error: err });
    }
});


router.post('/cusReg', upload.single('file'), async (req, res) => {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const customers = xlsx.utils.sheet_to_json(worksheet);
  
    try {
      await connection.query(Queries.customerQueries.createCustomerTable);
  
      for (const customer of customers) {
        let { 
             CompanyName, PAN, gstNo, Email, Password, phoneNo, TelephoneNo, address1, address2, state, city, landmark, pinCode, DateOfReg
        } = customer;
  
        await connection.query( Queries.customerQueries.insertCustomer, [
            
            CompanyName, PAN, gstNo, Email, Password, phoneNo, TelephoneNo, address1, address2, state, city, landmark, pinCode, DateOfReg
        ])
  
        console.log(`Customer ${customer.CompanyName} added successfully`);
      }
  
      res.send({ message: "Customers added successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "An error occurred while adding customers" });
    }
  });
  


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

router.get('/getAllTransactions', async (req, res) => {
    try {
        const query = Queries.transactionQueries.getAllTransactions;
        const [results] = await connection.query(query);
        return res.status(200).send(results);
    } catch (error) {
        console.log("Error in the getAllTransactions endpoint:", error);
        return res.status(500).send({
            error: "Internal Server error..."
        });
    }
});

module.exports = router

