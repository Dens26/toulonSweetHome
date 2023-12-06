<script setup>
import { useDataStore } from "@/stores/data.js"
const dataStore = useDataStore()

</script>

<script>
export default {
  name: "Reservation_modal",
}
</script>

<template>
  <div class="container" v-bind:class="{ hidden: !dataStore.showReservation }">
    <div class="overlay" v-on:click="dataStore.ShowReservation(false)"></div>
    <div class="form" action="#">
      <div class="form-header">
        <button type="button" v-on:click="dataStore.ShowReservation(false)">X</button>
        <h3>Votre reservation du {{ dataStore.reservation.startDate.split('-').reverse().join('/') }}</h3>
      </div>
      <!-- <div class="separator"></div> -->
      <div>
        <p>(Informations à définir ...)</p>
        <p>Etat des lieux de sortie prévue dans : {{ parseInt((new Date(dataStore.reservation.endDate).getTime() -
          Date.now()) / 1000 / 60 / 60 / 24) }} jours</p>
        <div class="separator"></div>
        <p>Information concernant la réservation</p>
        <p>Réservation faite par {{ dataStore.reservation.travelerFirstName }} {{ dataStore.reservation.travelerLastName
        }}</p>
        <p>Nombre de personnes : {{ dataStore.reservation.nbrOfPersons }}</p>
        <p>Du {{ dataStore.reservation.startDate.split('-').reverse().join('/') }} au {{
          dataStore.reservation.endDate.split('-').reverse().join('/') }}</p>
        <div class="separator"></div>
        <p>Contact</p>
        <p>{{ dataStore.reservation.travelerCountryCode + dataStore.reservation.travelerMobile }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>