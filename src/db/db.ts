import { IOrderItem } from "@/interface/orderItem";
import { IGetMe } from "@/interface/user";
import Dexie, { type Table } from "dexie";

// Define the database schema and structure
class OrderItemDatabase extends Dexie {
  orderItem!: Table<IOrderItem, number>;
  getMe!: Table<IGetMe, string>;

  constructor() {
    super("OrderItemDatabase");

    // Define schema versions and table structure
    this.version(1).stores({
      orderItem:
        "++order_id, order_number, order_status, note, buyer, oms, department, order_products, user_id",
      getMe: "user_id, login, password, role, employee",
    });
  }
}

// Create an instance of the database
const db = new OrderItemDatabase();

export async function addOrderIndexedDB(data: IOrderItem, userId: number) {
  try {
    // Add the new order item
    const id = await db.orderItem.add(data);

    // Delete all other order items for this user_id, except the one we just added
    await db.orderItem
      .where("user_id")
      .equals(userId)
      .and((item) => item.order_id !== id)
      .delete();
  } catch (error) {
    console.error("Ошибка при добавлении orderItem:", error);
  }
}

export async function deleteOrderIndexedDB(userId: number) {
  try {
    await db.orderItem
    .where("user_id")
    .equals(userId)
    .delete();
  } catch (error) {
    console.error("Ошибка при удалении orderItem для пользователя:", error);
  }
}


export async function saveGetMe(data: IGetMe) {
  try {
    const id = await db.getMe.add(data);
    await db.getMe.where("user_id").notEqual(id).delete();
  } catch (error) {
    console.error("Ошибка при добавлении GetMe:", error);
  }
}

export async function deleteGetMe() {
  try {
    await db.getMe.clear()
  } catch (error) {
    console.error("Ошибка при удалении GetMe", error);
  }
}

export { db };
