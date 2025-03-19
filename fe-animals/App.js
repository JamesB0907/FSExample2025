import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TextInput, Button } from "react-native";

export default function App() {
    const defaultNewAnimal = {
        animalName: "",
        age: "",
        habitatId: "",
        speciesId: "",
    }
    const [animals, setAnimals] = useState([]);
    const [newAnimal, setNewAnimal] = useState(defaultNewAnimal);

    async function fetchAnimals () {
        const response = await fetch("http://localhost:3000/get-animals")
        const data = await response.json();
        setAnimals(data);
        return data;
    }

    useEffect(() => {
        fetchAnimals()
    }, []);

    const handleAddAnimal = async () => {
        try {
            const response = await fetch("http://localhost:3000/add-animal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAnimal),
            });
            const data = await response.json();
            if (data.success) {
                const updatedAnimals = await fetchAnimals();
                setAnimals(updatedAnimals);
                setNewAnimal(defaultNewAnimal);
            }
        } catch (error) {
            console.error("Error adding animal:", error);
        }
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
                        <Text> </Text>
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
            <Button onPress={handleAddAnimal} title="Add Animal"/>
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
