import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '../context/UseUser';
import { useTheme } from 'react-native-paper';
import WorkOutDataModal from './WorkOutDataModal';
import SwiperFlatList, { SwiperFlatlist } from 'react-native-swiper-flatlist'
import { auth, setDoc, getDoc, updateDoc, collection, firestore, doc } from "../firebase/Config";
import { FontAwesome } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

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
                                <View style={styles({ colors, spacing }).workoutName}>
                                    <Text style={styles({ colors, spacing }).workoutBoxMainText}>
                                        {item.workoutName ? item.workoutName : "Treeni pvm:"}
                                    </Text>
                                    <Text style={styles({ colors, spacing }).workoutBoxMainTextDate}>
                                        {formatTimestamp(item.workoutId)}
                                    </Text>
                                </View>
                                <View style={styles({ colors, spacing }).workoutSave}>
                                    <TouchableOpacity onPress={() => toggleBox(index)}>
                                        <FontAwesome
                                            style={{ marginRight: "20%" }}
                                            name={biggerFavourite ? "chevron-up" : "chevron-down"}
                                            size={36}
                                            color={"#555"}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => addWorkoutToFirebase(item.movements, item.workoutName)}>
                                        <Icon
                                            name={"heart-outline"}
                                            size={32}
                                            color={colors.text}
                                        />
                                    </TouchableOpacity>
                                </View>
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
                                    <TouchableOpacity
                                        style={styles({ colors, spacing }).button}
                                        onPress={() => setModalVisible(true)}
                                    >
                                        <Text style={{color: colors.text}}>tarkemmat tiedot</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </View>
                    )}
                />
                <WorkOutDataModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    workOutDataReverse={workOutDataReverse}
                    index={index}
                    formatTimestamp={formatTimestamp}
                />
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
            marginTop: spacing.medium,
            marginLeft: spacing.medium
        },
        text: {
            width: "85%",
            color: colors.text
        },
        workoutBox: {
            width: Dimensions.get('window').width -40,
            borderRadius: spacing.small,
            backgroundColor: colors.card,
            alignItems: "center",
            paddingBottom: spacing.small,
            marginLeft: 20,
            marginRight: 20
        },
        workOutDetails: {
            flexDirection: "row",
            width: "100%",
            height: 150,
            alignItems: "center",
            paddingLeft: "5%",
            alignSelf: "flex-start",
        },
        workoutName: {
            width: "65%",
        },
        workoutBoxMainText: {
            fontSize: spacing.large,
            color: colors.text
        },
        workoutBoxMainTextDate: {
            fontSize: spacing.medium,
            color:colors.text
        },
        workoutSave: {
            width: "35%",
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

    })