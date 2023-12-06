import { defineStore } from 'pinia'
import { country } from "@/assets/country.js"
import { firebase_loadData } from "@/firebase/firebaseFunctions.js"

export const useDataStore = defineStore('data', {
  state: () => ({
    // Connection status
    connectionStatus: false,

    // Data
    countryCodes: country,
    countryCodePlaceholder: "Votre numéro de portable",
    reservation: {
      accommodation_id: "",
      endDate: "",
      nbrOfPersons: "",
      startDate: "",
      travelerFirstName: "",
      travelerLastName: "",
      travelerCountryCode: "",
      travelerMobile: ""
    },


    // User Informations
    userAccount: {
      uid: "",
      email: "",
      firstName: "",
      lastName: "",
      countryCode: "",
      mobile: "",
      birthday: "",
      accommodations: []
    },

    // Page status
    showMenu: false,
    showSignUp: false,
    showSignIn: false,
    showAddAccommodation: false,
    showAccommodations: false,
    showReservation: false,

    // Register informations
    registerInfo: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      countryCode: "",
      mobile: "",
      birthday: ""
    },

    // Properties status
    formValid: {
      emailValid: false,
      passwordValid: false,
      firstNameValid: false,
      lastNameValid: false,
      mobileValid: false,
      birthdayValid: false
    },

    // Error management
    error: {
      emailError: "",
      passwordLengthError: "",
      passwordSpecialCharacterError: "",
      passwordLowerCaseError: "",
      passwordUpperCaseError: "",
      passwordDigitError: "",
      confirmPasswordError: "",

      firstNameError: "",
      lastNameError: "",
      mobileError: "",
      birthdayError: "",
      addAccommodationError: "",

      registerError: ""
    },
    message: {
      addAccommodationMessage: ""
    }
  }),
  actions: {
    // Clear all register and error datas
    clearAllInfo() {
      for (let key in this.registerInfo) {
        if (key != "countryCode")
          this.registerInfo[key] = ""
      }
      for (let key in this.error)
        this.error[key] = ""
      for (let key in this.formValid)
        this.formValid[key] = false
      for (let key in this.message)
        this.message[key] = ""
    },
    ShowMenu(value) {
      this.showMenu = false
      this.clearAllInfo()
    },
    // Signup display management
    ShowSignUp(value) {
      this.showSignUp = value
      this.showMenu = false
      this.clearAllInfo()
    },
    // Signin display management
    ShowSignIn(value) {
      this.showSignIn = value
      this.showMenu = false
      this.clearAllInfo()
    },
    ShowAddAccommodation(value) {
      this.showAddAccommodation = value
      this.showMenu = false
      this.clearAllInfo()
    },
    ShowAccommodations(value) {
      this.showAccommodations = value
      this.showMenu = false
      this.clearAllInfo()
    },
    async ShowReservation(value, reservation) {
      this.showReservation = value
      if (value) {
        const user = await firebase_loadData(reservation.uid, "users")
        if (user) {
          this.reservation.accommodation_id = reservation.accommodation_id
          this.reservation.endDate = reservation.endDate
          this.reservation.nbrOfPersons = reservation.nbrOfPersons
          this.reservation.startDate = reservation.startDate
          this.reservation.travelerFirstName = user.firstName
          this.reservation.travelerLastName = user.lastName
          this.reservation.travelerCountryCode = user.countryCode
          this.reservation.travelerMobile = user.mobile
        }
      }
      this.clearAllInfo()
    },
    HideAllMenu() {
      this.showSignIn = false
      this.showMenu = false
      this.showSignUp = false
      this.showAddAccomodation = false
      this.clearAllInfo()
    },
    countryCodeChange(event) {
      this.registerInfo.countryCode = `+${event.target.value}`
      if (this.registerInfo.countryCode == "+33")
        this.countryCodePlaceholder = "XXXXXXXXX"
      else {
        this.countryCodePlaceholder = "Votre numéro de portable"
      }
    }
  },

  getters: {
    // Return the firstName first character
    getFirstNameChar() {
      return this.userAccount.firstName[0]
    },
    // Return true if all formValid for registration is Ok
    getFormValidForRegistration(state) {
      let result = true
      for (const key in state.formValid) {
        if (!state.formValid[key])
          result = false
      }
      return result
    },
    // Return true if all formValid for connection is Ok
    getFormValidForConnection(state) {
      if (!state.formValid.emailValid || !state.formValid.passwordValid)
        return false
      else
        return true
    },
    // Check the email structure
    emailVerification(state) {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (!regexEmail.test(state.registerInfo.email)) {
        state.error.emailError = "Veuillez saisir un e-mail valide (ex : exemple@exemple.fr)"
        return state.formValid.emailValid = false
      }
      state.error.emailError = ""
      return state.formValid.emailValid = true
    },
    // Check the password structure
    passwordVerification(state) {
      // Initialisation
      let result = true
      state.error.passwordLengthError = ""
      state.error.passwordSpecialCharacterError = ""
      state.error.passwordLowerCaseError = ""
      state.error.passwordUpperCaseError = ""
      state.error.passwordDigitError = ""
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '|', ';', ':', "'", '"', ',', '.', '<', '>', '/', '?']
      const regexLowerCase = /[a-z]/
      const regexUpperCase = /[A-Z]/
      const regexDigit = /[0-9]/

      // Check the password length
      if (state.registerInfo.password.length < 12) {
        state.error.passwordLengthError = "- Au moins 12 caractères"
        result = false
      }
      else if (state.registerInfo.password.length > 30) {
        state.error.passwordLengthError = "- 30 caractères maximum"
        result = false
      }

      // Check the special character in password
      let find = false
      for (const char of specialChars) {
        if (state.registerInfo.password.includes(char)) {
          find = true
        }
      }
      if (!find) {
        state.error.passwordSpecialCharacterError = `- Au moins un caractère spécial de type : !@#$%^&*()-_=+[]{}|;:'",.<>/?`
        result = false
      }

      // Check the lowercase character in password
      if (!regexLowerCase.test(state.registerInfo.password)) {
        state.error.passwordLowerCaseError = "- Au moins une minuscule"
        result = false
      }

      // Check the uppercase character in password
      if (!regexUpperCase.test(state.registerInfo.password)) {
        state.error.passwordUpperCaseError = "- Au moins une majuscule"
        result = false
      }

      // Check the uppercase character in password
      if (!regexUpperCase.test(state.registerInfo.password)) {
        state.error.passwordUpperCaseError = "- Au moins une majuscule"
        result = false
      }

      // Check the digital character in password
      if (!regexDigit.test(state.registerInfo.password)) {
        state.error.passwordDigitError = "- Au moins un chiffre";
        result = false;
      }

      // Return result
      return state.formValid.passwordValid = result
    },
    // Check the firstName structure
    firstNameVerification(state) {
      state.registerInfo.firstName = state.registerInfo.firstName.charAt(0).toUpperCase() + state.registerInfo.firstName.slice(1)

      if (state.registerInfo.firstName.length < 2) {
        state.error.firstNameError = "Au moins 2 caractères"
        return state.formValid.firstNameValid = false
      }
      state.error.firstNameError = ""
      return state.formValid.firstNameValid = true
    },
    // Check the lastname structure
    lastNameVerification(state) {
      state.registerInfo.lastName = state.registerInfo.lastName.toUpperCase()
      if (state.registerInfo.lastName.length < 2) {
        state.error.lastNameError = "Au moins 2 caractères"
        return state.formValid.lastNameValid = false
      }
      state.error.lastNameError = ""
      return state.formValid.lastNameValid = true
    },
    // Calculates and verifies the entered age
    birthdayVerification(state) {
      if (parseInt((Date.now() - new Date(state.registerInfo.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365)) < 18) {
        state.error.birthdayError = "Vous devez avoir au moins 18 ans"
        return state.formValid.birthdayValid = false
      }
      state.error.birthdayError = ""
      return state.formValid.birthdayValid = true
    },
    // Check the mobile structure
    mobileVerification(state) {
      if (!state.registerInfo.countryCode) {
        state.error.mobileError = "Vous devez choisir l'indicatif du pays"
        return state.formValid.mobileValid = false
      }
      else {
        if (state.registerInfo.countryCode == "+33") {
          if (state.registerInfo.mobile.length != 9) {
            state.error.mobileError = "Format attendu : XXXXXXXXX"
            return state.formValid.mobileValid = false
          }
          state.error.mobileError = ""
          return state.formValid.mobileValid = true
        }
        else if (state.registerInfo.mobile.length < 8) {
          state.error.mobileError = "Le numéro doit contenir au moins 8 chiffre"
          return state.formValid.mobileValid = false
        }
        state.error.mobileError = ""
        return state.formValid.mobileValid = true
      }
    }
  }
})
