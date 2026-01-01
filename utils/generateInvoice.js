const PDFDocument = require("pdfkit");

module.exports = function generateInvoicePDF(res, order) {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice_${order.id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("JerseyZone Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Customer: ${order.customer_name}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}, ${order.city} - ${order.pincode}`);
    doc.text(`Payment Status: ${order.payment_status}`);
    doc.moveDown();

    const items = typeof order.items === "string"
        ? JSON.parse(order.items)
        : order.items;

    doc.text("Items:");
    items.forEach(item => {
        doc.text(`• ${item.name} x ${item.qty} — ₹${item.price * item.qty}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Amount: ₹${order.total_amount}`);

    doc.end();
};
