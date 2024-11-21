import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Image } from 'expo-image'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme, FAB, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'
import { uploadUserPicture, getUserPicture } from '../firebase/Config';
import { auth, storage } from '../firebase/Config';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';


export default function UserSettings() {
  const { colors, spacing } = useTheme()
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [edit, setEdit] = useState(false)
  const [cameraOrLoad, setCameraOrLoad] = useState(true)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([]);
  const [profilePic, setProfilePic] = useState(null)
  const [fnameEditable, setFnameEditable] = useState(false);
  const [lnameEditable, setLnameEditable] = useState(false);
  const [usernameEditable, setUsernameEditable] = useState(false)
  const [emailEditable, setEmailEditable] = useState(false)
  const [weightEditable, setWeightEditable] = useState(false)
  const [heightEditable, setHeightEditable] = useState(false)
  const [oneRepMax, setOneRepMax] = useState([])
  const [showRep, setShowRep] = useState(false)
  const [liike, setLiike] = useState("")
  const [massa, setMassa] = useState("")

  const fetchProfilePicture = async () => {
    try {
      const profPic = await getUserPicture();
      setProfilePic(profPic);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }

  useEffect(() => {
    fetchProfilePicture()
  }, [])

  const handlePickImage = async () => {
    setLoading(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 16],
        quality: 1,
      })

      if (!result.canceled) {
        const uri = result.assets[0].uri
        await uploadUserPicture(uri)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setLoading(false)
    }
    fetchProfilePicture()
  }

  const handleTakePhoto = async () => {
    setLoading(true)
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync()
      if (!permission.granted) {
        throw new Error('Tarvitsemme kameran käyttöoikeuden ottaaksesi kuvia')
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 16],
        quality: 1,
      })

      if (!result.canceled) {
        const uri = result.assets[0].uri
        await uploadUserPicture(uri)
      }
    } catch (error) {
      console.error('Camera capture failed:', error)
    } finally {
      setLoading(false)
    }
    fetchProfilePicture()
  }

  const addMaxRep = () => {
    const maxRepJSON = {
      move: liike,
      mass: massa
    }
    setOneRepMax((prevMax) => [...prevMax, maxRepJSON])
    setLiike("")
    setMassa("")
    console.log(oneRepMax)
  }

  return (
    <SafeAreaView style={styles({ colors, spacing }).container}>
      <ScrollView contentContainerStyle={styles({ colors, spacing }).containerScroll}>
        <View style={styles({ colors, spacing }).changeProfpic}>
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require('./images/default-profpic.png')
            }
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />

          {cameraOrLoad ? <TouchableOpacity style={styles({ colors, spacing }).button} onPress={() => setCameraOrLoad(!cameraOrLoad)}>
            <Text>Vaihda profiilikuva</Text>
          </TouchableOpacity> :
            <>
              <View style={styles({ colors, spacing }).fabContainer}>
                <FAB
                  icon="camera"
                  style={styles({ colors, spacing }).fab}
                  onPress={() => { setCameraOrLoad(!cameraOrLoad); handleTakePhoto() }}
                  theme={{ colors: { primary: colors.primary } }}
                />
                <FAB
                  icon="image-plus"
                  style={styles({ colors, spacing }).fab}
                  onPress={() => { setCameraOrLoad(!cameraOrLoad); handlePickImage() }}
                  theme={{ colors: { primary: colors.primary } }}
                />
              </View>
            </>
          }
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
                <Text style={styles({ colors, spacing }).label}>Muokkaa etunimeä</Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setFname(text)}
                  value={fname}
                  onBlur={() => setFnameEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles({ colors, spacing }).text} onPress={() => setFnameEditable(true)}>
                <Text style={styles({ colors, spacing }).label}>Etunimi</Text>
                <Text style={{ textAlign: "center" }}>{fname || "etunimi"}</Text>
              </TouchableOpacity>
            )}
            {lnameEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>Muokkaa sukunimeä</Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setLname(text)}
                  value={lname}
                  onBlur={() => setLnameEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles({ colors, spacing }).text} onPress={() => setLnameEditable(true)}>
                <Text style={styles({ colors, spacing }).label}>Sukunimi</Text>
                <Text style={{ textAlign: "center" }}>{lname || "sukunimi"}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles({ colors, spacing }).info}>
            {usernameEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>Muokkaa käyttäjätunnusta</Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setUsername(text)}
                  value={username}
                  onBlur={() => setUsernameEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles({ colors, spacing }).text} onPress={() => setUsernameEditable(true)}>
                <Text style={styles({ colors, spacing }).label}>Käyttäjätunnus</Text>
                <Text style={{ textAlign: "center" }}>{username || "Käyttäjätunnus"}</Text>
              </TouchableOpacity>
            )}
            {emailEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>Muokkaa sähköpostia</Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  onBlur={() => setEmailEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles({ colors, spacing }).text} onPress={() => setEmailEditable(true)}>
                <Text style={styles({ colors, spacing }).label}>Sähköposti</Text>
                <Text style={{ textAlign: "center" }}>{email || "Sähköposti"}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles({ colors, spacing }).info}>
            {weightEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>Muokkaa painoa</Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setWeight(text)}
                  value={weight}
                  onBlur={() => setWeightEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles({ colors, spacing }).text} onPress={() => setWeightEditable(true)}>
                <Text style={styles({ colors, spacing }).label}>Paino</Text>
                <Text style={{ textAlign: "center" }}>{weight || "100 kg"}</Text>
              </TouchableOpacity>
            )}
            {heightEditable ? (
              <View style={styles({ colors, spacing }).inputContainer}>
                <Text style={styles({ colors, spacing }).label}>Muokkaa pituutta</Text>
                <TextInput
                  style={styles({ colors, spacing }).textInput}
                  maxLength={40}
                  onChangeText={(text) => setHeight(text)}
                  value={height}
                  onBlur={() => setHeightEditable(false)}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles({ colors, spacing }).text} onPress={() => setHeightEditable(true)}>
                <Text style={styles({ colors, spacing }).label}>Pituus</Text>
                <Text style={{ textAlign: "center" }}>{height || "180 cm"}</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles({ colors, spacing }).addOneRepMax}>
          <View style={styles({ colors, spacing }).oneRepMaxHeadline}>
            <Text>Lisää "One rep Max"</Text>
            <TouchableOpacity>
              <Icon name='help-circle' size={24} />
            </TouchableOpacity>
          </View>
          {oneRepMax.length > 0 &&
            oneRepMax.map((item, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                <Text>{item.move}</Text>
                <TouchableOpacity>
                  <Text>{item.mass} kg</Text>
                </TouchableOpacity>
              </View>
            ))}

          {showRep &&
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-around", margin: 8 }}>
              <TextInput
                placeholder='lisää liike'
                style={[styles({ colors, spacing }).textInput, { backgroundColor: '#ffffff', width: '45%', borderRadius: spacing.medium, borderColor: "black", borderWidth: 2 }]}
                maxLength={40}
                onChangeText={(text) => setLiike(text)}
                value={liike}
              />
              <TextInput
                placeholder='liikkeen massa'
                style={[styles({ colors, spacing }).textInput, { backgroundColor: '#ffffff', width: '45%', borderRadius: spacing.medium, borderColor: "black", borderWidth: 2 }]}
                maxLength={40}
                onChangeText={(text) => setMassa(text)}
                value={massa}
              />
            </View>}
          <View style={styles({ colors, spacing }).oneRepMaxHeadline}>
            <TouchableOpacity onPress={() => setShowRep(!showRep)} onLongPress={() => addMaxRep()}>
              {!showRep ? <Icon name='plus' size={24} /> : <Icon name='plus' size={40} />}
            </TouchableOpacity>
            <Text>Lisää liike</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ({ colors, spacing }) => StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "flex-start"
  },
  containerScroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  presonalSettings: {
    alignItems: 'center',
  },
  profpic: {
    borderRadius: 50
  },
  changeProfpic: {
    width: '100%',
    alignItems: 'center',
    justifyContent: "space-evenly",
    marginBottom: 20,
    flexDirection: 'row',
    margin: 16
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editProfile: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%'
  },
  editLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-around"
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-around"
  },
  inputContainer: {
    position: "relative",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    margin: 5,
    width: '45%',
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
    width: '100%',
  },
  name: {
    marginBottom: 20,
  },
  heightWeight: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#B8A90B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    margin: 7,
    width: '50%'
  },
  addOneRepMax: {
    borderRadius: 8,
    width: "90%",
    backgroundColor: '#EFF5D5',
    margin: 5,
    padding: 5,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
  },
  oneRepMaxHeadline: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 8
  },
  fabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.medium,
    paddingVertical: spacing.medium,
    width: "50%",
    margin: 7,
  },
  fab: {
    elevation: 2,
  }
});
