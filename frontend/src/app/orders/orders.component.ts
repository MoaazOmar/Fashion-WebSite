import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = []; // Store the fetched orders

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOrderToDisplay().subscribe({
      next: (response: any) => {
        console.log('Order response:', response);
        if (response && response.orders) {
          this.orders = response.orders;
          console.log('Orders set:', this.orders);
        } else {
          console.warn('No orders found.');
        }
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
      }

  // Add this property to your component class
selectedOrder: any = null;

downloadPDF(order: any) {
  const doc = new jsPDF();

  // Set title
  doc.setFontSize(18);
  doc.setTextColor(255, 0, 0); // Red color
  doc.text(`Order #${order._id}`, 10, 10);

  // Reset to default color for other texts
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black color

  // Add order details
  let yPosition = 20;
  doc.text(`Date: ${new Date(order.timestamp).toLocaleDateString()}`, 10, yPosition);
  yPosition += 10;
  doc.text(`Customer: ${order.customerName}`, 10, yPosition);
  yPosition += 10;
  doc.text(`Address: ${order.address}`, 10, yPosition);
  yPosition += 10;
  doc.text(`Total: $${order.totalPrice}`, 10, yPosition);
  
  yPosition += 5; // Add some space before items list

  // Items section header
  doc.setFontSize(14);
  doc.text('Items:', 10, yPosition);
  yPosition += 10;

  // Create a table
  const startY = yPosition;
  const itemWidth = 180;
  const itemHeight = 10;

  // Header
  doc.setFillColor(200, 200, 200);
  doc.rect(10, yPosition, itemWidth, itemHeight, 'F');
  doc.setTextColor(0);
  doc.text('Item', 12, yPosition + 7);
  doc.text('Quantity', 100, yPosition + 7);
  doc.text('Price', 150, yPosition + 7);
  yPosition += itemHeight;

  // Add each item
  order.items.forEach((item: any) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(10, yPosition, itemWidth, itemHeight, 'F'); // Fill the row with white
    doc.setTextColor(0);
    doc.text(item.name, 12, yPosition + 7);
    doc.text(item.amount.toString(), 100, yPosition + 7);
    doc.text(`$${item.price}`, 150, yPosition + 7);
    yPosition += itemHeight;
  });

  // Footer
  yPosition += 10; // Add space before the footer
  doc.setFontSize(12);
  doc.text('Thank you for your order!', 10, yPosition);

  // Save the PDF
  doc.save(`order-${order._id}.pdf`);
}

}










  // downloadPDF(order: any) {
  //   const doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text(`Order ID: ${order.orderID}`, 10, 10);
  //   doc.text(`Product: ${order.name}`, 10, 20);
  //   doc.text(`Amount: ${order.amount}`, 10, 30);
  //   doc.text(`Total Price: $${order.totalPrice}`, 10, 40);
  //   doc.text(`Status: ${order.status}`, 10, 50);
  //   doc.text(`Customer Name: ${order.customerName}`, 10, 60);
  //   doc.text(`Address: ${order.address}`, 10, 70);
  //   doc.text(`Timestamp: ${new Date(order.timestamp).toLocaleString()}`, 10, 80);

  //   doc.save(`Order_${order.orderID}.pdf`);
  // }



  // 2nd style for pdf 
// Update your downloadPDF method to match your data structure
// downloadPDF(order: any) {
//   const doc = new jsPDF();

//   // Order ID Title
//   doc.setFontSize(18);
//   doc.setTextColor(255, 0, 0); // Red color
//   doc.text(`Order #${order._id}`, 10, 10);
  
//   // Reset to default color and smaller font size
//   doc.setFontSize(12);
//   doc.setTextColor(0, 0, 0); // Black color
  
//   // Initial vertical position
//   let yPosition = 20;
//   const addText = (text: string) => {
//     doc.text(text, 10, yPosition);
//     yPosition += 10;
//   };

//   // Add order details
//   addText(`Date: ${new Date(order.timestamp).toLocaleDateString()}`);
//   addText(`Customer: ${order.customerName}`);
//   addText(`Address: ${order.address}`);
//   addText(`Total: $${order.totalPrice}`);
  
//   yPosition += 5; // Add some space before items list

//   // Items section header
//   doc.setFontSize(14);
//   doc.text('Items:', 10, yPosition);
//   yPosition += 10;
  
//   // Add each item
//   order.items.forEach((item: any) => {
//     doc.setFontSize(12);
//     addText(`${item.name} x${item.amount} - $${item.price} each`);
//   });

//   // Save the PDF
//   doc.save(`order-${order._id}.pdf`);
// }
