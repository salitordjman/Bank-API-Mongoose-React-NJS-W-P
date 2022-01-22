const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync("../db/users.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};
const loadUser = (id) => {
  const users = loadUsers();
  return checkLoadUser(id, users);
};
const checkLoadUser = (id, users) => {
  return users.find((user, i) => {
    if (user.id === id) {
      return user;
    }
    if (i === users.length - 1) {
      throw Error("The user is not exist");
    }
  });
};

const addUser = (body) => {
  const users = loadUsers();
  users.find((user) => {
    if (user.id === body.id) {
      throw Error("The user is allready exist");
    }
  });
  const newUser = {
    id: body.id ? body.id : uuidv4(),
    name: body.name,
    cash: 0,
    credit: 0,
  };
  users.push(newUser);
  saveUsers(users);
  return stringToJson("new-client", newUser);
};
const depositing = (id, money) => {
  checkPositive(money);
  const users = loadUsers();
  const user = checkLoadUser(id, users);
  user.cash += money;
  saveUsers(users);
  return user;
};
const credit = (id, money) => {
  checkPositive(money);
  const users = loadUsers();
  const user = checkLoadUser(id, users);
  user.credit = money;
  saveUsers(users);
  return user;
};
const withdrawFunc = (id, money) => {
  checkPositive(money);
  const users = loadUsers();
  const user = checkLoadUser(id, users);
  if (money > user.cash + user.credit) {
    const withdraw = user.cash + user.credit;
    user.cash = 0;
    user.credit = 0;
    //!
    console.log(`The user can withdraw only ${withdraw}`);
  } else if (money > user.cash) {
    user.credit += -money + user.cash;
    user.cash = 0;
  } else {
    user.cash -= money;
  }
  saveUsers(users);
  return user;
};
const transferring = (idFrom, idTo, money) => {
  checkPositive(money);
  const users = loadUsers();
  const userFrom = checkLoadUser(idFrom, users);
  const userTo = checkLoadUser(idTo, users);
  const transfer = withdrawFunc(idFrom, money);
  userTo.cash +=
    userFrom.cash - transfer.cash + userFrom.credit - transfer.credit;
  userFrom.cash = transfer.cash;
  userFrom.credit = transfer.credit;
  saveUsers(users);

  return { userFrom, userTo };
};
const deleteUser = (id) => {
  const users = loadUsers();
  const newUsers = users.filter((user) => user.id !== id);
  if (newUsers.length === users.length) {
    throw Error("The user not exist");
  }
  saveUsers(newUsers);

  //!
  console.log("The user deleted successfully");
};

const checkPositive = (money) => {
  if (money > 0) {
    return true;
  }
  throw Error("Only positive numbers");
};
const stringToJson = (message, string, message2, string2) => {
  return JSON.stringify({ [message]: string, [message2]: string2 });
};

const saveUsers = (users) => {
  const dataJSON = JSON.stringify(users);
  fs.writeFileSync("../db/users.json", dataJSON);
};

module.exports = {
  loadUsers,
  addUser,
  loadUser,
  depositing,
  credit,
  deleteUser,
  withdrawFunc,
  transferring,
};
