// React Native app for calculating Neapolitan pizza dough based on AVPN guidelines
// Using Expo for simplicity

import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [pizzaCount, setPizzaCount] = useState('4');
  const [pizzaSize, setPizzaSize] = useState('250');
  const [hydration, setHydration] = useState('60');
  const [flourType, setFlourType] = useState('00');
  const [yeastType, setYeastType] = useState('dry');
  const [targetTime, setTargetTime] = useState('2025-05-13T20:00');
  const [result, setResult] = useState(null);

  const calculateDough = () => {
    const doughWeight = parseFloat(pizzaCount) * parseFloat(pizzaSize);
    const hydrationRatio = parseFloat(hydration) / 100;

    const flour = doughWeight / (1 + hydrationRatio);
    const water = flour * hydrationRatio;

    let yeast;
    const hoursUntilBake = (new Date(targetTime) - new Date()) / 1000 / 3600;

    if (yeastType === 'dry') {
      yeast = flour * (0.1 / 100); // 0.1% dry yeast for long fermentation
    } else if (yeastType === 'fresh') {
      yeast = flour * (0.25 / 100); // 0.25% fresh yeast
    } else {
      yeast = flour * (20 / 100); // 20% of flour weight as sourdough starter
    }

    const salt = flour * 0.03; // 3% salt

    setResult({ flour, water, salt, yeast, yeastType, targetTime, hoursUntilBake });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Neapolitan Pizza Dough Calculator</Text>

      <Text>Number of Pizzas:</Text>
      <TextInput keyboardType="numeric" value={pizzaCount} onChangeText={setPizzaCount} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Size per Pizza (grams):</Text>
      <TextInput keyboardType="numeric" value={pizzaSize} onChangeText={setPizzaSize} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Hydration % (e.g. 60):</Text>
      <TextInput keyboardType="numeric" value={hydration} onChangeText={setHydration} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Flour Type:</Text>
      <Picker selectedValue={flourType} onValueChange={setFlourType}>
        <Picker.Item label="00 Flour" value="00" />
        <Picker.Item label="Manitoba" value="manitoba" />
      </Picker>

      <Text>Yeast Type:</Text>
      <Picker selectedValue={yeastType} onValueChange={setYeastType}>
        <Picker.Item label="Dry Yeast" value="dry" />
        <Picker.Item label="Fresh Yeast" value="fresh" />
        <Picker.Item label="Sourdough" value="sourdough" />
      </Picker>

      <Text>Target Cooking Time:</Text>
      <TextInput
        value={targetTime}
        onChangeText={setTargetTime}
        style={{ borderWidth: 1, marginBottom: 10 }}
        placeholder="YYYY-MM-DDTHH:MM"
      />

      <Button title="Calculate Dough" onPress={calculateDough} />

      {result && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Dough Recipe</Text>
          <Text>Flour: {result.flour.toFixed(1)} g</Text>
          <Text>Water: {result.water.toFixed(1)} g</Text>
          <Text>Salt: {result.salt.toFixed(1)} g</Text>
          <Text>
            {result.yeastType === 'sourdough' ? 'Sourdough Starter' : 'Yeast'}: {result.yeast.toFixed(1)} g
          </Text>
          <Text>Fermentation Time: ~{result.hoursUntilBake.toFixed(1)} hours</Text>

          <Text style={{ marginTop: 10 }}>Example Timeline:</Text>
          <Text>• Mix ingredients: Now</Text>
          <Text>• Knead and rest 20 min</Text>
          <Text>• Bulk rise: {result.hoursUntilBake < 10 ? 'Room temp' : 'Cold ferment + Room'}</Text>
          <Text>• Ball and proof: 2 hours before baking</Text>
        </View>
      )}
    </ScrollView>
  );
}
