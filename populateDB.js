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

async function authenticate() {
  try {
    const token = await axios.post('http://localhost:3000/users/auth', userCreds,
      { headers: { 'Content-Type': 'application/json' } });
    return token;
  } catch (error) {
    console.log(error);
  }
}

async function addWord(word) {
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

authenticate().then((res) => {
  token = `JWT ${res.data.token}`;
  addWord('MikodinBro1')
    .then(addedWord => console.log(addedWord.data))
    .catch(addError => console.error(addError));
})
  .catch(err => console.error(err));
