const nodemailer = require("nodemailer");
const SuperAdmin = require('../src/super-admin/super-admin-model');
const Services = require('../src/services/services-model');


const getSuperAdminEmail = async () => {
  try {
    const superAdmin = await SuperAdmin.find();

    return superAdmin[0].email;

  } catch (e) {
    console.log("error in to get super admin email", e);
  }
}


const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Replace with your SMTP server host
  port: 465, // Replace with your SMTP server port
  secure: true, // true for 465, false for other ports
  auth: {
    user: "info@gromedia.co.in", // Replace with your SMTP server username
    pass: "@Gromedia2024", // Replace with your SMTP server password
  },
});

const sendMail = ({ to, subject, html, from = "info@gromedia.co.in" }) => {
  return new Promise((resolve, reject) => {
    // console.log({ to, subject, html, from: "rahul@techcarrel.com" });
    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.log("error on email send ", error);
        return reject(error);
      }
      //   console.log("Email Send Successfully", info);
      resolve(info);
    });
  });
};

exports.sendOtpSubAdmin = async (data) => {
  const { name, otp, username } = data;

  const body = `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #4CAF50;
                padding: 10px 0;
                text-align: center;
                color: #ffffff;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content p {
                font-size: 18px;
                line-height: 1.6;
                color: #333333;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 10px 0;
                background-color: #f4f4f4;
                color: #777777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Login OTP Verification</h1>
            </div>
            <div class="content">
                <p>Dear ${name},</p>
                <p>We received a request to log in to your sub-admin account. Please use the following OTP to complete your login process:</p>
                <div class="otp">${otp}</div>
                <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email or contact support immediately.</p>
                <p>Thank you,</p>
                <p>Your Company Name</p>
            </div>
            <div class="footer">
                <p>If you have any questions, feel free to <a href="mailto:support@yourcompany.com">contact our support team</a>.</p>
            </div>
        </div>
    </body>
    </html>`;

  const subject = "Otp to login.";
  return await sendMail({ to: username, subject, html: body });
};

exports.sendLoginCredentials = async (data) => {
  const { name, password, username } = data;

  const body = `<!DOCTYPE html>
  <html>
  <head>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              background-color: #4CAF50;
              padding: 10px 0;
              text-align: center;
              color: #ffffff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
          }
          .content p {
              font-size: 18px;
              line-height: 1.6;
              color: #333333;
          }
          .credentials {
              margin: 20px 0;
          }
          .credentials p {
              font-size: 18px;
              line-height: 1.6;
              color: #333333;
              background-color: #f4f4f4;
              padding: 10px;
              border-radius: 5px;
          }
          .footer {
              text-align: center;
              padding: 10px 0;
              background-color: #f4f4f4;
              color: #777777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Welcome to [Your Company Name]</h1>
          </div>
          <div class="content">
              <p>Dear ${name},</p>
              <p>Welcome! You have been granted sub-admin access to our system. Below are your login credentials:</p>
              <div class="credentials">
                  <p><strong>Email:</strong> ${username}</p>
                  <p><strong>Password:</strong> ${password}</p>
              </div>
              <p>To get started, please log in using the following link:</p>
              <p><a href="https://dilsey.in/sub-admin/login" target="_blank">https://dilsey.in/sub-admin/login</a></p>
              <p>We recommend changing your password after your first login for security reasons. If you have any questions or need assistance, feel free to reach out to our support team.</p>
              <p>Thank you,</p>
              <p>Your Company Name</p>
          </div>
          <div class="footer">
              <p>If you have any questions, feel free to <a href="mailto:support@yourcompany.com">contact our support team</a>.</p>
          </div>
      </div>
  </body>
  </html>`;

  const subject = "Login Credentials";
  return await sendMail({ to: username, subject, html: body });
};

exports.sendResetPasswordUser = async (data) => {
  const { username, token } = data;
  const resetLink = process.env.BASE_URL + `/user/reset-password/${token}`;

  const body = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          color: #333333;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333333;
        }
        .content {
          line-height: 1.6;
        }
        .content p {
          margin: 0 0 20px 0;
        }
        .button {
          text-align: center;
          margin: 30px 0;
        }
        .button a {
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #007BFF;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          color: #888888;
          font-size: 12px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello ${username},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div class="button">
            <a href="${resetLink}" target="_blank">Reset Password</a>
          </div>
          <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
          <p>Thanks,<br>Your Company Team</p>
        </div>
        <div class="footer">
          <p>If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
        </div>
      </div>
    </body>
    </html>`;

  const subject = "Reset Password";
  return await sendMail({ to: username, subject, html: body });
};

exports.sendResetPasswordSubAdmin = async (data) => {
  const { username, token } = data;
  const resetLink = process.env.BASE_URL + `/sub-admin/reset-password/${token}`;

  const body = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          color: #333333;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333333;
        }
        .content {
          line-height: 1.6;
        }
        .content p {
          margin: 0 0 20px 0;
        }
        .button {
          text-align: center;
          margin: 30px 0;
        }
        .button a {
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #007BFF;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          color: #888888;
          font-size: 12px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello ${username},</p>
          <p>We received a request to reset your password for your sub-admin account. Click the button below to reset it:</p>
          <div class="button">
            <a href="${resetLink}" target="_blank">Reset Password</a>
          </div>
          <p>If you did not request a password reset, please ignore this email or contact support if you have any questions.</p>
          <p>Thank you,<br>Your Company Team</p>
        </div>
        <div class="footer">
          <p>If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
        </div>
      </div>
    </body>
    </html>`;

  const subject = "Reset Password";
  return await sendMail({ to: username, subject, html: body });
};

exports.sendVerificationEmailUser = async (data) => {
  const { username, otp } = data;

  const body = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your recovery email</title>
    <style>
        body {
            margin: 0 auto;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid gainsboro;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .logo {
            margin-bottom: 20px;
        }

        .title {
            font-size: 24px;
            color: black;
            font-weight: 500;
            margin-top: 5%;
            margin-bottom: 5%;
        }

        .message {
            font-size: 16px;
            color: #272727;
            margin-bottom: 20px;
            line-height: 1.5;
            text-align: left;
        }

        .code {
            font-size: 36px;
            color: black;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }

        .note {
            font-size: 14px;
            color: #272727;
            text-align: left;
            margin-top: 20px;
            margin-bottom: 5%;
            line-height: 1.5;
        }

        .footer{
            color: #4a4a4a;
            font-size: 12px;
            max-width: 600px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div style="margin: 0 auto">
        <div class="container">
            <div class="logo">
                <img src="https://nivishka.com/assets/images/logo_landscape.png" style="width: 180px;"
                    alt="Google Logo">
            </div>
            <div class="title">Verify your Email</div>
            <hr style="opacity: 30%; margin-top: 3%; margin-bottom: 3%;" />
            <div class="message">
                Nivishka Services received a request to verify <strong>${username}</strong> as a verification process.

                <br><br>
                Use this code to safely verify your email:
            </div>
            <div class="code">${otp}</div>
            <div class="note">
                This code will expire in 24 hours.
                <br><br>
                If you find something suspicious, then you can ignore this email.
            </div>
           <p class="footer">All rights reserved © 2024 | Nivishka Services | No. 92 , 7th Cross, Basavanapura Main Road, 560036,
            Bangalore, Karnataka</p>
        </div>
    </div>
</body>

</html>
  `

  const subject = "Email Verification";
  return await sendMail({ to: username, subject, html: body });
};

exports.passwordChangedSubAdmin = async (data) => {
  const { username, password } = data;

  const body = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        width: 100%;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 20px auto;
      }
      .header {
        background-color: #4CAF50;
        color: #ffffff;
        padding: 10px 20px;
        text-align: center;
        border-radius: 10px 10px 0 0;
      }
      .content {
        padding: 20px;
      }
      .footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #aaaaaa;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Changed</h1>
      </div>
      <div class="content">
        <p>Dear ${username},</p>
        <p>We wanted to inform you that your password has been successfully changed by the admin.</p>
        <p>Your new password is: <strong>${password}</strong></p>
        <p>If you did not request this change or believe this is an error, please contact our support team immediately.</p>
        <p>You can log in to your account using your new password. If you experience any issues, feel free to reach out to us for assistance.</p>
        <p>Thank you,</p>
        <p>The Admin Team</p>
      </div>
      <div class="footer">
        <p>If you have any questions, please contact us at support@example.com</p>
      </div>
    </div>
  </body>
  </html>
`;

  const subject = "Password Changed";
  return await sendMail({ to: username, subject, html: body });
};

exports.sendOtpSuperAdmin = async (data) => {
  const { name, otp, username } = data;

  const body = `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #4CAF50;
                padding: 10px 0;
                text-align: center;
                color: #ffffff;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content p {
                font-size: 18px;
                line-height: 1.6;
                color: #333333;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 10px 0;
                background-color: #f4f4f4;
                color: #777777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Login OTP Verification</h1>
            </div>
            <div class="content">
                <p>Dear ${name},</p>
                <p>We received a request to log in to your super-admin account. Please use the following OTP to complete your login process:</p>
                <div class="otp">${otp}</div>
                <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email or contact support immediately.</p>
                <p>Thank you,</p>
                <p>Your Company Name</p>
            </div>
            <div class="footer">
                <p>If you have any questions, feel free to <a href="mailto:support@yourcompany.com">contact our support team</a>.</p>
            </div>
        </div>
    </body>
    </html>`;

  const subject = "Otp to login.";
  return await sendMail({ to: username, subject, html: body });
};

exports.sendEmailUpdateOtp = async (data) => {
  const { name, otp, email } = data;

  const body = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your recovery email</title>
    <style>
        body {
            margin: 0 auto;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid gainsboro;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .logo {
            margin-bottom: 20px;
        }

        .title {
            font-size: 24px;
            color: black;
            font-weight: 500;
            margin-top: 5%;
            margin-bottom: 5%;
        }

        .message {
            font-size: 16px;
            color: #272727;
            margin-bottom: 20px;
            line-height: 1.5;
            text-align: left;
        }

        .code {
            font-size: 36px;
            color: black;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }

        .note {
            font-size: 14px;
            color: #272727;
            text-align: left;
            margin-top: 20px;
            margin-bottom: 5%;
            line-height: 1.5;
        }

        .footer{
            color: #4a4a4a;
            font-size: 12px;
            max-width: 600px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div style="margin: 0 auto">
        <div class="container">
            <div class="logo">
                <img src="https://nivishka.com/assets/images/logo_landscape.png" style="width: 180px;"
                    alt="Google Logo">
            </div>
            <div class="title">Verify your New Email</div>
            <hr style="opacity: 30%; margin-top: 3%; margin-bottom: 3%;" />
            <div class="message">
                Nivishka Services received a request to <strong>Change email</strong>.
                <br><br>
                Use this code to safely verify your new email:
            </div>
            <div class="code">${otp}</div>
            <div class="note">
                This code will expire in 24 hours.
                <br><br>
                If you find something suspicious, then you can ignore this email.
            </div>
           <p class="footer">All rights reserved © 2024 | Nivishka Services | No. 92 , 7th Cross, Basavanapura Main Road, 560036,
            Bangalore, Karnataka</p>
        </div>
    </div>
</body>

</html>
  `

  const subject = "Email Update Verification";
  return await sendMail({ to: email, subject, html: body });
};

exports.sendContactUpdationOtp = async (data) => {
  const { name, otp, username } = data;

  const body = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Contact Number Update Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .email-container {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        width: 100%;
      }
      .email-header {
        text-align: center;
        border-bottom: 1px solid #dddddd;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .email-header h1 {
        font-size: 24px;
        margin: 0;
        color: #333333;
      }
      .email-body {
        font-size: 16px;
        line-height: 1.5;
        color: #555555;
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        color: #333333;
        margin: 20px 0;
        text-align: center;
      }
      .email-footer {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #dddddd;
        margin-top: 20px;
        color: #999999;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>Contact Number Update Verification</h1>
      </div>
      <div class="email-body">
        <p>Dear ${name},</p>
        <p>You have initiated a contact number update for your account. To proceed with updating your contact number, please use the following One-Time Password (OTP):</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for the next 10 minutes. If you did not request this change, please contact our support team immediately.</p>
        <p>Thank you,</p>
        <p>The [Your Company Name] Team</p>
      </div>
      <div class="email-footer">
        <p>&copy; [Year] [Your Company Name]. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

  const subject = "Contact Number Update Verification";
  return await sendMail({ to: username, subject, html: body });
};

exports.sendResetPasswordSuperAdmin = async (data) => {
  const { email, token } = data;
  const resetLink =
    process.env.BASE_URL + `/admin/reset-password/${token}`;

  const body = `
    <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your recovery email</title>
      <style>
          body {
              margin: 0 auto;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border: 1px solid gainsboro;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
          }
  
          .logo {
              margin-bottom: 20px;
          }
  
          .title {
              font-size: 24px;
              color: black;
              font-weight: 500;
              margin-top: 5%;
              margin-bottom: 5%;
          }
  
          .message {
              font-size: 16px;
              color: #272727;
              margin-bottom: 20px;
              line-height: 1.5;
              text-align: left;
          }
  
          .code {
              font-size: 36px;
              color: black;
              font-weight: 700;
              margin-bottom: 20px;
              letter-spacing: 2px;
          }
  
          .note {
              font-size: 14px;
              color: #272727;
              text-align: left;
              margin-top: 20px;
              margin-bottom: 5%;
              line-height: 1.5;
          }
  
          .footer{
              color: #4a4a4a;
              font-size: 12px;
              max-width: 600px;
              text-align: center;
          }
      </style>
  </head>
  
  <body>
      <div style="margin: 0 auto">
          <div class="container">
              <div class="logo">
                  <img src="https://nivishka.com/assets/images/logo_landscape.png" style="width: 180px;"
                      alt="Nivishka Logo">
              </div>
              <div class="title">Reset Password</div>
              <hr style="opacity: 30%; margin-top: 3%; margin-bottom: 3%;" />
              <div class="message">
                  Nivishka Services received a request to <strong>Change password</strong>.
                  <br><br>
                  Use this link to safely reset your password: ${resetLink}
              </div>
              <div class="note">
                  <br><br>
                  If you find something suspicious, then you can ignore this email.
              </div>
             <p class="footer">All rights reserved © 2024 | Nivishka Services | No. 92 , 7th Cross, Basavanapura Main Road, 560036,
              Bangalore, Karnataka</p>
          </div>
      </div>
  </body>
  
  </html>
    `

  const subject = "Reset Password";
  return await sendMail({ to: email, subject, html: body });
};



exports.sendBookingConfirmationToCustomer = async (data) => {

  const { customerEmail, customerName, pod, serviceAddress, remaining_amount, paid_amount, serviceDate, serviceNames, serviceTime, bookingDate } = data;

  const currentDate = new Date(bookingDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const formattedDate = `${day}-${month}-${year}`;

  const body = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Outfit';
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding-bottom: 20px;
            background-color: #f4fff4;
            overflow: hidden;
            border-radius: 8px;
            border: 1px solid #5DB761;
        }

        .header {
            background-color: #5DB761;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }

        .header h1 {
            margin: 0;
        }

        .content {
            padding: 20px;
        }

        .content h2 {
            color: #1d1d1d;
        }

        .content p {
            color: #3e3e3e;
            line-height: 1.5;
        }

        .image-container {
            text-align: center;
            padding: 20px;
        }

        .image-container img {
            width: 100%;
            max-width: 560px;
            height: auto;
            border-radius: 8px;
        }

        .footer {
            color: #4a4a4a;
            font-size: 12px;
            width: 80%;
            margin: auto;
            text-align: center;
        }

        .logo {
            margin: 20px 0;
            text-align: center;
        }

        a {
            color: #5DB761;
            text-decoration: none;
        }

        a:hover {
            cursor: pointer;
        }

        @media only screen and (max-width: 600px) {
            .content {
                padding: 15px;
            }

            .header,
            .footer {
                padding: 15px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">
            <img src="https://nivishka.com/assets/images/logo_landscape.png" style="width: 180px;" alt="Company Logo">
        </div>
        <hr style="opacity: 50%;" />
        <div class="image-container">
            <img src="https://nivishkaservices.vercel.app/images/booking-confirmation.png" alt="Service Image">
        </div>
        <div class="content">
            <h2 style="margin: 0;">Hello ${customerName},</h2>
            <p>Thank you for booking a service with us! We are pleased to confirm your booking. Here are the details:
            </p>
            <p>
                <font style="font-weight: 600;">Service: </font> ${serviceNames}
            </p>
            <p>
                <font style="font-weight: 600;">Date: </font> ${serviceDate}
            </p>
            <p>
                <font style="font-weight: 600;">Time: </font> ${serviceTime}
            </p>
            <p>
                <font style="font-weight: 600;">Service address: </font> ${serviceAddress}
            </p>
            <p>
                <font style="font-weight: 600;">${pod == "true" ? "Booking amount:" : "Paid Amount"} </font> ${pod == "true" ? "₹100" : "₹" + paid_amount}
            </p>
            <p>
                <font style="font-weight: 600;">${pod == "true" ? "Remaing amount:" : "Remaing amount:"}</font> ${pod == "true" ? "₹" + remaining_amount : "₹0"}
            </p>
             <p>
                <font style="font-weight: 600;">Booking Date: </font>  ${formattedDate}
            </p>
            <p>We look forward to serving you. If you have any questions or need to reschedule, please contact our
                support team.</p>
            <p>Best regards,</p>
            <p style="margin: 0; padding: 0; font-weight: 400;"><a
                    href="mailto:support@nivishka.com">support@nivishka.com</a></p>
            <p style="margin: 0; padding: 0; font-weight: 400;"><a href="www.nivishka.com"
                    target="_blank">www.nivishka.com</a>
            </p>
            <p style="margin: 0; padding: 0; font-weight: 600;">Nivishka Services</p>
        </div>
        <hr style="opacity: 40%;" />
        <p class="footer">
            All rights reserved © 2024 | Nivishka Services | No. 92 , 7th Cross, Basavanapura Main
            Road, 560036,
            Bangalore, Karnataka
        </p>
    </div>
</body>

</html>
  `

  const subject = "Your Booking has been confirmed at Nivishka Services!";
  return await sendMail({ to: customerEmail, subject, html: body });
};

exports.sendBookingConfirmationToAdmin = async (data) => {

  const { pod, remaining_amount, paid_amount, serviceDate, serviceNames, serviceTime, bookingDate, serviceAddress } = data;
  const superAdminEmail = await getSuperAdminEmail();
  const adminEmail = superAdminEmail;

  const currentDate = new Date(bookingDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const formattedDate = `${day}-${month}-${year}`;

  const body = `
 <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Outfit';
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding-bottom: 20px;
            background-color: #f4fff4;
            overflow: hidden;
            border-radius: 8px;
            border: 1px solid #5DB761;
        }

        .header {
            background-color: #5DB761;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }

        .header h1 {
            margin: 0;
        }

        .content {
            padding: 20px;
        }

        .content h2 {
            color: #1d1d1d;
        }

        .content p {
            color: #3e3e3e;
            line-height: 1.5;
        }

        .image-container {
            text-align: center;
            padding: 20px;
        }

        .image-container img {
            width: 100%;
            max-width: 560px;
            height: auto;
            border-radius: 8px;
        }

        .footer {
            color: #4a4a4a;
            font-size: 12px;
            width: 80%;
            margin: auto;
            text-align: center;
        }

        .logo {
            margin: 20px 0;
            text-align: center;
        }

        a {
            color: #5DB761;
            text-decoration: none;
        }

        a:hover {
            cursor: pointer;
        }

        @media only screen and (max-width: 600px) {
            .content {
                padding: 15px;
            }

            .header,
            .footer {
                padding: 15px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">
            <img src="https://nivishka.com/assets/images/logo_landscape.png" style="width: 180px;" alt="Company Logo">
        </div>
        <hr style="opacity: 50%;" />
        <div class="image-container">
            <img src="https://nivishkaservices.vercel.app/images/booking-confirmation.png" alt="Service Image">
        </div>
        <div class="content">
            <h2 style="margin: 0;">Hello Admin</h2>
            <p>We have received a new booking, below are the details:
            </p>
            <p>
                <font style="font-weight: 600;">Service: </font> ${serviceNames}
            </p>
            <p>
                <font style="font-weight: 600;">Date: </font> ${serviceDate}
            </p>
            <p>
                <font style="font-weight: 600;">Time: </font> ${serviceTime}
            </p>
            <p>
                <font style="font-weight: 600;">Service address: </font> ${serviceAddress}
            </p>
            <p>
                <font style="font-weight: 600;">${pod == "true" ? "Booking amount:" : "Paid Amount"} </font> ${pod == "true" ? "₹100" : paid_amount}
            </p>
            <p>
                <font style="font-weight: 600;">${pod == "true" ? "Remaing amount:" : "Remaing amount:"}</font> ${pod == "true" ? remaining_amount : "₹0"}
            </p>
            <p>
                <font style="font-weight: 600;">Booking Date: </font>  ${formattedDate}
            </p>
            <p>Best regards,</p>
            <p style="margin: 0; padding: 0; font-weight: 400;"><a
                    href="mailto:support@nivishka.com">support@nivishka.com</a></p>
            <p style="margin: 0; padding: 0; font-weight: 400;"><a href="www.nivishka.com"
                    target="_blank">www.nivishka.com</a>
            </p>
            <p style="margin: 0; padding: 0; font-weight: 600;">Nivishka Services</p>
        </div>
        <hr style="opacity: 40%;" />
        <p class="footer">
            All rights reserved © 2024 | Nivishka Services | No. 92 , 7th Cross, Basavanapura Main
            Road, 560036,
            Bangalore, Karnataka
        </p>
    </div>
</body>

</html>
 `

  const subject = "New Booking received at Nivishka Services!";
  return await sendMail({ to: adminEmail, subject, html: body });
};


exports.assignVendor = async (data) => {

  const { pod, remaining_amount, paid_amount, service_name, service_date, service_time, booking_date, booking_id } = data;


  // const service_name = await Services.find({
  //   _id: service_id
  // }).select("service_name -_id");

  // const serviceNames = service_name.map(service => service.service_name);

  const adminEmail = 'nivishkaservices@gmail.com'

  const currentDate = new Date(booking_date);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const formattedDate = `${day}-${month}-${year}`;

  const body = `
 <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Please assign a Vendor!</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Outfit';
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding-bottom: 20px;
            background-color: #f4fff4;
            overflow: hidden;
            border-radius: 8px;
            border: 1px solid #5DB761;
        }

        .header {
            background-color: #5DB761;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }

        .header h1 {
            margin: 0;
        }

        .content {
            padding: 20px;
        }

        .content h2 {
            color: #1d1d1d;
        }

        .content p {
            color: #3e3e3e;
            line-height: 1.5;
        }

        .image-container {
            text-align: center;
            padding: 20px;
        }

        .image-container img {
            width: 100%;
            max-width: 560px;
            height: auto;
            border-radius: 8px;
        }

        .footer {
            color: #4a4a4a;
            font-size: 12px;
            width: 80%;
            margin: auto;
            text-align: center;
        }

        .logo {
            margin: 20px 0;
            text-align: center;
        }

        a {
            color: #5DB761;
            text-decoration: none;
        }

        a:hover {
            cursor: pointer;
        }

        @media only screen and (max-width: 600px) {
            .content {
                padding: 15px;
            }

            .header,
            .footer {
                padding: 15px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">
            <img src="https://nivishka.com/assets/images/logo_landscape.png" style="width: 180px;" alt="Company Logo">
        </div>
        <hr style="opacity: 50%;" />
        <div class="content">
            <h2 style="margin: 0;">No vendor is assigned to this Service of this Booking!</h2>
            <p>No vendor is assigned to this Service of this Booking, please assign a vendor.
            </p>

            <p>
                <font style="font-weight: 600;">Booking Id: </font> ${booking_id}
            </p>
            <p>
                <font style="font-weight: 600;">Service: </font> ${service_name}
            </p>
            <p>
                <font style="font-weight: 600;">Date: </font> ${service_date}
            </p>
            <p>
                <font style="font-weight: 600;">Time: </font> ${service_time}
            </p>
            <p>
                <font style="font-weight: 600;">${pod == "true" ? "Booking amount:" : "Paid Amount"} </font> ${pod == "true" ? "₹100" : paid_amount}
            </p>
            <p>
                <font style="font-weight: 600;">${pod == "true" ? "Remaing amount:" : "Remaing amount:"}</font> ${pod == "true" ? remaining_amount : "₹0"}
            </p>
            <p>
                <font style="font-weight: 600;">Booking Date: </font>  ${formattedDate}
            </p>
            <p>Best regards,</p>
            <p style="margin: 0; padding: 0; font-weight: 400;"><a
                    href="mailto:support@nivishka.com">support@nivishka.com</a></p>
            <p style="margin: 0; padding: 0; font-weight: 400;"><a href="www.nivishka.com"
                    target="_blank">www.nivishka.com</a>
            </p>
            <p style="margin: 0; padding: 0; font-weight: 600;">Nivishka Services</p>
        </div>
        <hr style="opacity: 40%;" />
        <p class="footer">
            All rights reserved © 2024 | Nivishka Services | No. 92 , 7th Cross, Basavanapura Main
            Road, 560036,
            Bangalore, Karnataka
        </p>
    </div>
</body>

</html>
 `

  const subject = "No Vendor is assigned to this Service!";
  return await sendMail({ to: adminEmail, subject, html: body });
};