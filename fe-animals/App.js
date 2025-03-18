import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TextInput, Button } from "react-native";

export default function App() {
    const [animals, setAnimals] = useState([]);
    const [newAnimal, setNewAnimal] = useState({
        animalName: "",
        age: "",
        habitatId: "",
        speciesId: "",
    });

    useEffect(() => {
        fetch("http://localhost:3000/get-animals")
            .then((response) => response.json())
            .then((data) => {
                setAnimals(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleAddAnimal = () => {
        fetch("http://localhost:3000/add-animal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newAnimal),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setAnimals([...animals, { ...newAnimal, AnimalID: data.animalId }]);
                    setNewAnimal({
                        animalName: "",
                        age: "",
                        habitatId: "",
                        speciesId: "",
                    });
                }
            })
            .catch((error) => {
                console.error("Error adding animal:", error);
            });
    }


    return (
        <>
        <View style={styles.container}>
            <FlatList
                data={animals}
                keyExtractor={(item) => item.AnimalID.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>Name: {item.AnimalName}</Text>
                        <Text>Age: {item.age}</Text>
                        <Text>Habitat: {item.HabitatName}</Text>
                        <Text>Climate: {item.Climate}</Text>
                        <Text>Species: {item.SpeciesName}</Text>
                        <Text>Scientific Name: {item.ScientificName}</Text>
                        <Text></Text>
                    </View>
                )}
            />
        </View>
        <View className="animals-form">
            <TextInput 
                placeholder="Animal Name"
                value={newAnimal.animalName}
                onChangeText={(text) => setNewAnimal({ ...newAnimal, animalName: text })}
            />
            <TextInput 
                placeholder="Age"
                value={newAnimal.age}
                onChangeText={(text) => setNewAnimal({ ...newAnimal, age: text })}
            />
            <TextInput 
                placeholder="Habitat ID"
                value={newAnimal.habitatId}
                onChangeText={(text) => setNewAnimal({ ...newAnimal, habitatId: text })}
            />
            <TextInput 
                placeholder="Species ID"
                value={newAnimal.speciesId}
                onChangeText={(text) => setNewAnimal({ ...newAnimal, speciesId: text })}
            />
            <Button onClick={handleAddAnimal} title="Add Animal"/>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
