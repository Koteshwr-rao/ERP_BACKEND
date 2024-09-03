const nodemailer = require('nodemailer');
require('dotenv').config();

const mail = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  pool: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// const formatIndianNumber = (num) => {
//   const numStr = num.toString();
//   const lastThree = numStr.substring(numStr.length - 3);
//   const otherNumbers = numStr.substring(0, numStr.length - 3);
//   if (otherNumbers !== "") {
//     return `${otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;
//   } else {
//     return lastThree;
//   }
// };
function formatIndianNumber(number) {
  const numStr = number.toString();
  let lastThreeDigits = numStr.slice(-3);
  const otherDigits = numStr.slice(0, -3);

  if (otherDigits !== '') {
    lastThreeDigits = ',' + lastThreeDigits;
  }

  const formattedNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThreeDigits;
  return formattedNumber;
}
const sendPaymentReceipt = (email, orderid , name, amountPaid, productName,quantity, receipturl) => {
  console.log(receipturl)
  const sendMail = async (mailbody) => {
    try {
      const info = await mail.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Payment Receipt for Your Recent Purchase",
        html: mailbody,
      });
      console.log("Mail sent", info.response);
    } catch (error) {
      console.error("Error sending mail", error);
    }
  };

  const mailbody = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Receipt</title>
     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Inter', Arial, sans-serif;
        background-color: #f0f0f5;
        margin: 0;
        padding: 0;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      .container {
        max-width: 800px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #007bff;
        color: #ffffff;
        padding: 20px;
        text-align: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        color: #333333;
        font-size: 16px;
        line-height: 1.5;
      }
      .content p {
        margin: 0 0 10px;
      }
      .highlight-box {
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 5px;
        margin-top: 10px;
      }
      .payment-summary {
        background-color: #e9f7ff;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
        border: 1px solid #007bff;
      }
      .order-details-table {
        width: 100%;
        border: 1px solid #ddd;
        border-collapse: collapse;
        margin-top: 10px;
      }
      .order-details-table th,
      .order-details-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .order-details-table th {
        background-color: #007bff;
        color: #ffffff;
      }
      .footer {
        background-color: #007bff;
        color: #ffffff;
        padding: 10px;
        text-align: center;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      .footer p {
        margin: 0;
        font-size: 14px;
      }
      .link {
        color: #007bff;
        text-decoration: none;
      }
      .contact-info {
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <table class="container">
      <tr>
        <td class="header">
          <h1>Payment Receipt</h1>
        </td>
      </tr>
      <tr>
        <td class="content">
          <p>Dear ${name},</p>
          <p>Thank you for your recent purchase! We have received your payment successfully.</p>
          <p>
            You can view and download the payment receipt for your purchase using the following link:<br>
            <a href="${receipturl}" class="link" target="_blank">View Payment Receipt</a>.
          </p>
          <p class="payment-summary">
            <strong>Payment Summary</strong><br />
            <strong>Amount Paid:</strong> ₹ ${formatIndianNumber(parseInt(amountPaid))}<br />
            <strong>Order ID:</strong> ${orderid}
          </p>
          <p><strong>Order Details</strong></p>
          <table class="order-details-table">
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total Paid</th>
            </tr>
            <tr>
              <td>${productName}</td>
              <td>${quantity}</td>
              <td>₹ ${formatIndianNumber(parseInt(amountPaid))}</td>
            </tr>
          </table>
          <p>If you have any questions or need further assistance, please feel free to contact us:</p>
          <p class="contact-info">
            <strong>Mobile:</strong> +91 7824036322<br />
            <strong>Email:</strong> <a href="mailto:support@b2bhubindia.com" class="link">support@b2bhubindia.com</a>
          </p>
          <p>Thank you for your business!</p>
          <p>Best regards,<br />B2BHub Support Team</p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>© B2BHUB. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;

  sendMail(mailbody);
};

module.exports = sendPaymentReceipt;
//sendPaymentReceipt('johndoe@example.com', 'John Doe', 5000, '2024-08-21', 'TXN123456', 'Product Name', 'http://example.com/invoice');
