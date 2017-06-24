const fs = require('fs');
const axios = require('axios');

const userCreds = {
  username: 'mikodinapi',
  password: 'Password',
};

let token;

async function registerAccount() {
  try {
    const user = await axios.post('http://localhost:3000/users/register', userCreds,
      { headers: { 'Content-Type': 'application/json' } });

    return true;
  } catch (error) {
    console.log(error);
  }
}

async function addWord(password) {
  if (!password) return;
  try {
    const addedPassword = await axios.post('http://localhost:3000/passwords/',
      { password }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
    return addedPassword;
  } catch (error) {
    console.error(error);
  }
}

function readTextFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/Top3575-probable.txt', 'utf8',
      (err, data) => {
        if (err) reject(err);
        const passwords = data.split(/\r?\n/);
        resolve(passwords);
      });
  });
}

async function putPasswordsInDb() {
  try {
    const passwordArray = await readTextFile();
    console.time('APISave');

    const allQueries =
      await Promise.all(passwordArray.map(password => addWord(password)));

    console.log(`${allQueries.length} words added in:`);
    console.timeEnd('APISave');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function authenticate() {
  try {
    const token = await axios.post('http://localhost:3000/users/auth', userCreds,
      { headers: { 'Content-Type': 'application/json' } });
    return token;
  } catch (error) {
    console.log(error.data);
  }
}

authenticate().then((res) => {
  token = `JWT ${res.data.token}`;
  putPasswordsInDb();
});
