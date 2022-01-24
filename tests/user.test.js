const keys = require("../config/keys");
process.env.MONGO_URL = `mongodb+srv://salitor:${keys.password}@salitur.xfafu.mongodb.net/saliproject-testing?retryWrites=true&w=majority`;
const request = require("supertest");
// const mongoose = require("mongoose");
const app = require("../app");
// const User = require("../src/models/user");

test("Should show all users", async () => {
  const response = await request(app).get("/api/users").send({}).expect(200);
});

test("Add new user", async () => {
  const response = await request(app)
    .post("/api/users")
    .send({
      name: "afddzxz",
      passportId: "12215682",
    })
    .expect(201);
});

test("Fail-Add new user- No ID", async () => {
  const response = await request(app)
    .post("/api/users")
    .send({
      name: "zyhtxz",
    })
    .expect(400);
});

test("Fail-Add new user- Short ID", async () => {
  const response = await request(app)
    .post("/api/users")
    .send({
      name: "ztxz",
      passportId: "682",
    })
    .expect(400);
});

test("Fail-Add new user- Longest ID", async () => {
  const response = await request(app)
    .post("/api/users")
    .send({
      name: "dfghgdfg",
      passportId: "684564565659592",
    })
    .expect(400);
});

test("Fail-Add new user- No name", async () => {
  const response = await request(app)
    .post("/api/users")
    .send({
      passportId: "548456785",
    })
    .expect(400);
});

test("Fail-Add new user- short name", async () => {
  const response = await request(app)
    .post("/api/users")
    .send({
      name: "z",
      passportId: "467575757",
    })
    .expect(400);
});

// const userOneId = new mongoose.Types.ObjectId();
// const userOne = {
//   _id: userOneId,
//   name: "Mike",
//   email: "mike@example.com",
//   password: "56what!!",
//   tokens: [
//     {
//       token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
//     },
//   ],
// };

// beforeEach(async () => {
//   await User.deleteMany();
//   await new User(userOne).save();
// });

// test("Should signup a new user", async () => {
//   const response = await request(app)
//     .post("/users")
//     .send({
//       name: "Andrew",
//       email: "andrew@example.com",
//       password: "MyPass777!",
//     })
//     .expect(201);

//   // Assert that the database was changed correctly
//   const user = await User.findById(response.body.user._id);
//   expect(user).not.toBeNull();

//   // Assertions about the response
//   expect(response.body).toMatchObject({
//     user: {
//       name: "Andrew",
//       email: "andrew@example.com",
//     },
//     token: user.tokens[0].token,
//   });
//   expect(user.password).not.toBe("MyPass777!");
// });

// test("Should login existing user", async () => {
//   const response = await request(app)
//     .post("/users/login")
//     .send({
//       email: userOne.email,
//       password: userOne.password,
//     })
//     .expect(200);
//   const user = await User.findById(userOneId);
//   expect(response.body.token).toBe(user.tokens[1].token);
// });

// test("Should not login nonexistent user", async () => {
//   await request(app)
//     .post("/users/login")
//     .send({
//       email: userOne.email,
//       password: "thisisnotmypass",
//     })
//     .expect(400);
// });

// test("Should get profile for user", async () => {
//   await request(app)
//     .get("/users/me")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .send()
//     .expect(200);
// });

// test("Should not get profile for unauthenticated user", async () => {
//   await request(app).get("/users/me").send().expect(401);
// });

// test("Should delete account for user", async () => {
//   await request(app)
//     .delete("/users/me")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .send()
//     .expect(200);
//   const user = await User.findById(userOneId);
//   expect(user).toBeNull();
// });

// test("Should not delete account for unauthenticate user", async () => {
//   await request(app).delete("/users/me").send().expect(401);
// });
