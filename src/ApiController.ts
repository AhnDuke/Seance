const userName = await fetch(
  "https://random-word-api.herokuapp.com/word?number=2",
).then((res) =>
  res.json().then((resp) => {
    let capitalized = "";
    for (let i = 0; i < 2; i++) {
      let curWord: string = resp[i];
      curWord = curWord[0].toUpperCase() + curWord.slice(1);
      capitalized += curWord;
    }
    return capitalized;
  }),
);

const apiController = {
  refName: userName,
  setUserName: (newName: string) => {
    apiController.refName = newName;
    return apiController.refName;
  },
  getUserName: () => {
    return apiController.refName;
  },
};

export default apiController;
