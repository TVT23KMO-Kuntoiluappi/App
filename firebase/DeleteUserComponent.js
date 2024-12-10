import { auth, deleteDoc, doc, deleteObject, ref, listAll, firestore, storage, collection, getDocs } from './Config'


export const deleteUserData = async (userId) => {
    try {
      // Lista alikokoelmista
      const subCollections = ['tallennetuttreenit', 'treenipohjat', 'omattiedot'];
  
      // Poista alikokoelmien dokumentit
      for (const subCollection of subCollections) {
        const subCollectionRef = collection(firestore, `users/${userId}/${subCollection}`);
        const subCollectionDocs = await getDocs(subCollectionRef);
  
        const deletePromises = subCollectionDocs.docs.map((docRef) =>
          deleteDoc(doc(firestore, `${subCollectionRef.path}/${docRef.id}`))
        );
  
        await Promise.all(deletePromises);
        console.log(`Kaikki dokumentit poistettu alikokoelmasta: ${subCollection}`);
      }
  
      // Poista päädokumentti käyttäjän kokoelmasta
      const userDocRef = doc(firestore, `users/${userId}`);
      await deleteDoc(userDocRef);
  
      console.log('Kaikki käyttäjän tiedot poistettu Firestoresta.');
    } catch (error) {
      console.error('Virhe käyttäjän tietojen poistossa:', error);
      throw error;
    }
  };

export const deleteUserStorageData = async (userId) => {
    try {
        // Luodaan käyttäjän kansioiden polut
        const userFolders = [`users/${userId}/profile`, `users/${userId}/images`];

        // Poistetaan tiedostot kaikista kansioista
        await Promise.all(
            userFolders.map(async (folderPath) => {
                const folderRef = ref(storage, folderPath);
                const files = await listAll(folderRef);
                await Promise.all(files.items.map((fileRef) => deleteObject(fileRef)));
                console.log(`Tiedostot poistettu kansiosta: ${folderPath}`);
            })
        );

        console.log(`Kaikki tiedostot käyttäjän ${userId} kansioista poistettu.`);
    } catch (error) {
        console.error("Virhe tiedostojen poistossa Firebase Storagesta:", error);
        throw error;
    }
};

const deleteUser = async (userId) => {
    await deleteUserData(userId)
    await deleteUserStorageData(userId)
    try {
        // Poista käyttäjä Firebase Authenticationista
        const user = auth.currentUser;
        await user.delete();
        console.log("Käyttäjä poistettu Authenticationista");
    } catch (error) {
        console.error("Virhe käyttäjän poistamisessa: ", error);
    }
};

export { deleteUser }
