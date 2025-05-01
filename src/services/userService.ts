// src/services/userService.ts
import sql from "@/lib/db";

export async function createUser(userId: string, name: string, isAuthorized: boolean = false) {
  try {
    const result = await sql`
      INSERT INTO "Users" ("UserID", "Name", "IsAuthorized")
      VALUES (${userId}, ${name}, ${isAuthorized})
      ON CONFLICT ("UserID") DO NOTHING
      RETURNING "UserID"
    `;
    console.log(`User ${userId} created or already exists in database`);
    return result;
  } catch (error: any) {
    console.error("Error in createUser:", {
      userId,
      name,
      isAuthorized,
      error: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

export async function getUserAuthorizationStatus(userId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT "IsAuthorized" FROM "Users" WHERE "UserID" = ${userId}
    `;
    return result.length > 0 ? result[0].IsAuthorized : false;
  } catch (error: any) {
    console.error("Error in getUserAuthorizationStatus:", {
      userId,
      error: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to get user authorization status: ${error.message}`);
  }
}