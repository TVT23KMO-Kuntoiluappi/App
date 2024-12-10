import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '../context/UseUser';
import { useTheme } from 'react-native-paper';
import WorkOutDataModal from './WorkOutDataModal';
import SwiperFlatList, { SwiperFlatlist } from 'react-native-swiper-flatlist'
import { auth, setDoc, getDoc, updateDoc, collection, firestore, doc, deleteDoc } from "../firebase/Config";
import { FontAwesome } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "@expo/vector-icons/Ionicons";

export default function WorkOutData() {
    const { colors, spacing } = useTheme();
    const { workOutFirebaseData, oneRepMax, setUpdateContent } = useUser();
    const [modalVisible, setModalVisible] = useState(false)
    const [index, setIndex] = useState(0)
    const [biggerFavourite, setBiggerFavourite] = useState(false)
    const [componentHeight, setComponentHeight] = useState(150)

    function formatTimestamp(timestamp) {
        const [year, month, day, hours, minutes, seconds] = timestamp.split(":");
        return `${day}.${month}.${year} klo ${hours}.${minutes}`
    }

    const toggleBox = (move) => {
        if (!biggerFavourite) {
            const numOfWorkout = workOutDataReverse[move].movements.length
            const compHeight = numOfWorkout * 40 + 220
            setComponentHeight(compHeight)
            console.log(numOfWorkout, "   ", compHeight)
        } else {
            setComponentHeight(150)
        }
        setBiggerFavourite(!biggerFavourite)
        setIndex(move)
    };

    const workOutDataReverse = [...workOutFirebaseData].reverse()

    // FIREBASEEN LISÄYS
    async function addWorkout(userId, workoutDetails, workoutName) {
        if (!workoutName) {
            console.error("Cannot add workout, workoutName is empty!")
            return;
        }

        const userDetailsRef = doc(collection(firestore, `users/${userId}/treenipohjat`), workoutName);
        try {
            const workoutData = {
                movements: workoutDetails,
                workoutName: workoutName
            }

            await setDoc(userDetailsRef, workoutData);
            console.log("Treeni lisätty onnistuneesti!");
        } catch (error) {
            console.error("Virhe treenin lisäämisessä:", error);
        }
    }

    const addWorkoutToFirebase = async (workout, name) => {
        const workoutName = name
        console.log("ADDDD")
        if (name) {
            try {
                const userId = auth.currentUser.uid
                await addWorkout(userId, workout, workoutName);
                Alert.alert(
                    "Tallennus onnistui!",
                    "Hienoa!",
                    [{ text: "OK" }]
                );
            } catch (error) {
                console.log("Virhe tietojen lisäämisessä Firestoreen:", error);
                throw new Error("Tietojen lisääminen epäonnistui.");
            }
        } else {
            Alert.alert(
                "Nimi puuttuu!",
                "Voit lisätä suosikkitreeneihin vain nimellisiä treenejä!",
                [{ text: "OK" }]
            );
        }
        setUpdateContent(prevData => (prevData + 1))
    }

    const deleteWorkOut = async (index) => {
        const reverseIndex = workOutDataReverse.length - index - 1;
        const workoutDataToDelete = workOutFirebaseData[reverseIndex];
        const userId = auth.currentUser.uid;

        // Näytä varmistus-alert
        Alert.alert(
            "Vahvistus", // Otsikko
            `Haluatko varmasti poistaa treenin: ${workoutDataToDelete.workoutName} ${formatTimestamp(workoutDataToDelete.workoutId)} ?`, // Viesti
            [
                {
                    text: "Peruuta",
                    style: "cancel",
                },
                {
                    text: "Poista",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const workoutDocRef = doc(
                                firestore,
                                `users/${userId}/tallennetuttreenit/${workoutDataToDelete.workoutId}`
                            );

                            await deleteDoc(workoutDocRef);
                            console.log(`Workout ${workoutDataToDelete.workoutId} poistettu onnistuneesti.`);
                            setUpdateContent((prevData) => prevData + 1);
                        } catch (error) {
                            console.error("Virhe treenin poistossa:", error);
                        }
                    },
                },
            ]
        );
    };



    return (
        <>
            <View style={styles({ colors, spacing }).headLine}>
                <Icon
                    name={"dumbbell"}
                    size={32}
                    color={colors.text}
                />
                <Text style={{ marginBottom: spacing.small, fontSize: 24, color: colors.text }}>Tehdyt treenit</Text>
            </View>
            <View style={{ height: componentHeight, width: Dimensions.get('window').width }}>
                <SwiperFlatList
                    index={0}
                    autoplay={false}
                    scrollEnabled={!biggerFavourite}
                    data={workOutDataReverse}
                    renderItem={({ item, index }) => (
                        <View key={index} style={[styles({ colors, spacing }).workoutBox, { justifyContent: biggerFavourite ? 'space-between' : 'center' }]}>
                            <View style={styles({ colors, spacing }).workOutDetails}>
                                {/* Chevron Left */}
                                {index > 0 && !biggerFavourite &&
                                <View style={styles({ colors, spacing }).arrowLeft}>
                                    <TouchableOpacity>
                                        <FontAwesome name={"chevron-left"} size={26} color={"#555"} />
                                    </TouchableOpacity>
                                </View> }

                                {/* Center Content */}
                                <View style={styles({ colors, spacing }).centerContent}>
                                    <View style={styles({ colors, spacing }).textContainer}>
                                        <Text style={styles({ colors, spacing }).workoutBoxMainText}>
                                            {item.workoutName ? item.workoutName : "Treeni pvm:"}
                                        </Text>
                                        <Text style={styles({ colors, spacing }).workoutBoxMainTextDate}>
                                            {formatTimestamp(item.workoutId)}
                                        </Text>
                                    </View>
                                    <View style={styles({ colors, spacing }).iconContainer}>
                                        <TouchableOpacity onPress={() => toggleBox(index)}>
                                            <FontAwesome
                                                name={biggerFavourite ? "chevron-up" : "chevron-down"}
                                                size={36}
                                                color={"#555"}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => addWorkoutToFirebase(item.movements, item.workoutName)}>
                                            <Icon name={"heart-outline"} size={32} color={colors.text} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                                
                                {/* Chevron Right */}
                                {index < workOutDataReverse.length-1 && !biggerFavourite &&
                                <View style={styles({ colors, spacing }).arrowRight}>
                                    <TouchableOpacity>
                                        <FontAwesome name={"chevron-right"} size={26} color={"#555"} />
                                    </TouchableOpacity>
                                </View> }
                            </View>


                            {biggerFavourite && (
                                <View style={styles({ colors, spacing }).workoutContent}>
                                    {item.movements.map((movement, idx) => (
                                        <Text
                                            style={styles({ colors, spacing }).workoutContentText}
                                            key={idx}
                                        >
                                            {movement.movementName}: {movement.sets.length} x {movement.sets[0].reps}
                                        </Text>
                                    ))}
                                    <View style={styles({ colors, spacing }).infoOrDelete}>
                                        <TouchableOpacity
                                            style={[styles({ colors, spacing }).button, { positinon: "absolute", rigth: "50%", transform: [{ translateX: -50 }] }]}
                                            onPress={() => setModalVisible(true)}
                                        >
                                            <Text style={{ color: colors.buttonText }}>tarkemmat tiedot</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => deleteWorkOut(index)}>
                                            <Ionicons
                                                name={"trash"}
                                                size={32}
                                                color={colors.text}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}


                        </View>
                    )}
                />
                {workOutDataReverse &&
                    <WorkOutDataModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        workOutDataReverse={workOutDataReverse}
                        index={index}
                        formatTimestamp={formatTimestamp}
                    />}
            </View>
        </>
    )
}

const styles = ({ colors, spacing }) =>
    StyleSheet.create({
        headLine: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            marginTop: Platform.OS === 'anrdoid' ? spacing.medium : spacing.large,
            marginLeft: spacing.medium
        },
        text: {
            width: "85%",
            color: colors.text
        },
        workoutBox: {
            width: Dimensions.get('window').width - 40,
            borderRadius: spacing.small,
            backgroundColor: colors.card,
            alignItems: "center",
            paddingBottom: spacing.small,
            marginLeft: 20,
            marginRight: 20
        },
        workOutDetails: {
            position: "relative",
            width: "100%",
            height: 150,
            flexDirection: "row", // Järjestä lapset vaakasuoraan
            alignItems: "center",
            justifyContent: "center", // Tilaa tasaisesti reunojen väliin
          },
          
          arrowLeft: {
            position: "absolute",
            left: -20,
            top: "50%",
            transform: [{ translateY: -13 }], // Keskittää pystysuunnassa
          },
          
          arrowRight: {
            position: "absolute",
            right: -20,
            top: "50%",
            transform: [{ translateY: -13 }], // Keskittää pystysuunnassa
          },
          
          centerContent: {
            width: "80%",
            flexDirection: "row", // Teksti ja ikonit vierekkäin
            alignItems: "center", // Keskittää pystysuunnassa
            justifyContent: "space-between", // Keskittää vaakasuunnassa
          },
          
          textContainer: {
            flexDirection: "column", // Järjestää tekstin päällekkäin
            marginRight: 20, // Etäisyys ikoneista
            alignItems: "flex-start", // Teksti vasemmalle
          },
          
          iconContainer: {
            flexDirection: "row", // Ikonit vierekkäin
            alignItems: "center",
            justifyContent: "flex-start", // Pidä ikonit kiinni tekstissä
            gap: 10, // Etäisyys ikonien välillä
          },
          
          workoutBoxMainText: {
            fontSize: 18,
            fontWeight: "bold",
            color: colors.text,
          },
          
          workoutBoxMainTextDate: {
            fontSize: 14,
            color: colors.text,
          },          

        workoutBoxMainText: {
            fontSize: spacing.large,
            color: colors.text
        },
        workoutBoxMainTextDate: {
            fontSize: spacing.medium,
            color: colors.text
        },
        workoutSave: {
            flexDirection: "row",
        },
        workoutContent: {
            width: "100%",
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 40,
            alignItems: "center"
        },
        button: {
            width: "50%",
            height: 40,
            backgroundColor: colors.button,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: spacing.small,
            marginTop: spacing.small,
            borderWidth: 2,
            borderColor: colors.text,
        },
        workoutContentText: {
            fontSize: 20,
            fontWeight: "bold",
            paddingBottom: 2,
            marginTop: spacing.small,
            color: colors.text
        },
        infoOrDelete: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingLeft: 10,
            paddingRight: 10,
            alignItems: "center"
        },

    })