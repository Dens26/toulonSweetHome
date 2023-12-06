<script setup>
import { firebase_logOutUser} from "@/firebase/firebaseFunctions.js"
import { useDataStore } from "@/stores/data.js"
import router from "@/router/index.js"
const dataStore = useDataStore()

async function logOutUser() {
  try {
    await firebase_logOutUser()
    dataStore.HideAllMenu()
    router.push("/")
  }
  catch (error) {
    console.error("Erreur lors de la déconnexion de l'utilisateur :", error)
  }
}

</script>

<script>
export default {
    name: "Menu_modal"
}
</script>

<template>
    <div class="container" v-bind:class="{ hidden: !dataStore.showMenu }">
        <div class="overlay" v-on:click="dataStore.ShowMenu(false)"></div>
        <div class="menu" v-bind:class="{ hidden: !dataStore.showMenu }">
            <span v-if="!dataStore.connectionStatus">
                <p class="menu-item">
                <p class="item" v-on:click="dataStore.ShowSignUp(true)">Inscription</p>
                </p>
                <p class="menu-item">
                <p class="item" v-on:click="dataStore.ShowSignIn(true)">Connexion</p>
                </p>
            </span>
            <span v-else>
                <p class="menu-title">Bienvenue {{ dataStore.userAccount.firstName }}</p>
                <p class="menu-item">
                    <RouterLink class="item" :to="{ name: 'account' }" v-on:click="dataStore.HideAllMenu">Compte
                    </RouterLink>
                </p>
                <p class="menu-item">
                <p class="item" v-on:click="logOutUser()">Deconnexion</p>
                </p>
            </span>
        </div>
    </div>
</template>

<style scoped>

.menu {
  margin: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  position: absolute;
  right: 0;
  top:60px;
  background: var(--color-background-mute);
  width: 250px;
  border-radius: 15px;
  box-shadow: 0 0 5px gray;
}

.menu-title {
  padding: 5px;
  margin-left: 10px;
}

.item {
  display: block;
  text-decoration: none;
  height: 50px;
  padding: 10px;
  color: var(--color-text);
  font-weight: 600;
}

.menu-item:hover {
  cursor: pointer;
  background-color: var(--color-border);
}
</style>