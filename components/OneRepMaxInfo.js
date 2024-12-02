import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

export default function OneRepMaxInfo({ modalVisible, setModalVisible }) {
    const [mass, setMass] = useState();
    const [reps, setReps] = useState();
    const [calculateMaxRep, setCalculateMaxRep] = useState(0);

    const { colors, spacing } = useTheme();

    const calculateMax = () => {
        if (!mass || !reps) {
            setCalculateMaxRep(null);
            return;
        }
        const maxRep = parseFloat(mass) * (1 + parseFloat(reps) / 30);
        const roundRep = Math.round(maxRep * 2) / 2;
        setCalculateMaxRep(roundRep.toFixed(2));
    };

    useEffect(() => {
        calculateMax();
    }, [mass, reps]);

    return (
        <View style={styles({ colors, spacing }).container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles({ colors, spacing }).modalContainer}>
                    <View style={styles({ colors, spacing }).modalContent}>
                        <Text style={styles({ colors, spacing }).modalText}>OneRepMax -Info</Text>
                        <Text style={styles({ colors, spacing }).modalDescription}>
                            Jos et pääse testaamaan varmistajien kanssa omaa maksimistoistoa, voit laskea sen seuraavalla kaavalla.
                        </Text>
                        <Text style={styles({ colors, spacing }).modalDescription}>
                            Hox! Tämä ei ole niin tarkka, mutta hyvin suuntaa antava!
                        </Text>
                        <Text style={styles({ colors, spacing }).modalFormula}>
                            Paino x (1 + toistojen määrä / 30)
                        </Text>

                        <TextInput
                            label="Paino (kg)"
                            mode="outlined"
                            keyboardType="numeric"
                            value={mass?.toString()}
                            onChangeText={(value) => setMass(value)}
                            style={styles({ colors, spacing }).textInput}
                        />
                        <TextInput
                            label="Toistojen määrä"
                            mode="outlined"
                            keyboardType="numeric"
                            value={reps?.toString()}
                            onChangeText={(value) => setReps(value)}
                            style={styles({ colors, spacing }).textInput}
                        />
                        <Text style={styles({ colors, spacing }).maxRep}>
                            {calculateMaxRep ? `Maksimi: ${calculateMaxRep} kg` : 'Anna arvot'}
                        </Text>

                        <TouchableOpacity
                            style={styles({ colors, spacing }).closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles({ colors, spacing }).buttonText}>Sulje</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
            backgroundColor: colors.surface,
            borderRadius: spacing.medium,
            alignItems: 'center',
            elevation: 5,
        },
        modalText: {
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: spacing.medium,
            color: colors.text,
        },
        modalDescription: {
            fontSize: 16,
            textAlign: 'center',
            marginBottom: spacing.small,
            color: colors.text,
        },
        modalFormula: {
            fontSize: 18,
            fontStyle: 'italic',
            textAlign: 'center',
            marginBottom: spacing.medium,
            color: colors.text,
        },
        textInput: {
            width: '100%',
            marginBottom: spacing.small,
        },
        closeButton: {
            backgroundColor: colors.card,
            padding: spacing.medium,
            borderRadius: spacing.small,
            marginTop: spacing.large,
            borderWidth: 2,
            borderColor: colors.text,
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonText: {
            color: colors.text,
            fontSize: 18,
            textAlign: 'center',
        },
        maxRep: {
            backgroundColor: colors.surface,
            padding: spacing.medium,
            borderRadius: spacing.large,
            fontSize: 20,
            color: colors.text,
            textAlign: 'center',
            marginBottom: spacing.medium,
        },
    });
