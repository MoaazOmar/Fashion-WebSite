export interface Order {
    _id?: string; // MongoDB document id, optional
    userID: string;
    orderID: string;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    timestamp: string;
    totalPrice: number; // use this if backend returns totalPrice
    customerName: string; // or change to customerName if that is more accurate
    address: string;
    items: {
      productID: string;
      name: string;
      price: number;
      amount: number;
      image: string;
      status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    }[];
  }
  