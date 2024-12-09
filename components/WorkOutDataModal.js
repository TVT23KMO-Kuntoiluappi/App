import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function WorkOutDataModal({ modalVisible, setModalVisible, workOutDataReverse, index, formatTimestamp }) {
    const data = workOutDataReverse[index];
    const { colors, spacing} = useTheme()
    
    useEffect(()=>{
        console.log("modalindex: ", index)
    },[modalVisible])

    return (
        <View style={styles({ colors, spacing }).container}>
            {data && 
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles({ colors, spacing }).modalContainer}>
                    <View style={styles({ colors, spacing }).modalContent}>
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            <Text style={styles({ colors, spacing }).modalTitle}>{data.workoutName || "Treenin nimi"}</Text>
                            <Text style={styles({ colors, spacing }).modalTimestamp}>{formatTimestamp(data.workoutId)}</Text>

                            {data.movements.map((item, index1) => (
                                <View key={index1} style={styles({ colors, spacing }).movementContainer}>
                                    <Text style={styles({ colors, spacing }).movementName}>{item.movementName}</Text>
                                    {item.sets.map((set, index2) => (
                                        <Text key={index2} style={styles({ colors, spacing }).setText}>
                                            Sarja {index2 + 1}: {set.reps} x {set.weight} kg
                                        </Text>
                                    ))}
                                    <View style={styles({ colors, spacing }).divider}></View>
                                </View>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={[styles({ colors, spacing }).closeButton]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles({ colors, spacing }).buttonText}>Sulje</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> }
        </View>
    );
}

const styles = ({ colors, spacing }) =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: '90%',
            padding: spacing.large,
            backgroundColor: colors.card,
            borderRadius: spacing.medium,
            alignItems: 'center',
            elevation: 5,
            maxHeight: '95%',
        },
        scrollContent: {
            width: '100%',
            paddingBottom: spacing.medium,
            alignItems: 'flex-start',
        },
        modalTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: spacing.medium,
            color: colors.text,
            textAlign: 'center',
            alignSelf: 'center',
        },
        modalTimestamp: {
            fontSize: 14,
            color: colors.textSecondary || '#888',
            marginBottom: spacing.medium,
            textAlign: 'center',
            alignSelf: 'center',
        },
        movementName: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: spacing.small,
            color: colors.text,
        },
        movementContainer: {
            width: "100%",
        },
        setText: {
            fontSize: 16,
            color: colors.text,
            marginLeft: spacing.small,
            marginBottom: spacing.small,
        },
        divider: {
            height: 2,
            backgroundColor: colors.text,
            marginVertical: spacing.small,
            width: '100%',
        },
        closeButton: {
            backgroundColor: colors.button,
            padding: spacing.medium,
            borderRadius: spacing.medium,
            marginTop: spacing.large,
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: colors.text,
        },
        buttonText: {
            color: colors.buttonText,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });
