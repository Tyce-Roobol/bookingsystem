import { NextResponse } from "next/server";
import { getUserAuthorizationStatus, createUser } from "@/services/userService";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
  console.log("GET /api/user-auth called");
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("GET /api/user-auth: Missing or invalid Authorization header", { authHeader });
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const idToken = authHeader.split("Bearer ")[1];
  if (!idToken) {
    console.error("GET /api/user-auth: Empty ID token");
    return NextResponse.json({ error: "Unauthorized: Empty ID token" }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;
    console.log("GET /api/user-auth: Decoded token UID:", userId);

    const isAuthorized = await getUserAuthorizationStatus(userId);
    console.log("GET /api/user-auth: User authorization status:", isAuthorized);
    return NextResponse.json({ isAuthorized });
  } catch (error: any) {
    console.error("Error in GET /api/user-auth:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
      idToken: idToken.substring(0, 10) + "...",
    });
    return NextResponse.json(
      { error: "Invalid token", details: error.message || "Token verification failed" },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  console.log("POST /api/user-auth called");
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("POST /api/user-auth: Missing or invalid Authorization header", { authHeader });
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const idToken = authHeader.split("Bearer ")[1];
  if (!idToken) {
    console.error("POST /api/user-auth: Empty ID token");
    return NextResponse.json({ error: "Unauthorized: Empty ID token" }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("POST /api/user-auth: Decoded token UID:", decodedToken.uid);

    const body = await request.json();
    console.log("POST /api/user-auth: Request body:", body);
    const { userId, name, isAuthorized } = body;

    if (decodedToken.uid !== userId) {
      console.error(`POST /api/user-auth: Invalid UserID. Expected ${decodedToken.uid}, got ${userId}`);
      return NextResponse.json({ error: "Invalid UserID" }, { status: 403 });
    }

    if (!userId || !name) {
      console.error("POST /api/user-auth: Missing UserID or Name", { userId, name });
      return NextResponse.json({ error: "Missing UserID or Name" }, { status: 400 });
    }

    await createUser(userId, name, isAuthorized);
    console.log(`User ${userId} successfully created in database`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in POST /api/user-auth:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
      idToken: idToken.substring(0, 10) + "...",
    });
    return NextResponse.json(
      { error: "Failed to create user", details: error.message || "User creation failed" },
      { status: 500 }
    );
  }
}