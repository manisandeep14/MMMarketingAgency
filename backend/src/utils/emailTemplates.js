export const getVerificationEmailTemplate = (name, verificationUrl) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(to bottom, #f0f9ff, #ffffff);
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        color: #1e293b;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(2, 132, 199, 0.15);
        border: 1px solid #e0f2fe;
      }
      .header {
        background: linear-gradient(135deg, #38bdf8, #0ea5e9);
        padding: 28px;
        text-align: center;
        color: #ffffff;
      }
      .header h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 800;
        letter-spacing: 0.5px;
      }
      .content {
        padding: 32px;
      }
      .content h2 {
        margin-top: 0;
        font-size: 22px;
        font-weight: 700;
      }
      .content p {
        font-size: 15px;
        line-height: 1.7;
        color: #475569;
      }
      .button {
        display: inline-block;
        margin: 24px 0;
        padding: 14px 28px;
        background: linear-gradient(135deg, #38bdf8, #0ea5e9);
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 600;
        box-shadow: 0 8px 18px rgba(14, 165, 233, 0.35);
      }
      .link-box {
        background: #f0f9ff;
        padding: 14px;
        border-radius: 10px;
        word-break: break-all;
        font-size: 13px;
        color: #0369a1;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #64748b;
        background: #f8fafc;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>MM Furniture</h1>
      </div>

      <div class="content">
        <h2>Welcome, ${name}! 👋</h2>
        <p>
          Thank you for joining <strong>MM Furniture</strong>.
          Please verify your email address to activate your account.
        </p>

        <div style="text-align:center;">
          <a href="${verificationUrl}" class="button">
            Verify Email
          </a>
        </div>

        <p>If the button doesn’t work, copy and paste this link:</p>
        <div class="link-box">${verificationUrl}</div>

        <p style="margin-top:16px;">
          ⏳ This link will expire in <strong>24 hours</strong>.
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} MM Furniture · Crafted with care
      </div>
    </div>
  </body>
  </html>
  `;
};

export const getPasswordResetEmailTemplate = (name, resetUrl) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(to bottom, #f0f9ff, #ffffff);
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        color: #1e293b;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(2, 132, 199, 0.15);
        border: 1px solid #e0f2fe;
      }
      .header {
        background: linear-gradient(135deg, #38bdf8, #0ea5e9);
        padding: 28px;
        text-align: center;
        color: #ffffff;
      }
      .header h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 800;
      }
      .content {
        padding: 32px;
      }
      .content h2 {
        font-size: 22px;
        font-weight: 700;
      }
      .content p {
        font-size: 15px;
        line-height: 1.7;
        color: #475569;
      }
      .button {
        display: inline-block;
        margin: 24px 0;
        padding: 14px 28px;
        background: linear-gradient(135deg, #38bdf8, #0ea5e9);
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 600;
        box-shadow: 0 8px 18px rgba(14, 165, 233, 0.35);
      }
      .link-box {
        background: #f0f9ff;
        padding: 14px;
        border-radius: 10px;
        word-break: break-all;
        font-size: 13px;
        color: #0369a1;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #64748b;
        background: #f8fafc;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>MM Furniture</h1>
      </div>

      <div class="content">
        <h2>Hello, ${name} 👋</h2>
        <p>
          You requested a password reset. Click the button below to set a new password.
        </p>

        <div style="text-align:center;">
          <a href="${resetUrl}" class="button">
            Reset Password
          </a>
        </div>

        <p>If the button doesn’t work, use this link:</p>
        <div class="link-box">${resetUrl}</div>

        <p style="margin-top:16px;">
          ⏳ This link expires in <strong>1 hour</strong>.
        </p>

        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} MM Furniture · Secure & Trusted
      </div>
    </div>
  </body>
  </html>
  `;
};

export const getOrderConfirmationEmailTemplate = (name, orderId, totalPrice) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(to bottom, #f0f9ff, #ffffff);
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        color: #1e293b;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(2, 132, 199, 0.15);
        border: 1px solid #e0f2fe;
      }
      .header {
        background: linear-gradient(135deg, #38bdf8, #0ea5e9);
        padding: 28px;
        text-align: center;
        color: #ffffff;
      }
      .header h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 800;
      }
      .content {
        padding: 32px;
      }
      .content h2 {
        font-size: 22px;
        font-weight: 700;
      }
      .order-box {
        background: #f0f9ff;
        border-radius: 14px;
        padding: 18px;
        margin: 20px 0;
      }
      .order-box p {
        margin: 8px 0;
        font-size: 15px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #64748b;
        background: #f8fafc;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>MM Furniture</h1>
      </div>

      <div class="content">
        <h2>Thank you for your order, ${name}! 🎉</h2>
        <p>Your order has been successfully placed and is now being processed.</p>

        <div class="order-box">
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
        </div>

        <p>We’ll notify you once your order is shipped.</p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} MM Furniture · Happy Shopping 🛒
      </div>
    </div>
  </body>
  </html>
  `;
};
