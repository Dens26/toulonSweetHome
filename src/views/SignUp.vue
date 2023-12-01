<script setup>
// References
import "@/assets/main.css"
import { useDataStore } from "@/stores/data.js"
import { firebase_createUser } from "@/firebase/firebaseFunctions.js"

// Properties
const dataStore = useDataStore()

// Functions
function createUser() {
    dataStore.error.registerError = ""
    firebase_createUser(JSON.parse(JSON.stringify(dataStore.registerInfo)))
    .then((user) => {
            dataStore.userAccount.uid = user.uid
            dataStore.ShowSignUp(false)
        })
        .catch((error) => {
            if (error.code == "auth/email-already-in-use")
                dataStore.error.registerError = "Adresse e-mail déjà utilisée. Veuillez en choisir une autre."
            else
                dataStore.error.registerError = `Erreur lors de la création de l'utilisateur : ${error.code}`
        })
}
</script>

<script>
export default {
    name: "SignUp"
}
</script>

<template>
    <div class="container" v-bind:class="{ hidden: !dataStore.showSignUp }">
        <div class="overlay" v-on:click="dataStore.ShowSignUp(false)"></div>
        <form class="form">
            <div class="form-header">
                <button type="button" v-on:click="dataStore.ShowSignUp(false)">X</button>
                <h2>Inscription</h2>
            </div>
            <p>Informations de connexion</p>
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
            <p>Informations personnelles</p>
            <div class="form-group">
                <label for="firstName">Prénom</label>
                <span>
                    <input type="text" id="firstName" placeholder="Votre prénom" required autocomplete="name"
                        v-model="dataStore.registerInfo.firstName">
                    <span v-if="dataStore.registerInfo.firstName">
                        <span v-if="dataStore.firstNameVerification">
                            <img src="@/assets/icons/circle-check-solid.svg" alt="logo de vérification">
                        </span>
                        <span v-else>
                            <img src="@/assets/icons/circle-exclamation-solid.svg" alt="logo de vérification">
                        </span>
                    </span>
                </span>
                <p class="error-message">{{ dataStore.error.firstNameError }}</p>
            </div>
            <div class="form-group">
                <label for="lastName">Nom</label>
                <span>
                    <input type="text" id="lastName" placeholder="Votre Nom" required autocomplete="name"
                        v-model="dataStore.registerInfo.lastName">
                    <span v-if="dataStore.registerInfo.lastName">
                        <span v-if="dataStore.lastNameVerification">
                            <img src="@/assets/icons/circle-check-solid.svg" alt="logo de vérification">
                        </span>
                        <span v-else>
                            <img src="@/assets/icons/circle-exclamation-solid.svg" alt="logo de vérification">
                        </span>
                    </span>
                </span>
                <p class="error-message">{{ dataStore.error.lastNameError }}</p>
            </div>
            <div class="form-group">
                <label for="birthday">Date de naissance</label>
                <span>
                    <input type="date" id="birthday" placeholder="Votre Date de naissance" required autocomplete="bday"
                        v-model="dataStore.registerInfo.birthday">
                    <span v-if="dataStore.registerInfo.birthday">
                        <span v-if="dataStore.birthdayVerification">
                            <img src="@/assets/icons/circle-check-solid.svg" alt="logo de vérification">
                        </span>
                        <span v-else>
                            <img src="@/assets/icons/circle-exclamation-solid.svg" alt="logo de vérification">
                        </span>
                    </span>
                </span>
                <p class="error-message">{{ dataStore.error.birthdayError }}</p>
            </div>
            <p class="error-message">{{ dataStore.error.registerError }}</p>
            <span class="submit" v-if="dataStore.getFormValidForRegistration">
                <button class="allowed" type="submit" v-on:click.prevent="createUser()">S'inscrire</button>
            </span>
            <span class="submit" v-else>
                <button class="not-allowed" disabled type="submit">S'inscrire</button>
            </span>
        </form>
    </div>
</template>

<style scoped></style>