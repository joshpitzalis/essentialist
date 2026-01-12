// // api.tsx
// import { RegistrationInput } from "./components/registrationForm";
// import axios from 'axios'

// export const api = {
//   posts: {
//     getPosts: () => {
//       return axios.get('http://localhost:3000/posts?sort=recent')
//     }
//   },
//   register: (input: RegistrationInput) => {
//     return axios.post('http://localhost:3000/users/new', {
//       ...input
//     })
//   }
// }

import { createUsersAPI } from "@question-scraper/shared/src/api/users";

export const api = createUsersAPI("http://localhost:3000");
