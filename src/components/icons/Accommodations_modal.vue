<script setup>
import { useDataStore } from "@/stores/data.js"
const dataStore = useDataStore()

</script>

<script>
import ReservationModal from "@/components/icons/Reservation_modal.vue"
export default {
  // name: "Accommodations_modal",
  components: {
    "Reservation_modal": ReservationModal
  },
  methods: {
    changePicture(accommodation) {
      if (accommodation.pictureIndex == accommodation.pictures.length - 1)
        accommodation.pictureIndex = 0
      else
        accommodation.pictureIndex++
    }
  }
}
</script>

<template>
  <div class="container" v-bind:class="{ hidden: !dataStore.showAccommodations }">
    <div class="overlay" v-on:click="dataStore.ShowAccommodations(false)"></div>
    <div class="accommodation-form" action="#">
      <div class="form-header">
        <button type="button" v-on:click="dataStore.ShowAccommodations(false)">X</button>
        <h3>Vos logements en location</h3>
      </div>
      <div class="separator"></div>
      <div class="card-container">
        <div class="card" v-for="accommodation in dataStore.userAccount.accommodations">
          <img class="card-picture" v-bind:src=accommodation.pictures[accommodation.pictureIndex].sizes.small alt=""
            v-on:click="changePicture(accommodation)">
          <div class="card-info">
            <p class="name">{{ accommodation.name }}</p>
            <p>{{ accommodation.address }}</p>
            <p>Chambres : {{ accommodation.nbrOfRooms }}</p>
            <p>Personnes max. : {{ accommodation.maxPersons }}</p>
            <p>{{ accommodation.price }} €/semaine</p>
          </div>
          <div class="card-reservation">
            <p>Reservation :</p>
            <p class="reservation" v-for="reservation in accommodation.reservations" v-on:click="dataStore.ShowReservation(true, reservation)"
              v-bind:class="{ green: Date.now() > new Date(reservation.startDate).getTime() && Date.now() < new Date(reservation.endDate).getTime() }">
              Du {{ reservation.startDate.split('-').reverse().join('/') }} au {{ reservation.endDate.split('-').reverse().join('/')}}
            </p>
          </div>
          <p class="availability green" v-if="accommodation.available">
            Disponible jusqu'au : <span v-if="accommodation.unavailabylityDate">{{ accommodation.unavailabylityDate
            }}</span><span v-else> non définie</span>
          </p>
          <p class="availability red" v-else>
            Non disponible
          </p>
        </div>
      </div>
    </div>
  </div>
  <Reservation_modal></Reservation_modal>
</template>

<style scoped>
.accommodation-form {
  max-width: 900px;
  position: absolute;
  width: 90%;
  top: 8%;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 15px 5px;
  background: var(--color-background-mute);
  border-radius: 15px;
  box-shadow: 0 0 5px gray;
}

.card-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.card {
  flex: 1 1 280px;
  background-color: rgb(180, 180, 180);
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
}

.card-picture {
  grid-column: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  grid-column: 2;
  padding-left: 10px;
}

.card-reservation {
  grid-column: 1/-1;
}

.reservation{
  margin: 2px;
}
.reservation:hover{
  cursor: pointer;
}

.availability {
  padding: 10px 0;
  font-weight: 600;
  font-style: italic;
  grid-column: 1/-1;
}

.green {
  color: green;
}

.red {
  color: red;
}

.name {
  font-weight: 600;
}
</style>