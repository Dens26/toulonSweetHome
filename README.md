# Vue.js toulonSweetHome

This template is designed to kickstart your development with Vue 3 in Vite, providing a solid foundation for building interactive applications.

## Recommended IDE Setup

For an optimal development experience, consider using the following setup:

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Firebase Setup

1. Create a project on [Firebase](https://console.firebase.google.com/).
2. Set up a Firestore database named "users" for your project.

   For configuration assistance, refer to the [Firestore documentation](https://cloud.google.com/firestore/docs/create-database-web-mobile-client-library?hl=en).


3. Create an `index.js` file in the `/src/firebase/` folder and copy the following code, replacing placeholders with your Firebase configuration:

```javascript
// /src/firebase/index.js

import { initializeApp } from "@firebase/app"
import { getAuth } from "@firebase/auth"
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
export {auth, db}
```

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
