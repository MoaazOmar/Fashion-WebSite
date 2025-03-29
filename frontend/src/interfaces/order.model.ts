export interface Order {
  _id?: string;
  userID: string;
  orderID: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  timestamp: string;
  totalPrice: number;
  customerName: string;
  address: string;
  items: {
    productID: string;
    name: string;
    price: number;
    amount: number;
    image: string;
    color:string;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  }[];
}
