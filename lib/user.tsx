import { accessToken } from '../token'
import { UserResponse } from '../types/Response'

export async function getUserData() {
  const UserData: UserResponse = await fetch("https://api.github.com/users/wimpykid719", {
    headers: {"Authorization": accessToken}
  })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
  return UserData;
}