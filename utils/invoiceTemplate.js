function invoiceTemplate(order) {

    const itemsHtml = order.items.map(i => `
        <tr>
            <td>${i.name}</td>
            <td>${i.qty}</td>
            <td>₹${i.price}</td>
            <td>₹${i.qty * i.price}</td>
        </tr>
    `).join("");

    return `
        <h2>🧾 JerseyZone Invoice</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address:</strong> ${order.address}, ${order.city} - ${order.pincode}</p>

        <table border="1" cellpadding="10" cellspacing="0">
            <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
            ${itemsHtml}
        </table>

        <h3>Total Paid: ₹${order.total}</h3>

        <p>Thank you for shopping with <b>JerseyZone</b> 🏏⚽</p>
    `;
}

module.exports = invoiceTemplate;
