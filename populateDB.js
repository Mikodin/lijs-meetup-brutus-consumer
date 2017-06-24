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

async function addWord(word) {
  if (!word) return;
  try {
    const addedWord = await axios.post('http://localhost:3000/words/',
      { word }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
    return addedWord;
  } catch (error) {
    console.error(error);
  }
}

function readTextFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/Top3575-probable.txt', 'utf8',
      (err, data) => {
        if (err) reject(err);
        const words = data.split(/\r?\n/);
        resolve(words);
      });
  });
}

async function putFilesInDB() {
  try {
    const wordArray = await readTextFile();
    console.time('APISave');
    const allQueries = await Promise.all(wordArray.map(word => addWord(word)));
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
  putFilesInDB();
});
