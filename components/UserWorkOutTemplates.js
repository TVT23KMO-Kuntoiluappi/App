import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from 'react-native-paper'
import { useUser } from '../context/UseUser';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { FontAwesome } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function UserWorkOutTemplates({navigation}) {
    const { colors, spacing } = useTheme()
    const { usersSavedWorkOuts } = useUser()
    const [expanded, setExpanded] = useState({});
    const [biggerFavourite, setBiggerFavourite] = useState(false)
    const [componentHeight, setComponentHeight] = useState(150)

    const toggleBox = (move) => {
        if (!biggerFavourite) {
            const numOfWorkout = usersSavedWorkOuts[move].movements.length
            const compHeight = numOfWorkout * 40 + 200
            setComponentHeight(compHeight)
            console.log(numOfWorkout, "   ",compHeight)
        } else {
            setComponentHeight(150)
        }
        setBiggerFavourite(!biggerFavourite)
    };

    return (
        <>
            <View style={styles({ colors, spacing }).headLine}>
                <Text style={{ marginBottom: spacing.small, fontSize: 24 }}>Suosikkitreenit</Text>
            </View>
            <View style={{ height: componentHeight }}>
                <SwiperFlatList
                    index={0}
                    autoplay={false}
                    data={usersSavedWorkOuts}
                    renderItem={({ item, index }) => (
                        <View key={index} style={[styles({ colors, spacing }).workoutBox, {justifyContent: biggerFavourite ? 'space-between' : 'center'}]}>
                            <View style={styles({ colors, spacing }).workoutBoxInfoContainer}>
                                <View style={styles({ colors, spacing }).workoutName}>
                                    <Text style={styles({ colors, spacing }).workoutBoxMainText}>
                                        {item.templateName}
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
                                    <TouchableOpacity onPress={() => navigation.navigate("Treenaa!", { workoutName: item.templateName, savedData: item })}>
                                        <Icon
                                            name={"dumbbell"}
                                            size={32}
                                            color={colors.text}
                                        />
                                    </TouchableOpacity>
                                </View>
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
            borderBottomColor: "black",
            borderBottomWidth: 2,
            alignItems: "center",
            marginBottom: spacing.small
        },
        text: {
            width: "85%",
        },
        workoutBox: {
            width: Dimensions.get('window').width - 40,
            borderRadius: spacing.small,
            backgroundColor: colors.surface,
            alignItems: "center",
            paddingBottom: spacing.small,
            margin: 10
        },
        workoutBoxInfoContainer: {
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
        workoutSave: {
            width: "35%",
            flexDirection: "row",
        },
        workoutBoxMainText: {
            fontSize: spacing.large,
        },
        workoutContent: {
            width: "100%",
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 40,
            alignItems: "center"
        },
        workoutContentText: {
            fontSize: 20,
            fontWeight: "bold",
            paddingBottom: 2,
            marginTop: spacing.small,
        },
    })