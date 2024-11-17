import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
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

  const fetchProfilePicture = async () => {
    try {
      const profPic = await getUserPicture();
      setProfilePic(profPic);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, []);

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

  return (
    <SafeAreaView style={styles({ colors, spacing }).container}>
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
      <TouchableOpacity style={styles({ colors, spacing }).button} onPress={() => setEdit(!edit)}>
        <Text style={styles({ colors, spacing }).buttonText}>{edit ? "Näytä tiedot" : "Muokkaa tietoja"}</Text>
      </TouchableOpacity>
      {edit ? <View style={styles({ colors, spacing }).editProfile}>
        <View style={styles({ colors, spacing }).editLine}>
          <TextInput
            style={styles({ colors, spacing }).textInput}
            maxLength={40}
            onChangeText={(text) => setFname(text)}
            value={fname}
            placeholder="etunimi"
          />
          <TextInput
            style={styles({ colors, spacing }).textInput}
            maxLength={40}
            onChangeText={(text) => setLname(text)}
            value={lname}
            placeholder="sukunimi"
          />
        </View>
        <View style={styles({ colors, spacing }).editLine}>
          <TextInput
            style={styles({ colors, spacing }).textInput}
            maxLength={40}
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="käyttäjätunnus"
          />
          <TextInput
            style={styles({ colors, spacing }).textInput}
            maxLength={40}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="sähköposti"
          />
        </View>
        <View style={styles({ colors, spacing }).editLine}>
          <TextInput
            style={styles({ colors, spacing }).textInput}
            maxLength={40}
            onChangeText={(text) => setWeight(text)}
            value={weight}
            placeholder="paino"
          />
          <TextInput
            style={styles({ colors, spacing }).textInput}
            maxLength={40}
            onChangeText={(text) => setHeight(text)}
            value={height}
            placeholder="pituus"
          />
        </View>
        <TouchableOpacity style={styles({ colors, spacing }).button}>
          <Text style={styles({ colors, spacing }).buttonText}>Tallenna</Text>
        </TouchableOpacity>
      </View> :
        <View style={styles({ colors, spacing }).profileInfo}>
          <Text>Nimi: etunimi sukunimi</Text>
          <Text>Käyttäjätunnus: defaultusername</Text>
          <Text>sähköposti: testi@testi</Text>
          <Text>paino: 100 kg pituus: 180 cm</Text>
        </View>}
      <View style={styles({ colors, spacing }).addOneRepMax}>
        <View style={styles({ colors, spacing }).oneRepMaxHeadline}>
          <Text>Lisää "One rep Max"</Text>
          <TouchableOpacity>
            <Icon name='help-circle' size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles({ colors, spacing }).oneRepMaxHeadline}>
          <TouchableOpacity>
            <Icon name='plus' size={24} />
          </TouchableOpacity>
          <Text>Lisää liike</Text>
        </View>

      </View>

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
    justifyContent: 'center'
  },
  editLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-around"
  },
  textInput: {
    backgroundColor: '#ffffff',
    margin: 5,
    padding: 5,
    borderColor: 'black',
    width: '45%',
    borderWidth: 2,
    borderRadius: 20,
    height: 55
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
