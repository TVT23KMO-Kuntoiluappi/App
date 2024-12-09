import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UseUser'
import { LineChart } from 'react-native-chart-kit';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import WorkOutSheetsModal from './WorkOutSheetsModal';

export default function WorkOutSheets({name, fromAddBox}) {
    const { colors, spacing } = useTheme()
    const { workOutFirebaseData, oneRepMax } = useUser();
    const [workOutData, setWorkOutData] = useState()
    const [movementNames, setMovementNames] = useState()
    const [pickedWorkOut, setPickedWorkOut] = useState("")
    const [pickedStyle, setPickedStyle] = useState("")
    const [pickedDates, setPickedDates] = useState([])
    const [pickedSetsSum, setPickedSetsSum] = useState([])
    const [pickedSetsAvg, setPickedSetsAvg] = useState([])
    const [pickedWeightSum, setPickedWeightSum] = useState([])
    const [pickedWeightAvg, setPickedWeightAvg] = useState([])
    const [powerIndex, setPowerIndex] = useState([])
    const [calculatedMax, setCalculatedMax] = useState([])
    const [maxWeightList, setMaxWeightList] = useState([])
    const [maxPercentage, setMaxPercentage] = useState([])
    const [items, setItems] = useState([]);
    const [items2, setItems2] = useState([
        { label: "toistot", value: '1' },
        { label: "toistot (avg)", value: '2' },
        { label: "paino (sum)", value: '3' },
        { label: "paino (avg)", value: '4' },
        { label: "voimaindeksi", value: '5' },
        { label: "maksimi (calc)", value: '6' },
        { label: "maksimi (real)", value: '7' },
        { label: "prosentit maksimista", value: '8' }])

    const [LineChartWidth, setLineChartWidth] = useState(Dimensions.get('window').width - 40)
    const [modal2Visible, setModal2Visible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("java");  
    
    useEffect(() => {
        if (fromAddBox) {
            const normalizedName = typeof name === "string" ? name.toUpperCase() : ""; 
            setPickedWorkOut(normalizedName);
            console.log("Picked WorkOut updated:", normalizedName);
        }
    }, [fromAddBox, name]); 
    

    const transformWorkouts = (data) => {
        return data.reduce((result, workout) => {
            workout.movements.forEach((movement) => {
                const movementName = movement.movementName.toUpperCase();

                if (!result[movementName]) {
                    result[movementName] = {};
                }

                if (!result[movementName][workout.workoutId]) {
                    result[movementName][workout.workoutId] = {
                        sets: [],
                        weight: [],
                    };
                }

                movement.sets.forEach((set) => {
                    result[movementName][workout.workoutId].sets.push(Number(set.reps));
                    result[movementName][workout.workoutId].weight.push(Number(set.weight));
                });
            });

            const tempMovementNames = getMovementNames(result)
            setMovementNames(tempMovementNames)
            return result;
        }, {});
    };

    const getMovementNames = (data) => {
        return Object.keys(data);
    };

    const formatDate = (dateString) => {
        const [year, month, day, hours, minutes] = dateString.split(":");
        return `${day}.${month}.${year.slice(2)}`;
    };

    const putLineChart = (pickedName) => {
        if (!pickedName || !workOutData) {
            return;
        }
        const movement = workOutData[pickedName];
        if (!movement) {
            console.log(`No data found for movement: ${pickedName}`);
            Alert.alert(
                "Liike puuttuu",
                "Tästä liikkeestä ei ole dataa, mutta voit tutkia toisia liikkeitä.",
                [{ text: "OK" }] 
            );
            return;
        }
        const dates = Object.keys(movement);
        let formatDatesList = []
        for (let date of dates) {
            const format = formatDate(date)
            formatDatesList.push(format)
        }

        const minWidth = Dimensions.get('window').width - 40;
        const calculatedWidth = Math.max(80 * formatDatesList.length, minWidth);
        setLineChartWidth(calculatedWidth)
        setPickedDates(formatDatesList);

        let tempMax
        for (let alkio of oneRepMax) {
            if (alkio.move.toUpperCase() === pickedName) {
                tempMax = alkio.mass
            }
        }

        let sumSetsList = []
        let avgSetsList = []
        let sumWeightList = []
        let avgWeightList = []
        let pwIndexList = []
        let calcMaxList = []
        let maxList = []
        let maxPercentageList = []
        for (let date of dates) {
            const currentData = movement[date]
            if (!currentData || !currentData.sets || !currentData.weight) {
                console.error(`Invalid data for date: ${date}`);
                continue;
            }
            // lastee tietyn päivämäärän ja tietyn liikkeen toistojen summan
            const sumSets = currentData.sets.reduce((acc, value) => acc + value, 0);
            sumSetsList.push(parseFloat(sumSets));
            // laskee toistojen keskiarvon
            const avgSets = (sumSets / currentData.sets.length).toFixed(1);
            avgSetsList.push(parseFloat(avgSets));
            // laskee tietyn päivämäärän ja tietyn liikkeen painojen summan
            const sumWeight = currentData.weight.reduce((acc, value) => acc + value, 0);
            sumWeightList.push(parseFloat(sumWeight));
            // laskee painojen keskiarvon
            const avgWeight = (sumWeight / currentData.weight.length).toFixed(1);
            avgWeightList.push(parseFloat(avgWeight));
            // laskee voimaindeksin, jossa yhdistään tehtyjen toistojen määrä painojen keskiarvoon
            let x = 0   // alkuarvo, kun selvitetään suurin voimaindexi
            for (let i = 0; i < currentData.sets.length; i++) {
                const power = currentData.sets[i] * currentData.weight[i]
                if (power > x) {
                    x = power
                }
            }
            const pwIndex = x
            pwIndexList.push(parseFloat(pwIndex))
            // Tekee laskennallisen maksimitoiston tietyltä treenikerralta. Tätä voisi verrata vielä prosentuaalisesti omaan oikaan maksimiin.
            let a = 0
            for (let i = 0; i < currentData.sets.length; i++) {
                const max = parseFloat(currentData.weight[i]) * (1 + parseFloat(currentData.sets[i]) / 30)
                if (max > a) {
                    a = max
                }
            }
            const maxRep = a.toFixed(1)
            calcMaxList.push(parseFloat(maxRep))
            // otetaan yhden liikeen yksittäinen suurin paino, mitä on nostanut
            let y = 0
            for (let i = 0; i < currentData.sets.length; i++) {
                const max = parseFloat(currentData.weight[i])
                if (max > y) {
                    y = max
                }
            }
            maxList.push(parseFloat(y))
            // lasketaan yhden treenikerran maksimin prosenttiosuus kyseisen liikkeen maksimista
            const maxRepPercentage = (parseFloat(maxRep) / parseFloat(tempMax)) * 100
            tempMax ? maxPercentageList.push(parseFloat(maxRepPercentage.toFixed(1))) : maxPercentageList.push(0)
        }
        setPickedSetsSum(sumSetsList)
        setPickedSetsAvg(avgSetsList)
        setPickedWeightSum(sumWeightList)
        setPickedWeightAvg(avgWeightList)
        setPowerIndex(pwIndexList)
        setCalculatedMax(calcMaxList)
        setMaxWeightList(maxList)
        setMaxPercentage(maxPercentageList)
    };

    const itemsToPicker = (names) => {
        if (!names || !movementNames) {
            return
        }
        if (movementNames.length > 0) {
            const tempList = []
            for (let i = 1; i <= names.length; i++) {
                if (names[i - 1] === "") {
                    continue
                }
                tempList.push({ label: names[i - 1].toUpperCase(), value: i.toString() })
            }
            // console.log("templist: ", tempList)
            setItems(tempList)
        } else {
            console.log("Ei dataa valitsimeen")
        }

    }

    useEffect(() => {
        itemsToPicker(movementNames)
    }, [movementNames])

    useEffect(() => {
        const data = transformWorkouts(workOutFirebaseData)
        setWorkOutData(data)
    }, [])

    useEffect(() => {
        putLineChart(pickedWorkOut)
    }, [workOutData, pickedWorkOut, pickedStyle])

    // tämän avulla muutetaan colors.card jne. RGBA:ksi
    function hexToRgba(hex, opacity) {
        const match = hex.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
        if (!match) {
            throw new Error("Invalid HEX color.");
        }

        let r, g, b;

        if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        } else if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }


    return (
        <>
        <View style={styles({colors,spacing}).sheetWrapper}>
            <View style={styles({ colors, spacing }).headLine}>
                <Icon
                    name={"chart-areaspline"}
                    size={32}
                    color={colors.text}
                />
                <Text style={{ marginBottom: spacing.small, fontSize: 24, color: colors.text }}>Tilastot</Text>
            </View>
            <View style={styles({ colors, spacing }).dropDowns}>
                <View style={styles({ colors, spacing }).dropdownWrapper}>
                    <Picker
                        selectedValue={pickedWorkOut}
                        onValueChange={(itemValue, itemIndex) => setPickedWorkOut(itemValue)}
                        style={styles({ colors, spacing }).picker}
                    >
                        {items.map((item, index) => (
                            <Picker.Item key={index} label={item.label} value={item.label} />
                        ))}

                    </Picker>

                </View>
                <View style={styles({ colors, spacing }).dropdownWrapper}>
                    <Picker
                        selectedValue={pickedStyle}
                        onValueChange={(itemValue, itemIndex) => setPickedStyle(itemValue)}
                        style={styles({ colors, spacing }).picker}
                    >
                        {items2.map((item, index) => (
                            <Picker.Item key={index} label={item.label} value={item.value} />
                        ))}

                    </Picker>

                </View>
                <TouchableOpacity onPress={() => setModal2Visible(true)}>
                    <Icon
                        style={{color:colors.text}}
                        name="help-circle"
                        size={32}
                    />
                </TouchableOpacity>
            </View>
            {pickedDates.length > 0 ?
                <View style={{ height: 250, marginBottom: 50 }}>
                    <ScrollView horizontal>
                        <LineChart
                            data={{
                                labels: pickedDates,
                                datasets: [
                                    {
                                        data:
                                            pickedStyle === "1"
                                                ? pickedSetsSum
                                                : pickedStyle === "2"
                                                    ? pickedSetsAvg
                                                    : pickedStyle === "3"
                                                        ? pickedWeightSum
                                                        : pickedStyle === "4"
                                                            ? pickedWeightAvg
                                                            : pickedStyle === "5"
                                                                ? powerIndex
                                                                : pickedStyle == "6"
                                                                    ? calculatedMax
                                                                    : pickedStyle == "7"
                                                                        ? maxWeightList
                                                                        : pickedStyle == "8"
                                                                            ? maxPercentage
                                                                            : pickedSetsSum,
                                        color: (opacity = 1) => hexToRgba(colors.text, opacity), // Punainen viiva
                                        strokeWidth: 4,
                                    },
                                ],
                            }}
                            width={LineChartWidth}
                            height={220}
                            yAxisLabel=""
                            chartConfig={{
                                backgroundColor: colors.card,
                                backgroundGradientFrom: colors.surface,
                                backgroundGradientTo: colors.card,
                                decimalPlaces: 1,
                                color: (opacity = 1) => hexToRgba(colors.card, opacity), // Dataviivan väri
                                labelColor: (opacity = 1) => hexToRgba(colors.text, opacity),
                            }}
                            style={{
                                marginLeft: fromAddBox? -30 : 10,
                                marginRight: 10,
                                borderRadius: spacing.small,
                            }}
                        />

                    </ScrollView>
                </View> :
                <View style={styles({ colors, spacing }).emptyLinechart}>
                    <Text style={styles({ colors, spacing }).text}>Valitse haluttu data</Text>
                </View>
            }
            <WorkOutSheetsModal
                modal2Visible={modal2Visible}
                setModal2Visible={setModal2Visible}
            />
        </View>
        </>
    );
}

const styles = ({ colors, spacing }) =>
    StyleSheet.create({
        headLine: {
            width: "100%",
            flexDirection: "row",
            alignContent: "center",
            marginTop: spacing.medium,
            marginLeft: spacing.small
        },
        dropdownWrapper: {
            flex: 1,
            marginHorizontal: 5,
        },
        dropdown: {
            width: '100%',
            borderColor: '#cccccc',
            zIndex: 5000
        },
        dropdownContainer: {
            width: '100%',
            zIndex: 5000
        },
        dropDowns: {
            flexDirection: 'row',
            width: Dimensions.get('window').width - 40,
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        picker: {
            backgroundColor: colors.background,
            color: colors.text,            
            borderWidth: 1,
            borderColor: "black",
        },
        dropdownStyle: {
            backgroundColor: colors.surface, // Valikon taustaväri
            borderWidth: 1,
            borderColor: colors.text,
        },
        emptyLinechart: {
            width: Dimensions.get('window').width - 40,
            height: 220,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: spacing.small,
            backgroundColor: colors.card,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 50
        },
        text: {
            color: colors.text
        }
    });
