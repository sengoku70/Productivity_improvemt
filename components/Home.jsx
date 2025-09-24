import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal,Pressable,Animated, Easing} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign,Feather  } from '@expo/vector-icons';
import Timetable from './Timetable';


// Helper to generate random light vibrant colors
const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 90%, 80%)`;
};




const NOTES_KEY = 'STICKY_NOTES';


export default function Home() {
    const [notes, setNotes] = useState([]);
    const [modalVisible, setModalVisible] = useState(null); 
    const [noteText, setNoteText] = useState('');
    const [Rdata, setRdata] = useState('No routine set for this hour');
    const [today, setToday] = useState('0');
    const [datetoday,setdatetoday] = useState();
    const [question, setQuestion] = useState('0');
    const [Xp, setXp] = useState(0);
    const [editingNoteId, setEditingNoteId] = useState(null);
    
    
    //////////////////////////////
    
        
    const incxp = () => {
        if(datetoday == new Date().getDate()){
            setToday(prev => parseInt(prev) + 1);
        }else{
            setToday(0);
        }
        
        setdatetoday(new Date().getDate()) 
        setQuestion(prev => parseInt(prev) + 1);
       
        let newXp = 0;
        if (today < 30) {
            newXp = Xp + 4;

        }else if(today < 40 && today >= 30   ) {
            newXp = Xp + 5;
            
        }else{
            newXp = Xp + 6;

        }
        setXp(newXp);

    }

    
////////////////////////////////////////////////////////
    React.useEffect(() => {
        
        let datetoday = new Date().getDate();
        const loadData = async () => {
            try {
                const storedToday = await AsyncStorage.getItem('today');
                const storedQuestion = await AsyncStorage.getItem('question');
                const storedXp = await AsyncStorage.getItem('Xp');
                if (storedToday !== null) setToday(storedToday);
                if (storedQuestion !== null) setQuestion(storedQuestion);
                if (storedXp !== null) setXp(parseInt(storedXp));
            } catch (e) {
                console.log('Failed to load data', e);
            }
        };
        loadData();
        
    }, []);
/////////////////////////////////////////////////////////////////////////
    React.useEffect(() => {
        
        const saveData = async () => {
            try {
                
                await AsyncStorage.setItem('today', today.toString());
                await AsyncStorage.setItem('question', question.toString());
                await AsyncStorage.setItem('Xp', Xp.toString());
            } catch (e) {
                console.log('Failed to save data', e);
            }
        };
        saveData();
    }, [today, question, Xp]);
      
   
    //////////////////// Load notes from AsyncStorage//////////////////////////////
    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem(NOTES_KEY);
            let data  = JSON.parse(await AsyncStorage.getItem('rtitle'));
            setRdata(data[new Date().getHours()] ? data[new Date().getHours()] : "No routine set for this hour");
            if (saved) setNotes(JSON.parse(saved));
            
        })();
    }, []);
    

    // Save notes to AsyncStorage
    const saveNotes = async (newNotes) => {
        setNotes(newNotes);
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
    };

    const addNote = () => {
        
       
            const color = getRandomColor();
            const newNote = {
                id: Date.now().toString(),
                text: noteText.trim(),
                color,
            };
        const updatedNotes = [newNote, ...notes];
        setNoteText('');
        saveNotes(updatedNotes);
        setEditingNoteId(newNote.id);
        
    };

    // Remove note by id
    const removeNote = (id) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        saveNotes(updatedNotes);
    };

    // Split notes into two columns based on index
    const leftNotes = notes.filter((_, idx) => idx % 2 === 0);
    const rightNotes = notes.filter((_, idx) => idx % 2 === 1) ;

  

    // Save edited note
    const saveEditedNote = () => {
        
        const updatedNotes = notes.map(note =>
            note.id === editingNoteId ? { ...note, text: noteText } : note
        );
        saveNotes(updatedNotes);
        setEditingNoteId(null);
        setNoteText('');
        
       
    };

    return (
        <View className="flex-1 pt-12 ">
            {/* Floating Add Note Button */}
            <TouchableOpacity
                className="absolute z-10 bg-gray-300 border-blue-500 border-[3px] h-16 w-16 justify-center items-center rounded-full bottom-28 right-3 shadow-lg"
                onPress={() => { 
                    addNote();
                    
                }}
            >
                <AntDesign name="plus" size={36} color="black" />
            </TouchableOpacity>
            <View className='w-screen'><Timetable/></View>
            <ScrollView
                className="flex-1 h-screen "
                contentContainerStyle={{
                    flexDirection: 'row',
                    padding: 8,
                    
                }}
            >

                
                {/* Left Column */}
                <View className="w-1/2">
                    {/* Stats Card */}
                    <View className="bg-blue-600 pl-3 pt-3 m-2 rounded-xl overflow-hidden">
                        <View className="gap-2 items-start">
                            <Text className="text-[17px] text-white">
                                <Feather name="box" size={20} color="white" /> Questions : {question}
                            </Text>
                            <Text className="text-[17px] text-white">
                                <Feather name="sun" size={20} color="orange" /> Today : {today}
                            </Text>
                            <Text className="text-[17px] text-white mb-3">
                                <Feather name="star" size={20} color="red" /> Xp: {Xp}
                            </Text>
                            <Pressable
                                className="bg-indigo-300 rounded-xl h-10 rounded-bl-none rounded-tr-none absolute right-0 bottom-0 w-10 shadow-lg justify-center items-center"
                                onPress={incxp}
                            >
                                <AntDesign name="plus" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    {/* Notes */}
                    {leftNotes.map(note => (
                        <TouchableOpacity
                            key={note.id}
                            onPress={() => {
                               
                                setModalVisible(note.id); 
                             
                            }}
                            activeOpacity={0.8}
                        >
                            <View
                                className="m-2 rounded-2xl p-3 max-h-36 w-[92%] justify-center shadow"
                                style={{ backgroundColor: note.color }}
                            >
                                <View className="flex-col justify-between items-start h-full">
                                    <View className="flex-row justify-between w-full">
                                        <TouchableOpacity
                                            onPress={() => removeNote(note.id)}
                                            className="mb-2"
                                            accessibilityLabel="Cut note"
                                        >
                                            <AntDesign name="close" size={20} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setNoteText(note.text);
                                                setEditingNoteId(note.id);    
                                                
                                                
                                                
                                            }}
                                            className="mb-2 ml-2"
                                            accessibilityLabel="Edit note"
                                        >
                                            <AntDesign name="edit" size={20} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text className="text-gray-800 flex-1">{note.text}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Right Column */}
                <View className="w-1/2 flex flex-col">
                    {/* Routine Card */}
                    <View className="h-16 flex-row justify-evenly items-center px-3 bg-indigo-300 m-2 rounded-xl shadow">
                        <View className="bg-blue-500 rounded-full h-12 w-12 border-dotted border-2 border-white justify-center items-center">
                            <Text className="text-lg font-bold text-white">
                                {new Date().getHours() > 12 ? new Date().getHours() - 12 : new Date().getHours()}
                            </Text>
                        </View>
                        <Text className="text-base font-normal w-2/3 ml-4">{Rdata}</Text>
                    </View>
                    {/* Notes */}
                    {rightNotes.map(note => (
                        <TouchableOpacity
                            key={note.id}
                            onPress={() => {
                  
                                setModalVisible(note.id);
                            }}
                            activeOpacity={0.8}
                        >
                            <View
                                className="m-2 rounded-2xl p-3 max-h-36 w-[92%] justify-center shadow"
                                style={{ backgroundColor: note.color }}
                            >
                                <View className="flex-col justify-between items-start h-full">
                                    <View className="flex-row items-center justify-between w-full">
                                        <TouchableOpacity
                                            onPress={() => removeNote(note.id)}
                                            className="mb-2"
                                            accessibilityLabel="Cut note"
                                        >
                                            <AntDesign name="close" size={20} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setEditingNoteId(note.id);
                                                setNoteText(note.text);
                                                
                                               
                                            }}
                                            className="mb-2 ml-2"
                                            accessibilityLabel="Edit note"
                                        >
                                            <AntDesign name="edit" size={20} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text className="text-gray-800 flex-1">{note.text}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Note View Modal */}





            <Modal
                visible={modalVisible !== null}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setModalVisible(null);
                    setEditingNoteId(null);
   
                }}
            >
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View
                        className="w-4/5 max-w-[380px] min-w-[320px] max-h-[70%] bg-white rounded-3xl p-5 shadow-lg"
                        style={{
                            backgroundColor: notes.find(n => n.id === modalVisible)?.color || '#fff',
                        }}
                    >
                        <ScrollView className="max-h-72">
                            <Text className="text-lg text-gray-900 mb-4">
                                {notes.find(n => n.id === modalVisible)?.text}
                            </Text>
                        </ScrollView>
                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                className="border-[1px] border-white px-4 py-2 rounded-xl mr-2"
                                onPress={() => {
                                    setModalVisible(null);
   
                                }}
                            >
                                <Text className="text-white  font-bold">Close</Text>
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add/Edit Note Modal */}
            <Modal
                visible={editingNoteId !== null}
                transparent
                animationType="slide"
            >
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View className="bg-white w-72 rounded-3xl p-5 shadow-lg">
                        <TextInput
                            className="min-h-[60px] border border-gray-200 rounded-xl p-3 mb-4 text-base bg-gray-50"
                            placeholder="Type your note..."
                            value={noteText}
                            onChangeText={setNoteText}
                            multiline
                            textAlignVertical="top"
                        />
                        <View className="flex-row justify-between">


                            <TouchableOpacity
                                className="bg-green-600 px-4 py-2 rounded-xl min-w-[48%] items-center"
                                onPress={() => {
                                    if(noteText.trim() != ''){
                                     console.log("note: " ,noteText);
                                     saveEditedNote()
                                     setEditingNoteId(null);
                                     setNoteText('');
                                    }
                                 } }
                              >
                             
                                <Text className="text-white font-bold">Save</Text>
                            </TouchableOpacity>



                            <TouchableOpacity
                                className="bg-red-400 px-4 py-2 rounded-xl min-w-[48%] items-center"
                                onPress={() => {
                                     const textinnote =  notes.find(note => note.id === editingNoteId)?.text || "";
                                   
                                    if(noteText.trim()=='' && textinnote == ''){
                                        removeNote(editingNoteId);
                                        setEditingNoteId(null);

                                        
                                    }else{ 
                                        
                                        setNoteText(notes.find(note => note.id === editingNoteId)?.Text || "")
                                        //console.log("cancel when note is not empty:",notes.find(note => note.id === editingNoteId)?.text || "", " editing noteid",editingNoteId)
                                        if(textinnote === ''){
                                           removeNote(editingNoteId);
                                        }
                                        setEditingNoteId(null);
                                        setNoteText('');
                                      
                                    }
                                }
                                }
                            >
                                <Text className="text-white font-bold">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
