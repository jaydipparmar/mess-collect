/**
 * Generates a branded HTML receipt for mess fee payment
 */
const generateReceiptHtml = ({ studentName, collegeName, email, month, year, amount, transactionId, paidAt }) => {
    const formattedDate = new Date(paidAt).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    return `
    <div style="font-family: Arial, sans-serif; background:#f3f3f3; padding:30px; min-height:100vh;">
      <div style="max-width:560px; margin:auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background:#001F3D; padding:30px; text-align:center;">
          <h1 style="color:#ED985F; margin:0; font-size:28px;">🍽️ Mess Collect</h1>
          <p style="color:#ccc; margin:6px 0 0; font-size:13px;">Hostel Mess Fee Management System</p>
        </div>

        <!-- Title -->
        <div style="background:#ED985F; padding:14px; text-align:center;">
          <h2 style="margin:0; color:#001F3D; font-size:18px; letter-spacing:1px;">PAYMENT RECEIPT</h2>
        </div>

        <!-- Receipt Details -->
        <div style="padding:30px;">
          <table style="width:100%; border-collapse:collapse; font-size:15px;">
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:12px 8px; color:#555; font-weight:600;">Student Name</td>
              <td style="padding:12px 8px; color:#001F3D; font-weight:bold;">${studentName}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee; background:#fafafa;">
              <td style="padding:12px 8px; color:#555; font-weight:600;">College</td>
              <td style="padding:12px 8px; color:#001F3D;">${collegeName}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:12px 8px; color:#555; font-weight:600;">Email</td>
              <td style="padding:12px 8px; color:#001F3D;">${email}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee; background:#fafafa;">
              <td style="padding:12px 8px; color:#555; font-weight:600;">Fee Month</td>
              <td style="padding:12px 8px; color:#001F3D;">${month} ${year}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:12px 8px; color:#555; font-weight:600;">Amount Paid</td>
              <td style="padding:12px 8px; font-size:18px; font-weight:bold; color:#ED985F;">₹${amount.toFixed(2)}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee; background:#fafafa;">
              <td style="padding:12px 8px; color:#555; font-weight:600;">Transaction ID</td>
              <td style="padding:12px 8px; color:#001F3D; font-family:monospace; font-size:13px;">${transactionId}</td>
            </tr>
            <tr>
              <td style="padding:12px 8px; color:#555; font-weight:600;">Payment Date</td>
              <td style="padding:12px 8px; color:#001F3D;">${formattedDate}</td>
            </tr>
          </table>

          <!-- Status Badge -->
          <div style="text-align:center; margin:24px 0;">
            <span style="background:#d4edda; color:#155724; padding:10px 28px; border-radius:50px; font-weight:bold; font-size:15px; border:1px solid #c3e6cb;">
              ✅ PAYMENT SUCCESSFUL
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#001F3D; padding:20px; text-align:center;">
          <p style="color:#ED985F; margin:0; font-size:14px; font-weight:bold;">Thank you for your payment!</p>
          <p style="color:#888; margin:6px 0 0; font-size:12px;">© 2025 Mess Collect. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
};

module.exports = { generateReceiptHtml };
