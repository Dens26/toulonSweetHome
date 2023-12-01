<script setup>
//References
import "@/assets/main.css"
import { useDataStore } from "@/stores/data.js"
import { firebase_loginUser } from "@/firebase/firebaseFunctions.js"

//Properties
const dataStore = useDataStore()

//Functions
/**
 * 
 */
async function loginUser() {
    try {
        await firebase_loginUser(dataStore.registerInfo.email, dataStore.registerInfo.password)
        dataStore.HideAllMenu()
        setTimeout(() => {
            window.location.reload()
        },500)
    }
    catch (error) {
        console.log(error.message)
    }
}
</script>

<script>
export default {
    name: "SignIn"
}
</script>

<template>
    <div class="container" v-bind:class="{ hidden: !dataStore.showSignIn }">
        <div class="overlay" v-on:click="dataStore.ShowSignIn(false)"></div>
        <form class="form" action="#">
            <div class="form-header">
                <button type="button" v-on:click="dataStore.ShowSignIn(false)">X</button>
                <h2>Connexion</h2>
            </div>
            <div class="separator"></div>
            <div class="form-group">
                <label for="email">Adresse mail</label>
                <span>
                    <input type="email" id="email" placeholder="Votre adresse mail" required autocomplete="email"
                        v-model="dataStore.registerInfo.email">
                    <span v-if="dataStore.registerInfo.email">
                        <span v-if="dataStore.emailVerification">
                            <img src="@/assets/icons/circle-check-solid.svg" alt="logo de vérification">
                        </span>
                        <span v-else>
                            <img src="@/assets/icons/circle-exclamation-solid.svg" alt="logo de vérification">
                        </span>
                    </span>
                </span>
                <p class="error-message">{{ dataStore.error.emailError }}</p>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <span>
                    <input type="password" id="password" placeholder="Votre mot de passe" required maxlength="31"
                        v-model="dataStore.registerInfo.password">
                    <span v-if="dataStore.registerInfo.password">
                        <span v-if="dataStore.passwordVerification">
                            <img src="@/assets/icons/circle-check-solid.svg" alt="logo de vérification">
                        </span>
                        <span v-else>
                            <img src="@/assets/icons/circle-exclamation-solid.svg" alt="logo de vérification">
                        </span>
                    </span>
                </span>
                <p class="error-message">{{ dataStore.error.passwordLengthError }}</p>
                <p class="error-message">{{ dataStore.error.passwordSpecialCharacterError }}</p>
                <p class="error-message">{{ dataStore.error.passwordLowerCaseError }}</p>
                <p class="error-message">{{ dataStore.error.passwordUpperCaseError }}</p>
                <p class="error-message">{{ dataStore.error.passwordDigitError }}</p>
            </div>
            <div class="separator"></div>
            <p class="error-message">{{ dataStore.registerError }}</p>
            <span class="submit" v-if="dataStore.getFormValidForConnection">
                <button class="allowed" type="submit" v-on:click.prevent="loginUser()">Se connecter</button>
            </span>
            <span class="submit" v-else>
                <button class="not-allowed" disabled type="submit">Se connecter</button>
            </span>
        </form>
    </div>
</template>

<style scoped></style>