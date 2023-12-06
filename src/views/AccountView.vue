<script setup>
import { useDataStore } from "@/stores/data.js"
const dataStore = useDataStore()
</script>

<script>
import AddAccommodationModal from "@/components/icons/AddAccommodation_modal.vue"
import AccommodationsModal from "@/components/icons/Accommodations_modal.vue"

export default {
//   name: "Account",
  components: {
    "AddAccommodation_modal": AddAccommodationModal,
    "Accommodations_modal": AccommodationsModal
  }
}

</script>

<template>
    <span v-if="!dataStore.userAccount.uid">
        <h2>Veuillez vous connecter à un compte </h2>
    </span>
    <span v-else>
        <h2>Compte de {{ dataStore.userAccount.firstName + " " + dataStore.userAccount.lastName }}</h2>
        <div class="account-container">
            <p class="message">{{ dataStore.message.addAccommodationMessage }}</p>
            <button class="btn" v-on:click="!dataStore.ShowAddAccommodation(true)">Ajouter un logement à la location</button>
        </div>
        <div class="account-container">
            <button class="btn" v-on:click="!dataStore.ShowAccommodations(true)">Vos logements à la location</button>
        </div>
    </span>
    <AddAccommodation_modal></AddAccommodation_modal>
    <Accommodations_modal></Accommodations_modal>
</template>
<style>


.account-container {
    display: flex;
    flex-direction: column;
    max-width: 500px;
    margin: 0 auto;
}

.btn {
    height: 50px;
    margin: 15px;
}

.message{
    color: green;
}
</style>
