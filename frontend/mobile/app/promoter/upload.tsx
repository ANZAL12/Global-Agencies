import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ActivityIndicator, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../../services/api";
import { useRouter } from "expo-router";

export default function UploadSale() {
    const router = useRouter();
    const [productName, setProductName] = useState("");
    const [billAmount, setBillAmount] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "Please allow camera roll access to upload bills.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!productName || !billAmount || !imageUri) {
            Alert.alert("Missing Fields", "Please fill in all fields and select an image.");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("product_name", productName);
            formData.append("bill_amount", billAmount);

            if (Platform.OS === 'web') {
                const response = await fetch(imageUri);
                const blob = await response.blob();
                formData.append("bill_image", blob, "bill.jpg");
            } else {
                const filename = imageUri.split('/').pop() || 'bill.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;

                formData.append("bill_image", {
                    uri: imageUri,
                    name: filename,
                    type,
                } as any);
            }

            await api.post("/sales/create/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Alert.alert("Success", "Sale uploaded successfully!");
            setProductName("");
            setBillAmount("");
            setImageUri(null);
            router.replace("/promoter");
        } catch (error) {
            console.error("Upload failed", error);
            Alert.alert("Upload Failed", "There was an error saving your sale. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Samsung S23"
                value={productName}
                onChangeText={setProductName}
            />

            <Text style={styles.label}>Bill Amount *</Text>
            <TextInput
                style={styles.input}
                placeholder="0.00"
                value={billAmount}
                onChangeText={setBillAmount}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Bill Image *</Text>
            <View style={styles.imagePickerContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <Text style={styles.imagePlaceholder}>No image selected</Text>
                )}
                <Button title="Choose Image" onPress={pickImage} />
            </View>

            <View style={styles.submitContainer}>
                {isSubmitting ? (
                    <ActivityIndicator size="large" color="#1976d2" />
                ) : (
                    <Button title="Submit Sale" onPress={handleSubmit} color="#4caf50" />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: "#fafafa",
    },
    imagePickerContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    imagePlaceholder: {
        padding: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderStyle: "dashed",
        borderRadius: 8,
        marginBottom: 10,
        color: "#888",
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    submitContainer: {
        marginTop: 10,
    },
});
