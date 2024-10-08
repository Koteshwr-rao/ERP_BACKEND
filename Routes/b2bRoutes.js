const express = require("express");
const router = express.Router();
const connection = require("../database");
const xlsx = require('xlsx');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Queries = require("../SQL/Queries/Queries.json");
//const sendOrderMessage = require('../WhatsapMsgService/SendOrderDetails.js');

//const whatsappToCustomer = require('../WhatsapMsgService/sendOrderDetailsToCustomer.js');


router.post('/customerreg', async (req, res) => {
    try {
        await connection.query(Queries.customerQueries.createCustomerTable);
        const { CompanyName, PAN, gstNo, Email,Password, phoneNo, TelephoneNo, address1, address2, state, city, landmark, pincode} = req.body;
        //const formatDate = DateOfReg ? new Date(DateOfReg).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        function getCurrentDateWithoutTime() {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}/${month}/${year}`;
        }

        await connection.query(Queries.customerQueries.insertCustomer, [
            CompanyName, PAN, gstNo, Email,Password, phoneNo, TelephoneNo, address1, address2, state, city, landmark, pincode, getCurrentDateWithoutTime()
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
  

  
router.route('/login/:pan/:pwd').get(async (req, res) => {
    try {
        const { pan, pwd } = req.params;
        const [user] = await connection.query(Queries.customerQueries.getCustomerByPAN, [pan]);
        if (user.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user[0].Password !== pwd) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }
        res.status(200).json({
            message: 'Login successful',
            user: user
        });  
    } catch (err) {
        res.status(500).json({ message: "Some error occurred" });
    }
});



router.put('/resetpassword/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Password } = req.body;
        const [user] = await connection.query(Queries.customerQueries.getCustomerById, [id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.Password = Password;
        await connection.query(Queries.customerQueries.updatePassword, [Password, id]);
        res.status(200).json({ message: 'Password reset successful. Check your email for the new password.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/getUser/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [user] = await connection.query(Queries.customerQueries.getCustomerById, [id]);
        if (user.length > 0) {
            res.send(user[0]);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error" });
    }
});


// app.get('/send-whatsappmsg',async (req,res)=>{
//     await sendWhatsappMessage("Test Solutions","7075965619","ord123456","Black UradDal","120",10560000.00,"https://res.cloudinary.com/dtgnotkh7/image/upload/v1725293713/xjfc6zzp5jshlvdghz5r.pdf")
//     res.send("message sent")
// })


router.post('/orders/:customerId', async (req, res) => {
    try {
        await connection.query(Queries.orderQueries.createOrderTable);
        const {
            gstNo, productName, productQuantity, productType, totalAmount, invoiceUrl
        } = req.body;
        const customerId = req.params.customerId
        const productId = await connection.query("SELECT productId FROM Product WHERE productName = ?", [productName])
        const CompanyName = await connection.query("SELECT CompanyName FROM Customer WHERE customerId = ?", [customerId])
        console.log(CompanyName[0][0].CompanyName)
        //const formatDate = dateOfOrder? new Date(dateOfOrder).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        function getCurrentDateWithoutTime() {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}/${month}/${year}`;
        }

        await connection.query(Queries.orderQueries.insertOrder, [
            customerId,CompanyName[0][0].CompanyName, gstNo, productId[0][0].productId, productName, productQuantity, productType, getCurrentDateWithoutTime(), totalAmount, invoiceUrl
        ])  
          
        // await sendOrderMessage(
        //     CompanyName[0][0].CompanyName, 
        //     '9347639776',
        //     ' ', 
        //     productName, 
        //     productQuantity, 
        //     totalAmount, 
        //     invoiceUrl
        // );
        res.send({ message: "Order created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Order creation failed", error: err });
    }
});



router.get("/getorders", async (req, res) => {
    try {
        const query = `SELECT * FROM orderDetails`;
        const result = await connection.query(query);
        return res.status(200).send(result[0]);
    } catch (error) {
        console.log("Error in the getorders ", error);
        return res.status(500).send({
            error: "Internal Server error..."
        })
    }
})


router.get("/getorder/:orderId", async (req, res) => {
    try {
        const order_id = req.params.orderId;
        const query = `SELECT * FROM orderDetails WHERE orderId = ?`;
        const result = await connection.query(query, [order_id]);
        return res.status(200).send(result[0]);
    } catch (error) {
        console.log("Error in the getorders ", error);
        return res.status(500).send({
            error: "Internal Server error..."
        })
    }
});


router.post('/transaction/:orderid', async (req, res) => {
    try {
        await connection.query(Queries.transactionQueries.createTransactionTable);
        const { orderid } = req.params;
        const OrderId = orderid;
        let { accountNo, transactionId, dateOfTransaction, transactionType, Amount} = req.body;
        if (!transactionType) {
            transactionType = 'credit';
        }
        
        const formatDate = dateOfTransaction ? new Date(dateOfTransaction).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        
        const orderIDQuery = "SELECT orderId FROM orderDetails WHERE paymentStatus = 0 ORDER BY orderId DESC LIMIT 1";
        
        const [lastOrder] = await connection.query(orderIDQuery);
        if (lastOrder.length === 0) {
            return res.status(400).send({ message: "No pending orders found" });
        }
        await connection.query(Queries.transactionQueries.insertTransactions, [OrderId, accountNo, transactionId, formatDate, transactionType, Amount]);
        res.send({ message: "updated" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error" });
    }
});


module.exports = router;