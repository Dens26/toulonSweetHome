import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', {
  state: () => ({
    // Connection status
    connectionStatus: false,

    // User Informations
    userAccount: {
      uid: "",
      firstName: "",
      lastName: "",
      birthday: ""
    },

    // Page status
    showMenu: false,
    showSignUp: false,
    showSignIn: false,

    // Register informations
    registerInfo: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      birthday: "",
    },

    // Properties status
    formValid: {
      emailValid: false,
      passwordValid: false,
      firstNameValid: false,
      lastNameValid: false,
      birthdayValid: false
    },

    // Error management
    error: {
      emailError: "",
      confirmEmailError: "",
      passwordLengthError: "",
      passwordSpecialCharacterError: "",
      passwordLowerCaseError: "",
      passwordUpperCaseError: "",
      passwordDigitError: "",
      confirmPasswordError: "",

      firstNameError: "",
      lastNameError: "",
      birthdayError: "",

      registerError: ""
    }
  }),
  actions: {
    // Clear all register and error datas
    clearAllInfo() {
      for (let key in this.registerInfo)
        this.registerInfo[key] = ""
      for (let key in this.error)
        this.error[key] = ""
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
    HideAllMenu(){
      this.showSignIn = false
      this.showMenu = false
      this.showSignUp = false
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
    }
  }
})
