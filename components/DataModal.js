import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from 'react-native-paper'
import WorkOutSheets from './WorkOutSheets';

export default function DataModal({ modalVisible, setModalVisible, name, fromAddBox, setFromAddBox }) {
    const { colors, spacing } = useTheme()

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
                        <WorkOutSheets 
                            name={name}
                            fromAddBox={fromAddBox}
                        />
                        <TouchableOpacity
                            style={[styles({ colors, spacing }).closeButton, { backgroundColor: colors.card }]}
                            onPress={() => {setModalVisible(false); setFromAddBox(false)}}
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
            maxHeight: '95%',
        },
        closeButton: {
            backgroundColor: colors.card,
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
            color: colors.text,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });
