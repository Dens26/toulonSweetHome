<script setup>
import { useDataStore } from "@/stores/data.js"
import { firebase_requestToAskNewAccommodation } from "@/firebase/firebaseFunctions.js"
const dataStore = useDataStore()

async function requestToAddAccommodation() {
  const response = await firebase_requestToAskNewAccommodation(dataStore.userAccount.uid, dataStore.userAccount.email, dataStore.userAccount.countryCode, dataStore.userAccount.mobile)
  if (response.success) {
    dataStore.HideAllMenu()
    dataStore.message.addAccommodationMessage = response.message
  }
  dataStore.message.addAccommodationError = response.message
}

</script>

<script>
export default {
  name: "AddAccommodation_modal"
}
</script>

<template>
  <div class="container" v-bind:class="{ hidden: !dataStore.showAddAccommodation }">
    <div class="overlay" v-on:click="dataStore.ShowAddAccommodation(false)"></div>
    <form class="form" action="#">
      <div class="form-header">
        <button type="button" v-on:click="dataStore.ShowAddAccommodation(false)">X</button>
        <h3>Demande d'ajout de logement à la location</h3>
      </div>
      <p>L'ajout d'une nouvelle propriété à la location nécessite l'intervention d'un administrateur.</p>
      <p>Nous vous prions de vérifier attentivement vos coordonnées de contact.</p>
      <p>Un administrateur prendra contact avec vous prochainement afin d'organiser une visite du logement, permettant
        ainsi d'examiner en détail les spécificités de votre demande et d'évaluer sa faisabilité.</p>
      <div class="separator"></div>
      <div class="form-group">
        <label for="email">Adresse mail</label>
        <input type="text" disabled v-bind:value="dataStore.userAccount.email" />
      </div>
      <div class="form-group">
        <label for="email">Numéro de portable</label>
        <input type="text" disabled v-bind:value="dataStore.userAccount.countryCode + dataStore.userAccount.mobile" />
      </div>
      <span class="submit">
        <button type="submit" v-on:click.prevent="requestToAddAccommodation()">Envoyer</button>
      </span>
      <p class="error-message">{{ dataStore.message.addAccommodationError }}</p>
    </form>
  </div>
</template>

<style scoped>
form p {
  padding: 10px;
}
</style>