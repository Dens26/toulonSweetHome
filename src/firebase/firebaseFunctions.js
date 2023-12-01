import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "@firebase/auth"
import { doc, setDoc } from "@firebase/firestore"
import { db } from "@/firebase/index.js"

/**
 * 
 * @returns 
 */
export function firebase_logOutUser() {
    return new Promise((resolve, reject) => {
        const auth = getAuth()
        signOut(auth)
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

/**
 * 
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
export function firebase_loginUser(email, password) {
    return new Promise((resolve, reject) => {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                resolve(true)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
/**
 * 
 * @param {*} registerInfo 
 * @returns 
 */
export function firebase_createUser(registerInfo) {
    return new Promise(async (resolve, reject) => {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, registerInfo.email, registerInfo.password)          
            const response = await createUserAccount(userCredential.user.uid, registerInfo.firstName, registerInfo.lastName, registerInfo.birthday)
            
            if (!response.success)
                reject(response.message)

            resolve(userCredential.user)
        }
        catch (error) {
            reject(error)
        }
    });
}

/**
 * @param {*} uid
 * @param {*} firstName
 * @param {*} lastName
 * @param {*} birthday
 */
async function createUserAccount(uid, firstName, lastName, birthday) {
    try {
        await setDoc(doc(db, "users", uid), {
            firstName: firstName,
            lastName: lastName,
            birthday: birthday
        });
        return { success: true, message: "Compte utilisateur créé avec succès." };
    } catch (error) {
        return { success: false, message: "Erreur lors de la création du compte utilisateur" + error };
    }
}
