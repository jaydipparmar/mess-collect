import { jsPDF } from 'jspdf';

export const generateReceiptPdf = ({ studentName, collegeName, email, month, year, amount, transactionId, paidAt }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Background and Header
    doc.setFillColor(0, 31, 61); // Navy blue
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(237, 152, 95); // Accent orange
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Mess Collect', pageWidth / 2, 20, { align: 'center' });

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Hostel Mess Fee Management', pageWidth / 2, 28, { align: 'center' });

    // Receipt Title
    doc.setTextColor(0, 31, 61);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FEE PAYMENT RECEIPT', pageWidth / 2, 55, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.setDrawColor(237, 152, 95);
    doc.line(pageWidth / 2 - 40, 58, pageWidth / 2 + 40, 58);

    // Details Wrapper (Draw a box around details)
    const boxTop = 70;
    const boxLeft = 20;
    const boxWidth = pageWidth - 40;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.rect(boxLeft, boxTop, boxWidth, 110);

    // Details Contents
    doc.setFontSize(11);
    const leftColX = boxLeft + 10;
    const rightColX = boxLeft + 50;

    const yPositions = [85, 100, 115, 130, 145, 160, 175];

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('Student Name:', leftColX, yPositions[0]);
    doc.text('College:', leftColX, yPositions[1]);
    doc.text('Email:', leftColX, yPositions[2]);
    doc.text('Fee Month:', leftColX, yPositions[3]);
    doc.text('Amount Paid:', leftColX, yPositions[4]);
    doc.text('Transaction ID:', leftColX, yPositions[5]);
    doc.text('Payment Date:', leftColX, yPositions[6]);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 31, 61);
    doc.text(studentName || '—', rightColX, yPositions[0]);
    doc.text(collegeName || '—', rightColX, yPositions[1]);
    doc.text(email || '—', rightColX, yPositions[2]);
    doc.text(`${month} ${year}`, rightColX, yPositions[3]);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(237, 152, 95);
    doc.text(`Rs. ${amount.toLocaleString('en-IN')}`, rightColX, yPositions[4]);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 31, 61);
    doc.text(transactionId || '—', rightColX, yPositions[5]);

    const dateStr = new Date(paidAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    doc.text(dateStr, rightColX, yPositions[6]);

    // Confirmation Badge
    doc.setFillColor(212, 237, 218); // Light green
    doc.rect(pageWidth / 2 - 35, 200, 70, 15, 'F');
    doc.setTextColor(21, 87, 36);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID SUCCESSFULLY', pageWidth / 2, 210, { align: 'center' });

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('This is an automatically generated receipt.', pageWidth / 2, 275, { align: 'center' });

    // Download Action
    doc.save(`Mess_Receipt_${month}_${year}.pdf`);
};
