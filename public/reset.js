const resetPasswordTemplate = (resetUrl, userName = 'User') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f5f7fa; padding:20px;">
  
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        
        <table width="600" style="background:#ffffff; padding:30px; border-radius:8px;">
          
          <tr>
            <td align="center">
              <h2 style="color:#333;">Reset Your Password</h2>
            </td>
          </tr>

          <tr>
            <td style="color:#555; font-size:16px; line-height:1.6;">
              Hello <strong>${userName}</strong>,
              <br><br>
              We received a request to reset your password.
              Click the button below to set a new password.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:30px;">
              <a href="${resetUrl}" 
                 style="
                 background:#4CAF50;
                 color:#ffffff;
                 padding:14px 28px;
                 text-decoration:none;
                 border-radius:5px;
                 font-size:16px;
                 display:inline-block;">
                 Reset Password
              </a>
            </td>
          </tr>

          <tr>
            <td style="color:#777; font-size:14px;">
              This password reset link will expire in <strong>10 minutes</strong>.
              <br><br>
              If you did not request a password reset, you can safely ignore this email.
            </td>
          </tr>

          <tr>
            <td style="padding-top:30px; font-size:13px; color:#999;">
              If the button above doesn't work, copy and paste the following link into your browser:
              <br><br>
              <a href="${resetUrl}">${resetUrl}</a>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:30px; color:#aaa; font-size:12px;">
              © ${new Date().getFullYear()} YourApp. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

exports.resetPasswordTemplate = resetPasswordTemplate;
