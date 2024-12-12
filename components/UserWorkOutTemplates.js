import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert, Platform } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from 'react-native-paper'
import { useUser } from '../context/UseUser';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { FontAwesome } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, firestore, doc, deleteDoc } from "../firebase/Config";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

export default function UserWorkOutTemplates() {
    const navigation = useNavigation()
    const { colors, spacing } = useTheme()
    const { usersSavedWorkOuts, setUpdateContent } = useUser()
    const [expanded, setExpanded] = useState({});
    const [biggerFavourite, setBiggerFavourite] = useState(false)
    const [componentHeight, setComponentHeight] = useState(150)

    const toggleBox = (move) => {
        if (!biggerFavourite) {
            const numOfWorkout = usersSavedWorkOuts[move].movements.length
            const compHeight = numOfWorkout * 40 + 200
            setComponentHeight(compHeight)
            console.log(numOfWorkout, "   ", compHeight)
        } else {
            setComponentHeight(150)
        }
        setBiggerFavourite(!biggerFavourite)
    };

    const deleteFavourite = (index) => {
        const delededDocument = usersSavedWorkOuts[index]
        console.log("poistetava dokumentti: ", delededDocument)
        const userId = auth.currentUser.uid;

        Alert.alert(
            "Vahvistus",
            `Haluatko tämän suosikkitreenin: ${delededDocument.workoutName}?`,
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
                                `users/${userId}/treenipohjat/${delededDocument.workoutName}`
                            );

                            await deleteDoc(workoutDocRef);
                            setUpdateContent((prevData) => prevData + 1);
                            console.log(`Workout ${delededDocument.workoutName} poistettu onnistuneesti.`);
                        } catch (error) {
                            console.error("Virhe treenin poistossa:", error);
                        }
                    },
                },
            ]
        );
    }

    return (
        <>
            <View style={styles({ colors, spacing }).headLine}>
                <Icon
                    name={"heart"}
                    size={32}
                    color={colors.text}
                />
                <Text style={{ marginBottom: spacing.small, fontSize: 24, color: colors.text }}>Suosikkitreenit</Text>
            </View>
            <View style={{ height: componentHeight, width: Dimensions.get('window').width }}>
                <SwiperFlatList
                    index={0}
                    autoplay={false}
                    data={usersSavedWorkOuts}
                    scrollEnabled={!biggerFavourite}
                    renderItem={({ item, index }) => (
                        <View key={index} style={[styles({ colors, spacing }).workoutBox, { justifyContent: biggerFavourite ? 'space-between' : 'center' }]}>
                            <View style={styles({ colors, spacing }).workoutBoxInfoContainer}>
                                {/* Chevron Left */}
                                {index > 0 && !biggerFavourite && (
                                    <View style={styles({ colors, spacing }).arrowLeft}>
                                        <TouchableOpacity>
                                            <FontAwesome name={"chevron-left"} size={26} color={"#555"} />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Center Content */}
                                <View style={styles({ colors, spacing }).centerContent}>
                                    <View style={styles({ colors, spacing }).textContainer}>
                                        <Text style={styles({ colors, spacing }).workoutBoxMainText}>
                                            {item.templateName}
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
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate("Treenaa!", {
                                                    workoutName: item.templateName,
                                                    savedData: item,
                                                })
                                            }
                                        >
                                            <Icon name={"dumbbell"} size={32} color={colors.text} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Chevron Right */}
                                {index < usersSavedWorkOuts.length - 1 && !biggerFavourite && (
                                    <View style={styles({ colors, spacing }).arrowRight}>
                                        <TouchableOpacity>
                                            <FontAwesome name={"chevron-right"} size={26} color={"#555"} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {biggerFavourite && (
                                <View style={styles({ colors, spacing }).workoutContent}>
                                    {item.movements.map((movement, index) => (
                                        <Text
                                            style={styles({ colors, spacing }).workoutContentText}
                                            key={index}
                                        >
                                            {movement.movementName}: {movement.sets.length} x {movement.sets[0].reps}
                                        </Text>
                                    ))}
                                </View>
                            )}
                            {biggerFavourite &&
                                <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => deleteFavourite(index)}>
                                    <Ionicons
                                        name={"trash"}
                                        size={32}
                                        color={colors.text}
                                    />
                                </TouchableOpacity>
                            }
                        </View>
                    )}
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
            marginTop: Platform.OS === 'android' ? spacing.medium : spacing.large,
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
            flexDirection: "colum",
            alignItems: "center",
            marginLeft: 20,
            marginRight: 20,
        },
        workoutBoxInfoContainer: {
            position: "relative",
            width: "100%",
            height: 150,
            flexDirection: "row", // Järjestä lapset vaakasuoraan
            alignItems: "center",
            justifyContent: "center", // Tasaa lapset
          },
          
          centerContent: {
            width: "80%",
            flexDirection: "row", // Teksti ja ikonit vierekkäin
            alignItems: "center",
            justifyContent: "space-between", // Keskitetty vaakasuunnassa
          },
          
          textContainer: {
            flexDirection: "column", // Teksti päällekkäin
            marginRight: 20, // Etäisyys ikoneista
            alignItems: "flex-start", // Teksti vasemmalle
          },
          
          iconContainer: {
            flexDirection: "row", // Ikonit vierekkäin
            alignItems: "center",
            justifyContent: "flex-start", // Ikonit tekstin viereen
            gap: 10, // Lisää etäisyyttä ikonien väliin
          },
          
          arrowLeft: {
            position: "absolute",
            left: -20,
            top: "50%",
            transform: [{ translateY: -13 }], // Keskitä pystysuunnassa
          },
          
          arrowRight: {
            position: "absolute",
            right: -20,
            top: "50%",
            transform: [{ translateY: -13 }], // Keskitä pystysuunnassa
          },
          
          workoutName: {
            flexDirection: "row",
            alignItems: "center",
          },
          
          workoutBoxMainText: {
            fontSize: 18,
            fontWeight: "bold",
            color: colors.text,
          },
          
        workoutSave: {
            width: "35%",
            flexDirection: "row",
        },
        workoutBoxMainText: {
            fontSize: spacing.large,
            color: colors.text
        },
        workoutContent: {
            width: "100%",
            paddingLeft: 10,
            paddingRight: 10,
            alignItems: "center"
        },
        workoutContentText: {
            fontSize: 20,
            fontWeight: "bold",
            paddingBottom: 2,
            marginTop: spacing.small,
            color: colors.text
        },
    })