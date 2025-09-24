import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
import { AntDesign,Feather  } from '@expo/vector-icons';

export default function DateProgressBox() {
  const [goalDate, setGoalDate] = useState(null);
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(null);
  const [daysPassed, setDaysPassed] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  // Load saved date
  useEffect(() => {
    const loadDate = async () => {
      const savedDate = await AsyncStorage.getItem("goalDate");
      if (savedDate) setGoalDate(new Date(savedDate));
    };
    loadDate();
  }, []);

  // Update progress whenever date changes
  useEffect(() => {
    if (goalDate) calculateProgress(goalDate);
  }, [goalDate]);

  const calculateProgress = (date) => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetDate = new Date(date);

    const totalDays = Math.ceil((targetDate - startDate) / (1000 * 60 * 60 * 24));
    const passed = Math.max(0, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)));
    const remaining = Math.max(0, totalDays - passed);

    setDaysPassed(passed);
    setDaysLeft(remaining);
    setProgress(Math.min(passed / totalDays, 1));
  };

  const onDateChange = async (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate.getDate() > new Date().getDate()) {

      setGoalDate(selectedDate);
      await AsyncStorage.setItem("goalDate", selectedDate.toISOString());
    }
  };

  const resetDate = async () => {
    setGoalDate(null);
    setProgress(0);
    setDaysLeft(null);
    setDaysPassed(null);
    await AsyncStorage.removeItem("goalDate");
  };

  return (
    <View className="overflow-hidden  items-center">
      {/* Progress Bar */}
      <Pressable
        onPress={() => !goalDate && setShowPicker(true)}
        className="w-full"
      >
        <View className="relative items-center px-8">
          <Progress.Bar
            progress={goalDate ? progress : 0}
            width= {347}
            height={50}
            color="#3b82f6"   // Tailwind blue-500
            borderRadius={10}
            borderWidth={0}
            unfilledColor="#e5e7eb" // Tailwind gray-200
          />

          {/* Overlay Content */}
          <View className="absolute inset-0 flex justify-center items-center">
            {!goalDate ? (
              <>
              <Text className="text-gray-600 font-semibold"><Feather name="target" size={30}/></Text>
              <Text className="text-gray-600 font-semibold"> Select goal Date</Text>
              </>
            ) : (
              <View className="items-center">
                <Text className="text-sm font-semibold text-black">
                  {(progress * 100).toFixed(1)}% passed
                </Text>
                <Text className="text-xs text-gray-700 mb-1">
                  {daysPassed} {daysPassed >1 ? "days" : "day"} passed | {daysLeft} left
                </Text>

                {/* Reset Button */}
                
              </View>
            )}
            {goalDate && 
            <Pressable
                  onPress = {resetDate}
                  className="absolute left-8 flex justify-center items-center p-2 bg-red-500 h-[40px] w-[40px] rounded-full"
                >
                  <Text className="text-white text-xs font-semibold">
                    Reset
                  </Text>
                </Pressable>
              }
          </View>
        </View>
      </Pressable>

      {/* Date Picker */}
      {showPicker && (
        <DateTimePicker
          value={goalDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={onDateChange}
        />
      )}
    </View>
  );
}
