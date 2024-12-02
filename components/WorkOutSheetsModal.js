import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function WorkOutSheetsModal({ modal2Visible, setModal2Visible }) {
    const { colors, spacing } = useTheme();

    return (
        <View style={styles({ colors, spacing }).container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal2Visible}
                onRequestClose={() => setModal2Visible(false)}
            >
                <View style={styles({ colors, spacing }).modalContainer}>
                    <View style={styles({ colors, spacing }).modalContent}>
                        <ScrollView style={styles({ colors, spacing }).scrollContent}>
                            <Text style={styles({ colors, spacing }).modalTitle}>Treenin tiedot</Text>
                            <Text style={styles({ colors, spacing }).sectionTitle}>Toistot</Text>
                            <Text style={styles({ colors, spacing }).text}>
                                Näyttää liikkeen toistomäärän yhteenlaskettuna. Esim. 12 + 12 + 12 = 36
                            </Text>
                            <Text style={styles({ colors, spacing }).sectionTitle}>Toistot (avg)</Text>
                            <Text style={styles({ colors, spacing }).text}>
                                Näyttää toistojen keskiarvon. Esim. 6 + 7 + 8 = 21. 21 / 3 = 7.
                            </Text>
                            <Text style={styles({ colors, spacing }).sectionTitle}>Paino (sum)</Text>
                            <Text style={styles({ colors, spacing }).text}>
                                Näyttää painojen yhteenlasketun määrän. Esim. kolme settiä 50 kg + 50 kg + 50 kg = 150 kg.
                            </Text>
                            <Text style={styles({ colors, spacing }).sectionTitle}>Paino (avg)</Text>
                            <Text style={styles({ colors, spacing }).text}>
                                Näyttää keskiarvon nostetuista painoista. Esim. 20 kg + 25 kg + 30 kg = 75 kg. 75 kg / 3 = 25 kg.
                            </Text>
                            <Text style={styles({ colors, spacing }).sectionTitle}>Voimaindeksi</Text>
                            <Text style={styles({ colors, spacing }).text}>
                                Voimaindeksi on toistot * painot. Esim. 12 * 10 kg = 120. Tämä kaavio näyttää sarjan suurimman
                                voimaindeksin. Jos on kaksi kyykkyä 10 * 100kg ja 10 * 90 kg, niin näytetään 1000, koska se on
                                tämän treenikerran suurin voimaindeksi.
                            </Text>
                            <Text style={styles({ colors, spacing }).sectionTitle}>Maksimi (calc)</Text>
                            <Text style={styles({ colors, spacing }).text}>
                                Näyttää liikkeen suurimman teoreettisen maksimin laskukaavalla Paino x (1 + toistojen määrä / 30).
                            </Text>
                            <Text style={styles({ colors, spacing }).sectionTitle}>Maksimi (real)</Text>
                            <Text style={styles({ colors, spacing }).text}>
                                Näyttää liikkeen todellisen maksimin, mitä sillä treenikerralla on nostettu. Jos sarjassa on ollut
                                8 x 100 kg, 8 x 110kg ja 8 x 120 kg, näyttää tämä 120 kg.
                            </Text>
                            <Text style={styles({ colors, spacing }).sectionTitle}>Prosentit maksimista</Text>
                            <Text style={styles({ colors, spacing }).text}>
                                Näyttää treenikerran prosenttiosuuden asetuksissa ilmoittamalle maksimillesi. Vertaa siis maksimi
                                (calc) arvoa asetuksissa oleviin arvoihin. Jos prosentit on yli 100, sinun tulisi harkita asetuksissa
                                maksimin vaihtamista.
                            </Text>
                        </ScrollView>
                        <TouchableOpacity
                            style={[styles({ colors, spacing }).closeButton, { backgroundColor: colors.card }]}
                            onPress={() => setModal2Visible(false)}
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
            padding: spacing.large,
            backgroundColor: colors.surface,
            borderRadius: spacing.medium,
            elevation: 5,
            maxHeight: '95%',
            alignItems: "center"
        },
        scrollContent: {
            width: '100%',
            marginBottom: spacing.medium,
        },
        modalTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: spacing.medium,
            color: colors.text,
            textAlign: 'center',
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            marginVertical: spacing.small,
            color: colors.text,
        },
        text: {
            fontSize: 16,
            color: colors.text,
            marginBottom: spacing.small,
        },
        closeButton: {
            padding: spacing.medium,
            borderRadius: spacing.small,
            marginTop: spacing.medium,
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: colors.text,
        },
        buttonText: {
            color: colors.text,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });
