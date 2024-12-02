import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '../context/UseUser';
import { useTheme } from 'react-native-paper';
import WorkOutDataModal from './WorkOutDataModal';

export default function WorkOutData() {
    const { colors, spacing } = useTheme();
    const { workOutFirebaseData, oneRepMax } = useUser();
    const [modalVisible, setModalVisible] = useState(false)
    const [index, setIndex] = useState(0)

    function formatTimestamp(timestamp) {
        const [year, month, day, hours, minutes, seconds] = timestamp.split(":");
        return `${day}.${month}.${year} klo ${hours}.${minutes}`;
    }

    return (
        <>
            <View style={styles({ colors, spacing }).headLine}>
                <Text style={{ marginBottom: spacing.small, fontSize: 24 }}>Tehdyt treenit</Text>
            </View>
            <View style={{ height: 250 }}>

                <ScrollView horizontal style={styles({ colors, spacing }).scrollView}>
                    {workOutFirebaseData.map((item, index) => (
                        <View key={index} style={styles({ colors, spacing }).workOutData}>
                            <View style={styles({ colors, spacing }).workOutDetails}>
                                <Text style={{ fontWeight: 'bold' }}>{item.workoutName}  {formatTimestamp(item.workoutId)}</Text>
                                <Text></Text>
                                {item.movements.slice(0, 4).map((movement, index2) => (
                                    <View key={index2} style={{ flexDirection: "row", justifyContent: "space-between", margintTop: 0 }}>
                                        <Text>{movement.movementName}  </Text>
                                        <Text>settejä: {movement.sets.length}</Text>
                                    </View>
                                ))}
                                {item.movements.length > 4 && (
                                    <Text style={{ fontStyle: "italic", color: colors.text }}>...näytä lisää:</Text>
                                )}
                            </View>
                            <TouchableOpacity
                                style={styles({ colors, spacing }).button}
                                onPress = {()=>{setModalVisible(true); setIndex(index)}}
                            >
                                <Text>tarkemmat tiedot</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
                <WorkOutDataModal 
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    workOutFirebaseData={workOutFirebaseData}
                    index = {index}
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
            borderBottomColor: "black",
            borderBottomWidth: 2,
            alignItems: "center",
            marginBottom: spacing.small
        },
        workOutData: {
            width: Dimensions.get('window').width - 40,
            height: 220,
            marginVertical: 8,
            borderRadius: spacing.small,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: spacing.small,
            margin: 10
        },
        workOutDetails: {
            marginTop: 20
        },
        scrollView: {
            flexDirection: "row",
        },
        button: {
            backgroundColor: colors.card,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            borderColor: "black",
            borderWidth: 2,
            borderRadius: spacing.small,
            margin: 7,
            width: "50%",
        },
    })