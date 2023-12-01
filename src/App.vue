<script setup>
import { onMounted } from 'vue'
import { useDataStore } from "@/stores/data.js"
import { getAuth, onAuthStateChanged } from "@firebase/auth"
import { firebase_logOutUser, firebase_loadUserData } from "@/firebase/firebaseFunctions.js"

const dataStore = useDataStore()
const auth = getAuth();

onMounted(() => {
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const data = await firebase_loadUserData(user.uid);
        if (data) {
          dataStore.connectionStatus = true;
          dataStore.userAccount.firstName = data.firstName;
          dataStore.userAccount.lastName = data.lastName;
          dataStore.userAccount.birthday = data.birthday;
        } else {
          dataStore.connectionStatus = false;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      }
    } else {
      dataStore.connectionStatus = false;
    }
  });
});

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
import SignUpModal from "@/views/SignUp_modal.vue"
import SignInModal from "@/views/SignIn_modal.vue"

export default {
  name: "App",
  components: {
    "SignUp_modal": SignUpModal,
    "signin_modal": SignInModal,
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
    <SignUp_modal></SignUp_modal>
    <signin_modal></signin_modal>
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
