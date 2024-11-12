import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Appbar } from 'react-native-paper'

export default function NavBar(props) {

  return (
    <Appbar style={styles.container}>
            <Appbar.Action icon="archive" onPress={() => {}} />
            <Appbar.Action icon="email" onPress={() => {}} />
            <Appbar.Action icon="label" onPress={() => {}} />
            <Appbar.Action icon="delete" onPress={() => {}} />
    </Appbar>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        padding: 20,
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        height: 100
    },
})