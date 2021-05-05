// import { accessToken } from '../token'
import { UserResponse } from '../types/Response'

export async function getUserData() {
  const UserData: UserResponse = await fetch("https://api.github.com/users/wimpykid719", {
    headers: {"Authorization": `token ${process.env.GITHUB_TOKEN}`}
  })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
  return UserData;
}