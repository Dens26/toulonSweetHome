<script setup>
import { RouterLink, RouterView } from "vue-router"
import { onMounted } from 'vue'
import { useDataStore } from "@/stores/data.js"
import { getAuth, onAuthStateChanged } from "@firebase/auth"
import { firebase_loadData } from "@/firebase/firebaseFunctions.js"

const dataStore = useDataStore()

onMounted(() => {
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    dataStore.userAccount.accommodations = []
    if (user) {
      try {
        const data = await firebase_loadData(user.uid, "users")
        if (data) {
          dataStore.connectionStatus = true
          dataStore.userAccount.uid = user.uid
          dataStore.userAccount.email = user.email
          dataStore.userAccount.firstName = data.firstName
          dataStore.userAccount.lastName = data.lastName
          dataStore.userAccount.birthday = data.birthday
          dataStore.userAccount.countryCode = data.countryCode
          dataStore.userAccount.mobile = data.mobile
          if (data.accommodations) {
            const accommodations = JSON.parse(data.accommodations)
            // Accommodation load
            for (const acc of accommodations) {
              try {
                const acc_data = await firebase_loadData(acc.accommodation_id, "accommodations")
                const reservations = JSON.parse(acc_data.reservations)
                const reservationsTab = []
                for (const res of reservations) {
                  try {
                    const res_data = await firebase_loadData(res.reservation_id, "reservations")
                    if (res_data) {
                      const reservation = {
                        endDate: res_data.endDate,
                        nbrOfPersons: res_data.nbrOfPersons,
                        startDate: res_data.startDate,
                        uid: res_data.uid
                      }
                      reservationsTab.push(reservation)
                    }
                    reservationsTab.sort((a, b) => {
                      return a.startDate < b.startDate ? -1 : 1
                    })
                  }
                  catch (error) {
                    console.error("Erreur lors de la récupération des données utilisateurs :", error)
                  }
                }
                if (acc_data) {
                  const accommodation = {
                    id: acc.accommodation_id,
                    address: acc_data.address,
                    available: acc_data.available,
                    maxPersons: acc_data.maxPersons,
                    name: acc_data.name,
                    nbrOfRooms: acc_data.nbrOfRooms,
                    pictures: JSON.parse(acc_data.pictures),
                    price: acc_data.price,
                    reservations: reservationsTab,
                    uid: acc_data.uid,
                    unavailabylityDate: acc_data.unavailabylityDate,
                    pictureIndex: 0
                  }
                  dataStore.userAccount.accommodations.push(accommodation)
                }
                else
                  dataStore.connectionStatus = false
              }
              catch (error) {
                console.error("Erreur lors de la récupération des données utilisateurs :", error)
              }
            }
          }
        }
        else
          dataStore.connectionStatus = false
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error)
      }
    }
    else
      dataStore.connectionStatus = false
  })
})
</script>
<script>
import SignUpModal from "@/components/icons/SignUp_modal.vue"
import SignInModal from "@/components/icons/SignIn_modal.vue"
import MenuModal from "@/components/icons/Menu_modal.vue"

export default {
  // name: "App",
  components: {
    "SignUp_modal": SignUpModal,
    "SignIn_modal": SignInModal,
    "Menu_modal": MenuModal
  }
}
</script>
<template>
  <header>
    <nav>
      <RouterLink to="/"><img alt="Vue logo" class="logo" src="@/assets/favicon/android-chrome-192x192.png" width="36"
          title="Accueil" /></RouterLink>
      <div class="search-bar"></div>
      <button class="add-button"></button>
      <button class="menu-button" v-on:click="dataStore.showMenu = !dataStore.showMenu">
        <img class="icon" src="@/assets/icons/bars-solid.svg" alt="menu logo">
        <span v-if="!dataStore.connectionStatus">
          <img class="icon" src="@/assets/icons/user-solid.svg" alt="menu logo">
        </span>
        <span class="user-icon-container" v-else>
          <div class="user-icon">{{ dataStore.getFirstNameChar }}</div>
        </span>
      </button>
    </nav>
    <Menu_modal></Menu_modal>
    <SignUp_modal></SignUp_modal>
    <SignIn_modal></SignIn_modal>
  </header>

  <RouterView />
  <footer class="footer">
    <RouterLink to="/contact">Contact</RouterLink>
    <RouterLink to="/contact">Condition d'utilisation</RouterLink>
    <RouterLink to="/contact">Politique de protection des données</RouterLink>
  </footer>
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
  justify-content: center;
  padding: 0 10px;
  font-size: 12px;
  align-items: center;
  margin-top: 1rem;
}

nav button {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 85px;
  height: 45px;
  border: 1px solid var(--color-border);
  border-radius: 50px;
  background: var(--color-background-mute);

}

nav button:hover {
  cursor: pointer;
  background-color: var(--color-border);
  box-shadow: 0 0 3px gray;
}

.menu-button {
  min-width: 80px;
}

.hidden {
  display: none;
}

.search-bar {
  height: 45px;
  width: 100%;
  max-width: 500px;
  min-width: 130px;
  border-radius: 20px;
  background: var(--color-background-mute);
}

.add-button {
  height: 45px;
  width: 100%;
  max-width: 200px;
}

.footer {
  display: flex;
  gap: 1rem;
  margin: 5px;
  position: absolute;
  bottom: 0;
  font-size: 0.6rem;
}
</style>
