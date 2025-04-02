import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    Button,
} from "react-native";

export default function App() {
    const defaultNewAnimal = {
        animalName: "",
        age: "",
        habitatId: "",
        speciesId: "",
    };
    const [animals, setAnimals] = useState([]);
    const [newAnimal, setNewAnimal] = useState(defaultNewAnimal);
    const [edittedAnimal, setEdittedAnimal] = useState({});
    const [showEditForm, setShowEditForm] = useState(false);
    const [animalId, setAnimalId] = useState(0);

    async function fetchAnimals() {
        const response = await fetch("http://localhost:3000/get-animals");
        const data = await response.json();
        setAnimals(data);
        return data;
    }

    useEffect(() => {
        fetchAnimals();
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
    };

    const handleEditAnimal = async (animalId) => {
        const animalToUpdate = {
            animalId: edittedAnimal.AnimalID,
            animalName: edittedAnimal.animalName,
            age: edittedAnimal.age,
            habitatId: edittedAnimal.habitatId,
            speciesId: edittedAnimal.speciesId,
        };
        try {
            const response = await fetch(
                `http://localhost:3000/put-animal/${animalId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(animalToUpdate),
                }
            );
            const data = await response.json();
            if (data.success) {
                const updatedAnimals = await fetchAnimals();
                setAnimals(updatedAnimals);
                setShowEditForm(false);
            }
        } catch (error) {
            console.error("Error editing animal:", error);
        }
    };

    const handleDeleteAnimal = async (animalId) => {
        try {
            const response = await fetch(
                `http://localhost:3000/delete-animal/${animalId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                // Successfully deleted
                const updatedAnimals = await fetchAnimals();
                setAnimals(updatedAnimals);
            } else {
                // Handle error response
                console.error("Failed to delete animal:", response.status);
            }
        } catch (error) {
            console.error("Error deleting animal:", error);
        }
    };

    const openEditForm = (itemId) => {
        setAnimalId(itemId);
        const foundAnimal = animals.find((animal) => animal.AnimalID === itemId);
        if (foundAnimal) {
            setShowEditForm(true);
            setEdittedAnimal({
                ...foundAnimal,
                animalName: foundAnimal.AnimalName,
                age: foundAnimal.age.toString(), // Ensure age is a string
                habitatId: foundAnimal.HabitatID.toString(), // Ensure habitatId is a string
                speciesId: foundAnimal.SpeciesID.toString(), // Ensure speciesId is a string
            });
        }
    };

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
                            <Button
                                onPress={() => openEditForm(item.AnimalID)}
                                title="Edit"
                                color="blue"
                            />
                            <Button
                                onPress={() =>
                                    handleDeleteAnimal(item.AnimalID)
                                }
                                title="Delete"
                                color="red"
                            />
                            <Text> </Text>
                        </View>
                    )}
                />
            </View>
            {/* ADD ANIMAL FORM */}
            <View className="animals-form">
                <h1>Add Animal</h1>
                <TextInput
                    placeholder="Animal Name"
                    value={newAnimal.animalName}
                    onChangeText={(text) =>
                        setNewAnimal({ ...newAnimal, animalName: text })
                    }
                />
                <TextInput
                    placeholder="Age"
                    value={newAnimal.age}
                    onChangeText={(text) =>
                        setNewAnimal({ ...newAnimal, age: text })
                    }
                />
                <TextInput
                    placeholder="Habitat ID"
                    value={newAnimal.habitatId}
                    onChangeText={(text) =>
                        setNewAnimal({ ...newAnimal, habitatId: text })
                    }
                />
                <TextInput
                    placeholder="Species ID"
                    value={newAnimal.speciesId}
                    onChangeText={(text) =>
                        setNewAnimal({ ...newAnimal, speciesId: text })
                    }
                />
                <Button onPress={handleAddAnimal} title="Add Animal" />
            </View>

            {/* EDIT ANIMAL FORM */}
            {showEditForm && (
                <View className="animals-edit-form">
                    <h1>Edit Animal</h1>
                    <TextInput
                        controlled
                        placeholder="Animal Name"
                        value={edittedAnimal.animalName}
                        onChangeText={(text) =>
                            setEdittedAnimal({
                                ...edittedAnimal,
                                animalName: text,
                            })
                        }
                    />
                    <TextInput
                        controlled
                        placeholder="Age"
                        value={edittedAnimal.age}
                        onChangeText={(text) =>
                            setEdittedAnimal({ 
                                ...edittedAnimal, 
                                age: text 
                            })
                        }
                    />
                    <TextInput
                        controlled
                        placeholder="Habitat ID"
                        value={edittedAnimal.habitatId}
                        onChangeText={(text) =>
                            setEdittedAnimal({
                                ...edittedAnimal,
                                habitatId: text,
                            })
                        }
                    />
                    <TextInput
                        controlled
                        placeholder="Species ID"
                        value={edittedAnimal.speciesId}
                        onChangeText={(text) =>
                            setEdittedAnimal({
                                ...edittedAnimal,
                                speciesId: text,
                            })
                        }
                    />
                    <Button onPress={() => handleEditAnimal(animalId)} title="Edit Animal" color="green"/>
                </View>
            )}
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
