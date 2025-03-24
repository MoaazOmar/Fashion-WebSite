
export interface CartItem {
  _id?: string;       // Match MongoDB's default ID field name
  productID: string;
  name: string;
  price: number;
  amount: number;
  userID?: string;
  image: string;
  timestamp?: number;

}