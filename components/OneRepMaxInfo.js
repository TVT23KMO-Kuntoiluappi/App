import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function OneRepMaxInfo({ modalVisible, setModalVisible }) {
    const [mass, setMass] = useState();
    const [reps, setReps] = useState();
    const [calculateMaxRep, setCalculateMaxRep] = useState(0)

    const calculateMax = () => {
        if (!mass || !reps) {
            setCalculateMaxRep(null);
            return;
        }
        const maxRep = parseFloat(mass) * (1 + (parseFloat(reps) / 30));
        const roundRep = Math.round(maxRep*2) / 2
        setCalculateMaxRep(roundRep.toFixed(2))
        console.log("maxRep", maxRep)
        console.log("roundRep", roundRep.toFixed(2))
    };

    useEffect(()=>{
        calculateMax()
    },[mass, reps])
    

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
                        <Text style={styles.modalText}>OneRepMax -Info</Text>
                        <Text style={styles.modalDescription}>
                            Jos et pääse testaamaan varmistajien kanssa omaa maksimistoistoa, voit laskea sen seuraavalla kaavalla.
                        </Text>
                        <Text style={styles.modalDescription}>
                            Hox! Tämä ei ole niin tarkka, mutta hyvin suuntaa antava!
                        </Text>
                        <Text style={styles.modalFormula}>
                            Paino x (1 + toistojen määrä / 30)
                        </Text>

                        <TextInput
                            label="Paino (kg)"
                            mode="outlined"
                            keyboardType="numeric"
                            value={mass?.toString()} // Näytetään mass arvona string muodossa
                            onChangeText={(value) => {
                                setMass(value); // Päivittää mass
                            }}
                            style={styles.textInput}
                        />
                        <TextInput
                            label="Toistojen määrä"
                            mode="outlined"
                            keyboardType="numeric"
                            value={reps?.toString()} // Näytetään reps arvona string muodossa
                            onChangeText={(value) => {
                                setReps(value); // Päivittää reps
                            }}
                            style={styles.textInput}
                        />
                        <Text style = {styles.maxRep }>{calculateMaxRep}</Text>

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
    },
    modalText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    modalDescription: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
        color: '#555',
    },
    modalFormula: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    textInput: {
        width: '100%',
        marginBottom: 15,
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
    maxRep: {
        backgroundColor: "#B8A90B",
        padding: 20,
        borderRadius: 100,
        fontSize: 20
    }
});
