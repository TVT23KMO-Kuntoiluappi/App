import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';

export default function WorkOutDataModal({ modalVisible, setModalVisible, workOutFirebaseData, index, formatTimestamp }) {
    const data = workOutFirebaseData[index];

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            <Text style={styles.modalTitle}>{data.workoutName || "Treenin nimi"}</Text>
                            <Text style={styles.modalTimestamp}>{formatTimestamp(data.workoutId)}</Text>

                            {data.movements.map((item, index1) => (
                                <View key={index1} style={styles.movementContainer}>
                                    <Text style={styles.movementName}>{item.movementName}</Text>
                                    {item.sets.map((set, index2) => (
                                        <Text key={index2} style={styles.setText}>
                                            Sarja {index2 + 1}: {set.reps} x {set.weight} kg
                                        </Text>
                                    ))}
                                    <View style={styles.divider}></View>
                                </View>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Sulje</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',
        elevation: 5,
        maxHeight: '80%',
    },
    scrollContent: {
        width: '100%',
        alignItems: 'flex-start',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        alignSelf: 'center',
    },
    modalTimestamp: {
        fontSize: 14,
        color: '#888',
        marginBottom: 15,
        textAlign: 'center',
        alignSelf: 'center',
    },
    movementContainer: {
        marginBottom: 10,
        width: '100%',
    },
    movementName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    setText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    closeButton: {
        backgroundColor: '#FF4500',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
});
