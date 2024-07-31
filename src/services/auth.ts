// services/auth.ts
import { db, user, sea } from "@/services/gun";

// Create new account use Gun
const register = async (username: string, password: string) => {
  try {
    const user = db.user();
    await new Promise<void>((resolve, reject) => {
      user.create(username, password, (ack: any) => {
        if (ack.err) {
          reject(ack.err);
        } else {
          resolve();
        }
      });
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    return { success: false, message: (error as string) || "Failed to create user" };
  }
};

// Login use Gun
const login = async (username: string, password: string) => {
  try {
    await new Promise<void>((resolve, reject) => {
      user.auth(username, password, (ack: any) => {
        if (ack.err) {
          reject(ack.err);
        } else {
          resolve();
        }
      });
    });
    return { success: true, message: "User logged in successfully" };
  } catch (error) {
    return { success: false, message: (error as string) || "Failed to login" };
  }
};

export { register, login };
