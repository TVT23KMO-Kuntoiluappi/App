import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme, FAB, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import {
  uploadUserPicture,
  getUserPicture,
  getDoc,
  doc,
  firestore,
  updateDoc,
  updateProfile,
  updateEmail,
  setDoc,
  collection,
} from "../firebase/Config";
import { auth, storage } from "../firebase/Config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import OneRepMaxInfo from "../components/OneRepMaxInfo";
import { useUser } from "../context/UseUser";
import Loading from "../components/Loading";

export default function UserSettings() {
  const {
    fname,
    setFname,
    lname,
    setLname,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    weight,
    setWeight,
    height,
    setHeight,
    profilePic,
    setProfilePic,
    oneRepMax,
    setOneRepMax,
  } = useUser();

  const { colors, spacing } = useTheme();
  const [edit, setEdit] = useState(false);
  const [cameraOrLoad, setCameraOrLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [fnameEditable, setFnameEditable] = useState(false);
  const [lnameEditable, setLnameEditable] = useState(false);
  const [usernameEditable, setUsernameEditable] = useState(false);
  const [emailEditable, setEmailEditable] = useState(false);
  const [weightEditable, setWeightEditable] = useState(false);
  const [heightEditable, setHeightEditable] = useState(false);
  const [showRep, setShowRep] = useState(false);
  const [updateMaxList, setUpdateMaxList] = useState(false);
  const [liike, setLiike] = useState("");
  const [massa, setMassa] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (profilePic) {
      setProfilePic(profilePic);
    }
  }, []);

  const updateUserData = async (userDetails) => {
    const userId = auth.currentUser.uid;
    const docRef = doc(firestore, `users/${userId}/omattiedot/perustiedot`);
    try {
      await updateDoc(docRef, userDetails);
      console.log("Päivitys onnistui!");
      Alert.alert("Tietojen päivitys onnistui!", `Jatketaan`, [{ text: "OK" }]);
    } catch (error) {
      console.error("Virhe päivityksessä:", error);
      Alert.alert("Tietojen päivitys onnistui!", `Jatketaan`, [{ text: "OK" }]);
    }
  };

  const updateUserDetails = async (newDisplayName, newEmail) => {
    try {
      const user = auth.currentUser;

      if (user) {
        if (newDisplayName) {
          await updateProfile(user, {
            displayName: newDisplayName,
          });
          console.log("Username päivitetty myös auth:", newDisplayName);
        }

        if (newEmail) {
          await updateEmail(user, newEmail);
          console.log("Sähköposti päivitetty myös auth:", newEmail);
        }
      } else {
        console.log("Käyttäjää ei ole kirjautunut sisään.");
      }
    } catch (error) {
      console.log("Virhe päivitettäessä käyttäjätietoja:", error.message);
    }
  };

  const handlePickImage = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 16],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        await uploadUserPicture(uri);
        const newPic = await getUserPicture();
        setProfilePic(newPic);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    setLoading(true);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        throw new Error("Tarvitsemme kameran käyttöoikeuden ottaaksesi kuvia");
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 16],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        await uploadUserPicture(uri);
        const newPic = await getUserPicture();
        setProfilePic(newPic);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Camera capture failed:", error);
      setLoading(false);
    }
  };

  async function addUserDetails(userDetails) {
    const userDetailsRef = doc(
      collection(firestore, `users/${auth.currentUser.uid}/omattiedot`),
      "nostomaksimit"
    );
    try {
      await setDoc(userDetailsRef, userDetails);
      console.log("MAxRep lisäys onnistui");
      Alert.alert("Maksimitoistojen lisäys", `Tilastojen päivitys onnistui`, [
        { text: "OK" },
      ]);
    } catch (error) {
      console.error("Virhe tietojen lisäämisessä:", error);
      Alert.alert(
        "Maksimitoistojen lisäys",
        `Päivitys epäonnistui jostain syystä...`,
        [{ text: "OK" }]
      );
    }
  }

  const addMaxRep = () => {
    if (liike.length > 0 && massa.length > 0) {
      const maxRepJSON = {
        move: liike,
        mass: massa,
      };
      const updatedMax = [...oneRepMax, maxRepJSON];
      setOneRepMax(updatedMax);
      setLiike("");
      setMassa("");
      addUserDetails({ oneRepMaxList: updatedMax });
      console.log(updatedMax);
    } else {
      Alert.alert("HOX!", `Älä lisää tyhjiä tilastoja`, [{ text: "OK" }]);
    }
  };

  const changeKilos = (index, change) => {
    setUpdateMaxList(true);
    const tempList = [...oneRepMax];
    let tempMass = parseFloat(tempList[index].mass);

    if (change === "add") {
      tempMass += 1.25;
    } else if (change === "subtract") {
      tempMass -= 1.25;
    }

    tempList[index].mass = tempMass.toString();
    setOneRepMax(tempList);
  };

  const deleteMaxRep = (index) => {
    Alert.alert(
      "Vahvista poistaminen",
      "Haluatko varmasti poistaa tämän maksimin?",
      [
        {
          text: "Peruuta",
          onPress: () => console.log("Poistaminen peruttu"),
          style: "cancel",
        },
        {
          text: "Poista",
          onPress: () => {
            setUpdateMaxList(true);
            const tempList = [...oneRepMax];
            tempList.splice(index, 1);
            setOneRepMax(tempList);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const maxRepUpdate = () => {
    addUserDetails({ oneRepMaxList: oneRepMax });
    setUpdateMaxList(false);
  };

  const userUpdate = () => {
    try {
      updateUserData({
        firstName: fname,
        lastName: lname,
        username: username,
        height: height,
        weight: weight,
      });
      updateUserDetails(username, email);
    } catch (error) {
      console.log("Virhe tietojen lisäämisessä Firestoreen:", error);
      throw new Error("Tietojen lisääminen epäonnistui.");
    }
  };

  return (
    <SafeAreaView style={styles({ colors, spacing }).container}>
      <ScrollView
        contentContainerStyle={styles({ colors, spacing }).containerScroll}
      >
        <View style={styles({ colors, spacing }).changeProfpic}>
          <View style={{ position: "relative" }}>
            <Image
              source={
                profilePic
                  ? { uri: profilePic }
                  : require("./images/default-profpic.png")
              }
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            {loading && <Loading />}
          </View>

          {cameraOrLoad ? (
            <TouchableOpacity
              style={styles({ colors, spacing }).button}
              onPress={() => setCameraOrLoad(!cameraOrLoad)}
            >
              <Text>Vaihda profiilikuva</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles({ colors, spacing }).fabContainer}>
                <FAB
                  icon="camera"
                  style={styles({ colors, spacing }).fab}
                  onPress={() => {
                    setCameraOrLoad(!cameraOrLoad);
                    handleTakePhoto();
                  }}
                  theme={{ colors: { primary: colors.primary } }}
                />
                <FAB
                  icon="image-plus"
                  style={styles({ colors, spacing }).fab}
                  onPress={() => {
                    setCameraOrLoad(!cameraOrLoad);
                    handlePickImage();
                  }}
                  theme={{ colors: { primary: colors.primary } }}
                />
              </View>
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles({ colors, spacing }).editProfile}
          onLongPress={() => {
            setFnameEditable(false);
            setLnameEditable(false);
            setUsernameEditable(false);
            setEmailEditable(false);
            setWeightEditable(false);
            setHeightEditable(false);
          }}
        >
          <View style={styles({ colors, spacing }).info}>
            {fnameEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>
                  Muokkaa etunimeä
                </Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setFname(text)}
                  value={fname}
                  onBlur={() => setFnameEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles({ colors, spacing }).text}
                onPress={() => setFnameEditable(true)}
              >
                <Text style={styles({ colors, spacing }).label}>Etunimi</Text>
                <Text style={{ textAlign: "center" }}>
                  {fname || "etunimi"}
                </Text>
              </TouchableOpacity>
            )}
            {lnameEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>
                  Muokkaa sukunimeä
                </Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setLname(text)}
                  value={lname}
                  onBlur={() => setLnameEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles({ colors, spacing }).text}
                onPress={() => setLnameEditable(true)}
              >
                <Text style={styles({ colors, spacing }).label}>Sukunimi</Text>
                <Text style={{ textAlign: "center" }}>
                  {lname || "sukunimi"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles({ colors, spacing }).info}>
            {usernameEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>
                  Muokkaa käyttäjätunnusta
                </Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setUsername(text)}
                  value={username}
                  onBlur={() => setUsernameEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles({ colors, spacing }).text}
                onPress={() => setUsernameEditable(true)}
              >
                <Text style={styles({ colors, spacing }).label}>
                  Käyttäjätunnus
                </Text>
                <Text style={{ textAlign: "center" }}>
                  {username || "Käyttäjätunnus"}
                </Text>
              </TouchableOpacity>
            )}
            {emailEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>
                  Muokkaa sähköpostia
                </Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  onBlur={() => setEmailEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles({ colors, spacing }).text}
                onPress={() => setEmailEditable(true)}
              >
                <Text style={styles({ colors, spacing }).label}>
                  Sähköposti
                </Text>
                <Text style={{ textAlign: "center" }}>
                  {email || "Sähköposti"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles({ colors, spacing }).info}>
            {weightEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>
                  Muokkaa painoa
                </Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setWeight(text)}
                  value={weight}
                  onBlur={() => setWeightEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles({ colors, spacing }).text}
                onPress={() => setWeightEditable(true)}
              >
                <Text style={styles({ colors, spacing }).label}>Paino</Text>
                <Text style={{ textAlign: "center" }}>
                  {weight || "100 kg"}
                </Text>
              </TouchableOpacity>
            )}
            {heightEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>
                  Muokkaa pituutta
                </Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setHeight(text)}
                  value={height}
                  onBlur={() => setHeightEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles({ colors, spacing }).text}
                onPress={() => setHeightEditable(true)}
              >
                <Text style={styles({ colors, spacing }).label}>Pituus</Text>
                <Text style={{ textAlign: "center" }}>
                  {height || "180 cm"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
        {(fnameEditable ||
          lnameEditable ||
          emailEditable ||
          usernameEditable ||
          weightEditable ||
          heightEditable) && (
          <TouchableOpacity
            style={styles({ colors, spacing }).button}
            onPress={() => userUpdate()}
          >
            <Text>Päivitä tiedot</Text>
          </TouchableOpacity>
        )}
        <View style={styles({ colors, spacing }).addOneRepMax}>
          <View style={styles({ colors, spacing }).oneRepMaxHeadline}>
            <Text>Lisää "One rep Max"</Text>
            <TouchableOpacity>
              <Icon
                name="help-circle"
                size={24}
                onPress={() => setModalVisible(true)}
              />
            </TouchableOpacity>
          </View>
          {oneRepMax.length > 0 &&
            oneRepMax.map((item, index) => (
              <View key={index} style={styles({ colors, spacing }).oneRepMaxs}>
                <TouchableOpacity onPress={() => deleteMaxRep(index)}>
                  <Ionicons name="trash" size={24} />
                </TouchableOpacity>
                <Text>{item.move}</Text>
                <View style = {{flexDirection: "row", width: "50%", justifyContent: "space-between"}}>
                <TouchableOpacity
                  onPress={() => changeKilos(index, "subtract")}
                >
                  <Icon name="minus" size={24} />
                </TouchableOpacity>
                <Text>{item.mass} kg</Text>
                <TouchableOpacity onPress={() => changeKilos(index, "add")}>
                  <Icon name="plus" size={24} />
                </TouchableOpacity>
                </View>
              </View>
            ))}

          {showRep && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                margin: 8,
                wifth: "100%",
              }}
            >
              <TextInput
                placeholder="lisää liike"
                style={[styles({ colors, spacing }).oneRepMaxInputs]}
                maxLength={40}
                onChangeText={(text) => setLiike(text)}
                value={liike}
              />
              <TextInput
                placeholder="liikkeen massa"
                style={[styles({ colors, spacing }).oneRepMaxInputs]}
                maxLength={40}
                onChangeText={(text) => setMassa(text)}
                value={massa}
              />
            </View>
          )}
          <View style={styles({ colors, spacing }).oneRepMaxHeadline}>
            <TouchableOpacity onLongPress={() => addMaxRep()}>
              {!showRep ? (
                <FAB
                  style={styles({ spacing }).addNewSet}
                  icon="plus"
                  size="small"
                  onPress={() => setShowRep(!showRep)}
                />
              ) : (
                <FAB
                  style={styles({ spacing }).addNewSet}
                  icon="minus"
                  size="small"
                  onPress={() => setShowRep(!showRep)}
                />
              )}
            </TouchableOpacity>
            {showRep && <TouchableOpacity
              style={[
                styles({ colors, spacing }).button,
                { padding: 8, width: "33%" },
              ]}
              onPress={() => addMaxRep()}
            > 
              <Text>Lisää liike</Text>
            </TouchableOpacity>}
            {updateMaxList && (
              <TouchableOpacity
                style={[
                  styles({ colors, spacing }).button,
                  { padding: 8, width: "33%", backgroundColor: "red" },
                ]}
                onPress={() => maxRepUpdate()}
              >
                <Text>Päivitä</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      <OneRepMaxInfo
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
}

const styles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    containerScroll: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    presonalSettings: {
      alignItems: "center",
    },
    profpic: {
      borderRadius: 50,
    },
    changeProfpic: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      marginBottom: 20,
      flexDirection: "row",
      marginTop: 20,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    editProfile: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    editLine: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
    info: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
    inputContainer: {
      position: "relative",
      borderWidth: 2,
      borderColor: "black",
      borderRadius: 20,
      margin: 5,
      width: "45%",
    },
    label: {
      position: "absolute",
      top: -7,
      left: 20,
      backgroundColor: "#ffffff",
      paddingHorizontal: 5,
      fontSize: 10,
      color: "#888",
    },
    textInput: {
      height: 50,
      fontSize: 16,
      padding: 5,
      textAlign: "center",
      color: "black",
    },
    text: {
      alignItems: "center",
      justifyContent: "center",
      margin: 5,
      padding: 5,
      borderWidth: 2,
      borderColor: "black",
      borderRadius: 20,
      width: "45%",
      height: 50,
    },
    profileDetails: {
      width: "100%",
    },
    name: {
      marginBottom: 20,
    },
    heightWeight: {
      marginBottom: 10,
    },
    button: {
      backgroundColor: colors?.card || "black",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      borderColor: "black",
      borderWidth: 2,
      borderRadius: spacing.small,
      margin: 7,
      width: "50%",
    },
    addOneRepMax: {
      borderRadius: 8,
      width: "95%",
      backgroundColor: "#EFF5D5",
      margin: 5,
      padding: 5,
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    oneRepMaxHeadline: {
      flexDirection: "row",
      width: "90%",
      justifyContent: "space-evenly",
      alignItems: "center",
      margin: 8,
    },
    fabContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing.medium,
      paddingVertical: spacing.medium,
      width: "50%",
      margin: 7,
    },
    fab: {
      elevation: 2,
    },
    oneRepMaxs: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: "black",
      padding: 8,
      width: "90%",
    },
    oneRepMaxInputs: {
      height: 50,
      fontSize: 16,
      padding: 8,
      textAlign: "center",
      color: "black",
      backgroundColor: "#ffffff",
      width: "45%",
      borderRadius: spacing.medium,
      borderColor: "black",
      borderWidth: 2,
    },
    addNewSet: {
      height: 25,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.small,
      borderColor: "black",
      backgroundColor: "#B8A90B",
      borderWidth: 1,
      borderRadius: 0,
    },
  });
