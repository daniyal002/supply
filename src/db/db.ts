import { IGetMe } from "@/interface/user";
import Dexie, { type Table } from "dexie";

// Define the database schema and structure
class OrderItemDatabase extends Dexie {
  getMe!: Table<IGetMe, string>;

  constructor() {
    super("OrderItemDatabase");

    // Define schema versions and table structure
    this.version(1).stores({

      getMe: "user_id, login, password, role, employee",
    });
  }
}

// Create an instance of the database
const db = new OrderItemDatabase();



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
