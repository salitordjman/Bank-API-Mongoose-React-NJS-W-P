const keys = require("../config/keys");
process.env.MONGO_URL = `mongodb+srv://salitor:${keys.password}@salitur.xfafu.mongodb.net/saliproject-testing?retryWrites=true&w=majority`;
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const userDetails = require("../models/userDetails");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Jon",
  passportId: 123859729,
};
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Bon",
  passportId: 123859720,
  credit: 1000,
};

beforeEach(async () => {
  // beforeAll(async () => {
  await userDetails.deleteMany();
  await new userDetails(userOne).save();
  await new userDetails(userTwo).save();
});

test("Should show all users", async () => {
  await request(app).get("/api/users").send({}).expect(200);
});
test("Should show userOne", async () => {
  await request(app).get(`/api/users/${userOneId}`).send().expect(201);
});

test("Fail show userOne", async () => {
  await request(app).get(`/api/users/${userOneId}45`).send().expect(500);
});

test("Add new user", async () => {
  await request(app)
    .post("/api/users")
    .send({
      name: "afddzxz",
      passportId: "12215682",
    })
    .expect(201);
});

test("Fail-Add new user- No ID", async () => {
  await request(app)
    .post("/api/users")
    .send({
      name: "zyhtxz",
    })
    .expect(400);
});

test("Fail-Add new user- Short ID", async () => {
  await request(app)
    .post("/api/users")
    .send({
      name: "ztxz",
      passportId: "682",
    })
    .expect(400);
});

test("Fail-Add new user- Longest ID", async () => {
  await request(app)
    .post("/api/users")
    .send({
      name: "dfghgdfg",
      passportId: "684564565659592",
    })
    .expect(400);
});

test("Fail-Add new user- No name", async () => {
  await request(app)
    .post("/api/users")
    .send({
      passportId: "548456785",
    })
    .expect(400);
});

test("Fail-Add new user- short name", async () => {
  await request(app)
    .post("/api/users")
    .send({
      name: "z",
      passportId: "467575757",
    })
    .expect(400);
});

test("Should Update deposit userOne", async () => {
  const response = await request(app)
    .patch(`/api/users/deposit/${userOneId}`)
    .send({
      deposit: 1000,
    })
    .expect(200);
  const userOneDetails = await userDetails.findById(userOneId);
  console.log(userOneDetails);
  expect(response.body.cash).toBe(userOneDetails.cash);
  expect(userOneDetails.credit).toBe(0);
  const userTwoDetails = await userDetails.findById(userTwoId);
  expect(userTwoDetails.cash).toBe(0);
});

test("Fail- Minus-Update deposit userOne", async () => {
  await request(app)
    .patch(`/api/users/deposit/${userOneId}`)
    .send({
      deposit: -100,
    })
    .expect(401);
});

test("Fail-Not-found Update deposit userTwo", async () => {
  await request(app)
    .patch(`/api/users/deposit/${userTwoId}4`)
    .send({
      deposit: 1000,
    })
    .expect(400);
});

test("Should Update credit userOne", async () => {
  const response = await request(app)
    .patch(`/api/users/credit/${userOneId}`)
    .send({
      credit: 500,
    })
    .expect(200);
  const userOneDetails = await userDetails.findById(userOneId);
  expect(response.body.credit).toBe(userOneDetails.credit);
});

test("Should withdraw userTwo", async () => {
  const response = await request(app)
    .patch(`/api/users/withdraw/${userTwoId}`)
    .send({
      withdraw: 200,
    })
    .expect(200);
  const userTwoDetails = await userDetails.findById(userTwoId);
  expect(response.body.credit).toBe(userTwoDetails.credit);
  expect(response.body.credit).toBe(800);
  expect(response.body.cash).toBe(0);
});

test("Fail- Minus-Should withdraw userTwo", async () => {
  await request(app)
    .patch(`/api/users/withdraw/${userTwoId}`)
    .send({
      withdraw: -200,
    })
    .expect(401);
});

test("Partial sucsses- Not Enough Money- withdraw userTwo", async () => {
  await request(app)
    .patch(`/api/users/withdraw/${userTwoId}`)
    .send({
      withdraw: 2000,
    })
    .expect(205);
});
test("Fail- Not have Money- withdraw userOne", async () => {
  await request(app)
    .patch(`/api/users/withdraw/${userOneId}`)
    .send({
      withdraw: 100,
    })
    .expect(401);
});

test("Should transferring from userTwo to userOne", async () => {
  await request(app)
    .patch(`/api/users/transferring/${userTwoId}`)
    .send({
      transferring: 300,
      toID: userOneId,
    })
    .expect(200);
  const userTwoDetails = await userDetails.findById(userTwoId);
  const userOneDetails = await userDetails.findById(userOneId);
  expect(userTwoDetails.credit).toBe(700);
  expect(userOneDetails.cash).toBe(300);
  expect(userOneDetails.credit).toBe(0);
});

test("Fail- Minus-Should transferring from userTwo to userOne", async () => {
  await request(app)
    .patch(`/api/users/transferring/${userTwoId}`)
    .send({
      transferring: -300,
      toID: userOneId,
    })
    .expect(401);
});

test("Partial sucsses- Not Enough Money-Should transferring from userTwo to userOne", async () => {
  await request(app)
    .patch(`/api/users/transferring/${userTwoId}`)
    .send({
      transferring: 3000,
      toID: userOneId,
    })
    .expect(205);
  const userTwoDetails = await userDetails.findById(userTwoId);
  const userOneDetails = await userDetails.findById(userOneId);
  expect(userTwoDetails.credit).toBe(0);
  expect(userTwoDetails.cash).toBe(0);
  expect(userOneDetails.cash).toBe(1000);
  expect(userOneDetails.credit).toBe(0);
});

test("Fail- Not have Money-Should transferring from userOne to userTwo", async () => {
  await request(app)
    .patch(`/api/users/transferring/${userOneId}`)
    .send({
      transferring: 7,
      toID: userTwoId,
    })
    .expect(401);
});

test("Fail- not found user One-Should transferring from userOne to userTwo", async () => {
  await request(app)
    .patch(`/api/users/transferring/${new mongoose.Types.ObjectId()}`)
    .send({
      transferring: 7,
      toID: userTwoId,
    })
    .expect(404);
});

test("Fail- not found user To-Should transferring from userOne to userTwo", async () => {
  await request(app)
    .patch(`/api/users/transferring/${userOneId}`)
    .send({
      transferring: 7,
      toID: new mongoose.Types.ObjectId(),
    })
    .expect(404);
});

test("Should Delete userOne", async () => {
  const response = await request(app)
    .delete(`/api/users/delete/${userOneId}`)
    .send()
    .expect(200);
  const users = await userDetails.find();
  const userOneDetails = await userDetails.findById(userOneId);

  expect(response.body).toEqual({});
  expect(userOneDetails).toBe(null);
  expect(users).not.toEqual({});
});

test("Should Delete all users", async () => {
  const response = await request(app)
    .delete("/api/users/delete")
    .send()
    .expect(200);
  const users = await userDetails.find();
  const userTwoDetails = await userDetails.findById(userTwoId);
  const userOneDetails = await userDetails.findById(userOneId);

  expect(response.body).toEqual({});
  expect(userOneDetails).toBeNull();
  expect(userTwoDetails).toBeNull();
  //   expect(userOneDetails).toBe(null);
  //   expect(userTwoDetails).toBe(null);
  expect(users).toEqual([]);
});
