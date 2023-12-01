// References
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "@firebase/auth"
import { doc, setDoc, getDoc } from "@firebase/firestore"
import { db } from "@/firebase/index.js"

/**
 * Load User data function
 * @returns Return the user data or nothing
 */
export function firebase_loadUserData(uid) {
    return new Promise(async (resolve, reject) => {
        // Firestore function
        const docRef = doc(db, "users", uid);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // User data found
                resolve(docSnap.data());
            } else {
                // User data not found
                resolve(null);
            }
        } catch (error) {
            // Error found
            reject(error);
        }
    });
}

/**
 * Log-out user function
 * @returns Return true or error
 */
export function firebase_logOutUser() {
    return new Promise((resolve, reject) => {
        const auth = getAuth()
        // Auth function
        signOut(auth)
            .then(() => {
                // log out ok
                resolve(true);
            })
            .catch((error) => {
                // Error found
                reject(error);
            })
    })
}

/**
 * Log-in function
 * @param {*} email - user email.
 * @param {*} password - user password
 * @returns Return true or error
 */
export function firebase_loginUser(email, password) {
    return new Promise((resolve, reject) => {
        const auth = getAuth()
        // Auth function
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                // login ok
                resolve(true)
            })
            .catch((error) => {
                // Error found
                reject(error)
            })
    })
}
/**
 * Create user account and user data function
 * @param {*} registerInfo - JSON file with email,password,first name, last name and birthday information
 * @returns Return user Object, error message or error 
 */
export function firebase_createUser(registerInfo) {
    return new Promise(async (resolve, reject) => {
        const auth = getAuth();
        try {
            // Auth function to create a new user
            const userCredential = await createUserWithEmailAndPassword(auth, registerInfo.email, registerInfo.password)
            // intern function to create user data 
            const response = await createUserAccount(userCredential.user.uid, registerInfo.firstName, registerInfo.lastName, registerInfo.birthday)

            if (!response.success)
                // Error pending data user creation
                reject(response.message)
            // User created
            resolve(userCredential.user)
        }
        catch (error) {
            // Error found
            reject(error)
        }
    });
}

/**
 * Create user data intern function
 * @param {*} uid - user id
 * @param {*} firstName - user first-name
 * @param {*} lastName - user last-name
 * @param {*} birthday - user birthday
 * @returns Return success and message
 */
async function createUserAccount(uid, firstName, lastName, birthday) {
    try {
        // Firestore function
        await setDoc(doc(db, "users", uid), {
            firstName: firstName,
            lastName: lastName,
            birthday: birthday
        });
        // user data created
        return { success: true, message: "Compte utilisateur créé avec succès." };
    }
    catch (error) {
        // user data not created
        return { success: false, message: "Erreur lors de la création du compte utilisateur" + error };
    }
}
