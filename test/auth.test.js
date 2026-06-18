// const request = require("supertest");
// const app = require("../main");
// const User = require("../src/model/user");

// desceribe("Auth API", () => {
//   test("should register a new user", async () => {
//     const res = await request(app).post("/api/auth/register").send({
//       name: "Ali",
//       email: "ali@test.com",
//       password: "123456",
//     });
//     expect(res.statusCode).toBe(200);
//     expect(res.body.msg).toBe("register success");
//   });
//   test("should return 400 for invaild email", async () => {
//     await User.create({
//       name: "Ali",
//       email: "ali@test.com",
//       password: "123456",
//     });
//     const res = await request(app).post("/api/auth/login").send({
//       name: "Ali",
//       email: "ali@test.com",
//       password: "123456",
//     });
//     expect(res.statusCode).toBe(400);
//     expect(res.statusCode).toContain("email");
//   });
//   test("should login a succse", async () => {
//     const res = await request(app).post("/api/auth/register").send({
//       name: "Ali",
//       email: "abc",
//       password: "123456",
//     });
//     expect(res.statusCode).toBe(200);
//     expect(res.body.data.accessToken).toBeDefined();
//     expect(res.body.data.refreshToken).toBeDefined();
//     expect(res.body.data.user.email).toBe("test@gmail.com");
//   });
//   test("should return 403 if email is not verified", async () => {
//     const user = await User.findOne({
//       email: "notverify@gmail.com",
//     });
//     user.verifed = false;
//     await user.save();
//     const res = await request(app)
//       .post("/api/auth/login")
//       .send({ email: "notverify@gmail.com", password: "123456" });
//     expect(res.statusCode).toBe(403);
//     expect(res.body.msg).toBe("Please verify your email first");
//   });

//   test("should create is succes task", async () => {
//     const login = await request(app)
//       .post("/api/auth/login")
//       .send({ email: "test@gmail.com", password: "123456" });
//     const token = login.body.data.accessToken;
//     const res = await (await request(app).post("/api/auth/register"))
//       .set("x-auth-token", token)
//       .send({
//         title: "Learn Jest",
//         description: "Write professional tests",
//       });
//     expect(res.statusCode).toBe(200);
//     expect(res.body.data.title).toBe("Learn Jest");
//     expect(res.body.data.description).toBe("Write professional tests");
//   });
//   test("should return 400 for short password", async () => {
//     const res = await request(app).post("/api/auth/register").send({
//       name: "ali",
//       email: "ali@test.com",
//       password: "123456",
//     });
//     expect(res.status).toBe(400);
//   });
// });

const request = require("supertest");
const app = require("../app");
const User = require("../src/model/user");

describe("Auth API", () => {
  test("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Ali",
      email: "ali@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("register success");
  });

  test("should return 400 for duplicate email", async () => {
    await User.create({
      name: "Ali",
      email: "duplicate@test.com",
      password: "123456",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Ali",
      email: "duplicate@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toContain("email");
  });

  test("should login successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.email).toBe("test@gmail.com");
  });

  test("should return 403 if email is not verified", async () => {
    const user = await User.findOne({
      email: "notverify@gmail.com",
    });

    user.verifed = false;
    await user.save();

    const res = await request(app).post("/api/auth/login").send({
      email: "notverify@gmail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe("Please verify your email first");
  });

  test("should create task successfully", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "123456",
    });

    const token = login.body.data.accessToken;

    const res = await request(app)
      .post("/api/task/create")
      .set("x-auth-token", token)
      .send({
        title: "Learn Jest",
        description: "Write professional tests",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Learn Jest");
    expect(res.body.data.description).toBe("Write professional tests");
  });

  test("should return 400 for short password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Ali",
      email: "short@test.com",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
  });
});
