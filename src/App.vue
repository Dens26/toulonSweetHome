<script setup>
import { onMounted } from 'vue'
import { useDataStore } from "@/stores/data.js"
import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/index.js"
import { firebase_logOutUser } from "@/firebase/firebaseFunctions.js"

const dataStore = useDataStore()
const auth = getAuth();

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid)
      try {
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          dataStore.connectionStatus = true
          dataStore.userAccount.firstName = docSnap.data().firstName
          dataStore.userAccount.lastName = docSnap.data().lastName
          dataStore.userAccount.birthday = docSnap.data().birthday
        }
        else {
          dataStore.userAccount.firstName = "error"
          dataStore.connectionStatus = false
        }
      }
      catch (error) {
        dataStore.connectionStatus = false
        console.error("Erreur lors de la récupération des données utilisateur :", error)
      }
    }
    else
      dataStore.connectionStatus = false
  })
})

async function logOutUser() {
  try {
    await firebase_logOutUser()
    dataStore.HideAllMenu()
  }
  catch (error) {
    console.error("Erreur lors de la déconnexion de l'utilisateur :", error);
  }
}
</script>
<script>
import SignUp from "@/views/SignUp.vue"
import SignIn from "@/views/SignIn.vue"

export default {
  name: "App",
  components: {
    "signup": SignUp,
    "signin": SignIn,
  }
}
</script>
<template>
  <header>
    <nav>
      <img alt="Vue logo" class="logo" src="@/assets/favicon/android-chrome-192x192.png" width="48" />
      <button v-on:click="dataStore.showMenu = !dataStore.showMenu">
        <img class="icon" src="@/assets/icons/bars-solid.svg" alt="menu logo">
        <span v-if="!dataStore.connectionStatus">
          <img class="icon" src="@/assets/icons/user-solid.svg" alt="menu logo">
        </span>
        <span class="user-icon-container" v-else>
          <div class="user-icon">{{ dataStore.getFirstNameChar }}</div>
        </span>
      </button>
    </nav>
    <div class="menu" v-bind:class="{ hidden: !dataStore.showMenu }">
      <span v-if="!dataStore.connectionStatus">
        <p class="menu-item">
        <p v-on:click="dataStore.ShowSignUp(true)">Inscription</p>
        </p>
        <p class="menu-item">
        <p v-on:click="dataStore.ShowSignIn(true)">Connexion</p>
        </p>
      </span>
      <span v-else>
        <p class="menu-title">Bienvenue {{ dataStore.userAccount.firstName }}</p>
        <p class="menu-item">
        <p>Compte (en cours ...)</p>
        </p>
        <p class="menu-item">
        <p v-on:click="logOutUser()">Deconnexion</p>
        </p>
      </span>
    </div>
    <signup></signup>
    <signin></signin>
    <create-account></create-account>
  </header>
</template>

<style scoped>
header {
  position: relative;
}

/* menu window */
.icon {
  width: 24px;
}

.user-icon-container {
  display: flex;
}

.user-icon {
  width: 35px;
  height: 35px;
  background: black;
  color: white;
  border: 1px solid black;
  border-radius: 20px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

nav {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 10px;
  font-size: 12px;
  align-items: center;
  margin-top: 2rem;
}

nav button {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100px;
  height: 50px;
  border: 1px solid var(--color-border);
  border-radius: 50px;
  background: var(--color-background-mute);

}

nav button:hover {
  cursor: pointer;
  background-color: var(--color-border);
  box-shadow: 0 0 3px gray;
}

.menu {
  margin: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  position: absolute;
  right: 0;
  background: var(--color-background-mute);
  width: 250px;
  border-radius: 15px;
  box-shadow: 0 0 5px gray;
}

.menu-title {
  padding: 5px;
  margin-left: 10px;
}

.menu-item p {
  height: 50px;
  padding: 10px;
  color: var(--color-text);
  font-weight: 600;
}

.menu-item:hover {
  cursor: pointer;
  background-color: var(--color-border);
}


.hidden {
  display: none;
}
</style>