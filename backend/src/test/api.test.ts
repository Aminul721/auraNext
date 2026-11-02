import bcrypt from "bcryptjs";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { app } from "../app.js";
import { Admin } from "../models/Admin.js";
import { Enquiry } from "../models/Enquiry.js";

const validEnquiry = {
  name: "Test Visitor",
  email: "VISITOR@example.com",
  phone: "+60 10-000 0000",
  company: "Example Company",
  service: "Corporate Events" as const,
  eventDate: "2027-01-15",
  eventLocation: "Shah Alam",
  message: "We would like to discuss a robotics event.",
};

let adminId: string;

beforeAll(async () => {
  const passwordHash = await bcrypt.hash("test-admin-password-secure", 4);
  const admin = await Admin.create({
    email: "admin@example.com",
    passwordHash,
    role: "admin",
  });
  adminId = admin.id;
});

describe("public API", () => {
  it("reports application and MongoDB health", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      status: "ok",
      database: "connected",
    });
    expect(response.body).not.toHaveProperty("credentials");
  });

  it("persists valid enquiries and returns a safe confirmation", async () => {
    const response = await request(app).post("/api/enquiries").send(validEnquiry);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      message: "Your enquiry has been received.",
      enquiry: { status: "new" },
    });
    expect(response.body.enquiry).not.toHaveProperty("email");
    const saved = await Enquiry.findById(response.body.enquiry.id);
    expect(saved?.email).toBe("visitor@example.com");
  });

  it("rejects malformed email addresses", async () => {
    const response = await request(app)
      .post("/api/enquiries")
      .send({ ...validEnquiry, email: "not-an-email" });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("rejects missing required fields and unknown properties", async () => {
    const missing = await request(app)
      .post("/api/enquiries")
      .send({ email: "person@example.com" });
    expect(missing.status).toBe(400);

    const unknown = await request(app)
      .post("/api/enquiries")
      .send({ ...validEnquiry, internalFlag: true });
    expect(unknown.status).toBe(400);
  });

  it("rejects oversized messages", async () => {
    const response = await request(app)
      .post("/api/enquiries")
      .send({ ...validEnquiry, message: "x".repeat(5001) });
    expect(response.status).toBe(400);
  });
});

describe("admin API", () => {
  it("authenticates an admin and returns a short-lived access token", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "ADMIN@example.com", password: "test-admin-password-secure" });
    expect(response.status).toBe(200);
    expect(response.body.tokenType).toBe("Bearer");
    expect(response.body.admin).toEqual({
      id: adminId,
      email: "admin@example.com",
      role: "admin",
    });
    expect(response.body.admin).not.toHaveProperty("passwordHash");
    expect(response.body.accessToken).toBeTypeOf("string");
  });

  it("uses a generic response for invalid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "wrong-password" });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password.");
  });

  it("denies unauthenticated admin access", async () => {
    const response = await request(app).get("/api/admin/enquiries");
    expect(response.status).toBe(401);
  });

  it("paginates enquiries and supports status updates", async () => {
    await Promise.all([
      Enquiry.create({ ...validEnquiry, email: "one@example.com", status: "new" }),
      Enquiry.create({
        ...validEnquiry,
        email: "two@example.com",
        status: "contacted",
      }),
      Enquiry.create({
        ...validEnquiry,
        email: "three@example.com",
        status: "new",
      }),
    ]);
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "test-admin-password-secure" });
    const token = login.body.accessToken as string;
    const list = await request(app)
      .get("/api/admin/enquiries?page=1&limit=2&status=new")
      .set("Authorization", `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(list.body.pagination).toMatchObject({
      total: 3,
      page: 1,
      limit: 2,
      totalPages: 2,
    });
    expect(list.body.enquiries).toHaveLength(2);
    expect(list.body.enquiries[0]).not.toHaveProperty("passwordHash");

    const id = list.body.enquiries[0].id as string;
    const updated = await request(app)
      .patch(`/api/admin/enquiries/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed" });
    expect(updated.status).toBe(200);
    expect(updated.body.enquiry.status).toBe("completed");

    const invalidUpdate = await request(app)
      .patch(`/api/admin/enquiries/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed", isAdmin: true });
    expect(invalidUpdate.status).toBe(400);
  });

  it("rejects malformed MongoDB IDs", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "test-admin-password-secure" });
    const response = await request(app)
      .get("/api/admin/enquiries/not-an-object-id")
      .set("Authorization", `Bearer ${login.body.accessToken as string}`);
    expect(response.status).toBe(400);
  });

  it("returns dashboard counts and performs soft deletion", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "test-admin-password-secure" });
    const token = login.body.accessToken as string;
    const dashboard = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(dashboard.status).toBe(200);
    expect(dashboard.body.counts.total).toBeGreaterThan(0);

    const enquiry = await Enquiry.findOne({ email: "one@example.com" });
    expect(enquiry).not.toBeNull();
    const deleted = await request(app)
      .delete(`/api/admin/enquiries/${enquiry?.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleted.status).toBe(200);
    expect((await Enquiry.findById(enquiry?.id))?.deletedAt).toBeInstanceOf(Date);
  });
});

describe("rate limiting and safe failures", () => {
  it("limits public enquiry submissions", async () => {
    const responses = [];
    for (let index = 0; index < 6; index += 1) {
      responses.push(await request(app).post("/api/enquiries").send(validEnquiry));
    }
    expect(responses.some((response) => response.status === 429)).toBe(true);
  });

  it("does not return internal route errors to clients", async () => {
    const response = await request(app).get("/api/unknown");
    expect(response.status).toBe(404);
    expect(response.body).not.toHaveProperty("stack");
    expect(response.body).not.toHaveProperty("path");
  });
});
