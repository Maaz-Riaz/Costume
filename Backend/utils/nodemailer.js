const nodemailer = require('nodemailer');

let transporter;

const initializeMailer = () => {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

const sendAdminOrderNotification = async (order) => {
  if (!transporter) initializeMailer();

  try {
    const itemsList = order.items
      .map(
        item =>
          `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${item.price?.toFixed(2) || '0.00'}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF6B9D; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .section { margin: 20px 0; }
          .label { font-weight: bold; color: #FF6B9D; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #FF6B9D; }
          .total { font-size: 20px; font-weight: bold; color: #FF6B9D; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎭 New Order Received!</h1>
          </div>

          <div class="section">
            <h2>Order Details</h2>
            <p><span class="label">Order ID:</span> ${order._id}</p>
            <p><span class="label">Order Date:</span> ${new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div class="section">
            <h2>Customer Information</h2>
            <p><span class="label">Name:</span> ${order.customerName}</p>
            <p><span class="label">Email:</span> ${order.email}</p>
            <p><span class="label">Phone:</span> ${order.phone}</p>
          </div>

          <div class="section">
            <h2>Shipping Address</h2>
            <p>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
            </p>
          </div>

          <div class="section">
            <h2>Items Ordered</h2>
            <table>
              <tr>
                <th>Product Name</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
              ${itemsList}
            </table>
          </div>

          <div class="section">
            <p><span class="label">Order Notes:</span> ${order.notes || 'None'}</p>
            <p class="total">Total Amount: $${order.totalAmount.toFixed(2)}</p>
          </div>

          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: "CostumePK",
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received - Order #${order._id}`,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending admin email:', error);
    return { success: false, error: error.message };
  }
};

const sendCustomerOrderConfirmation = async (email, order) => {
  if (!transporter) initializeMailer();

  try {
    const itemsList = order.items
      .map(
        item =>
          `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF6B9D; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .section { margin: 20px 0; }
          .label { font-weight: bold; color: #FF6B9D; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #FF6B9D; }
          .total { font-size: 20px; font-weight: bold; color: #FF6B9D; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
          </div>

          <div class="section">
            <p>Hi ${order.customerName},</p>
            <p>Thank you for your order! We're excited to get your costumes ready.</p>
            <p><span class="label">Order Reference:</span> ${order._id}</p>
          </div>

          <div class="section">
            <h2>Order Summary</h2>
            <table>
              <tr>
                <th>Product Name</th>
                <th>Size</th>
                <th>Quantity</th>
              </tr>
              ${itemsList}
            </table>
            <p class="total">Total: $${order.totalAmount.toFixed(2)}</p>
          </div>

          <div class="section">
            <p>We'll send you an email update once your order ships!</p>
          </div>

          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Order Confirmation - Order #${order._id}`,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Customer confirmation email sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending customer email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initializeMailer,
  sendAdminOrderNotification,
  sendCustomerOrderConfirmation
};
