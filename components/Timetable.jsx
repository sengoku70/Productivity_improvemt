import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Timetable = () => {
    // syllabus: [{ title: string, subtopics: string[] }]
    const [syllabus, setSyllabus] = useState([]);
    const [subjectInput, setSubjectInput] = useState('');
    const [subtopicInput, setSubtopicInput] = useState('');
    const [showSubjectInput, setShowSubjectInput] = useState(false);
    const [selectedSubjectIdx, setSelectedSubjectIdx] = useState(null);
    const [editingSubtopicIdx, setEditingSubtopicIdx] = useState(null);

    React.useEffect(() => {
        AsyncStorage.getItem('syllabus').then(data => {
            if (data) setSyllabus(JSON.parse(data));
        });
    }, []);

    const saveSyllabus = async (newSyllabus) => {
        setSyllabus(newSyllabus);
        await AsyncStorage.setItem('syllabus', JSON.stringify(newSyllabus));
    };

    // Add or edit subject
    const addOrEditSubject = () => {
        if (!subjectInput.trim()) return;
        let updated;
        if (selectedSubjectIdx !== null) {
            updated = syllabus.map((item, idx) =>
                idx === selectedSubjectIdx ? { ...item, title: subjectInput } : item
            );
            setSelectedSubjectIdx(null);
        } else {
            updated = [...syllabus, { title: subjectInput, subtopics: [] }];
        }
        setSubjectInput('');
        setShowSubjectInput(false);
        saveSyllabus(updated);
    };

    // Delete subject
    const deleteSubject = (idx) => {
        const updated = syllabus.filter((_, i) => i !== idx);
        saveSyllabus(updated);
    };

    // Start editing subject
    const startEditSubject = (idx) => {
        setSubjectInput(syllabus[idx].title);
        setSelectedSubjectIdx(idx);
        setShowSubjectInput(true);
    };

    // Add or edit subtopic
    const addOrEditSubtopic = (subjectIdx) => {
        if (!subtopicInput.trim()) return;
        let updated = [...syllabus];
        if (editingSubtopicIdx !== null) {
            updated[subjectIdx].subtopics[editingSubtopicIdx] = subtopicInput;
            setEditingSubtopicIdx(null);
        } else {
            updated[subjectIdx].subtopics.push(subtopicInput);
        }
        setSubtopicInput('');
        saveSyllabus(updated);
    };

    // Delete subtopic
    const deleteSubtopic = (subjectIdx, subIdx) => {
        let updated = [...syllabus];
        updated[subjectIdx].subtopics = updated[subjectIdx].subtopics.filter((_, i) => i !== subIdx);
        saveSyllabus(updated);
    };

    // Start editing subtopic
    const startEditSubtopic = (subjectIdx, subIdx) => {
        setSubtopicInput(syllabus[subjectIdx].subtopics[subIdx]);
        setSelectedSubjectIdx(subjectIdx);
        setEditingSubtopicIdx(subIdx);
    };
    // Track which subject's subtopics are expanded
    const [expandedSubjectIdx, setExpandedSubjectIdx] = useState(null);

    // Toggle expand/collapse for a subject
    const toggleExpandSubject = (idx) => {
        setExpandedSubjectIdx(expandedSubjectIdx === idx ? null : idx);
        setSelectedSubjectIdx(null);
        setEditingSubtopicIdx(null);
        setSubtopicInput('');
    };
    return (
        <View className="flex-1 bg-white pt-[34px] min-h-screen ">
            <Text className="text-2xl font-bold text-blue-600 m-4">Syllabus</Text>
            {syllabus.length === 0 && (
                <Text className="text-blue-600 text-center mt-8">No syllabus added yet.</Text>
            )}

            <ScrollView className="flex-1">
                {syllabus.map((subject, idx) => (
                    <Pressable
                        key={idx}
                        onPress={() => toggleExpandSubject(idx)}
                        className="bg-indigo-100 mx-4 my-2 rounded-lg p-3"
                    >
                        <View className="flex-row items-center">
                            <AntDesign
                                name={expandedSubjectIdx === idx ? "down" : "right"}
                                size={18}
                                color="#2563eb"
                                style={{ marginRight: 8 }}
                            />
                            <Text className="flex-1 text-indigo-900 text-base font-semibold">{subject.title}</Text>
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation && e.stopPropagation();
                                    startEditSubject(idx);
                                }}
                                className="mr-3"
                            >
                                <Feather name="edit" size={20} color="#2563eb" />
                            </Pressable>
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation && e.stopPropagation();
                                    deleteSubject(idx);
                                }}
                            >

                                <AntDesign name="delete" size={20} color="#2563eb" />
                            </Pressable>
                        </View>
                        
                        {/* Subtopics */}
                        {expandedSubjectIdx === idx && (
                            <View className="bg-white ml-[20px] gap-3 rounded-md p-[10px] mt-[20px]">
                                {subject.subtopics.map((sub, subIdx) => (
                                    <View key={subIdx} className="flex-row items-center">
                                        <Text className="flex-1 text-indigo-800">{sub}</Text>
                                        <Pressable
                                            onPress={(e) => {
                                                e.stopPropagation && e.stopPropagation();
                                                startEditSubtopic(idx, subIdx);
                                            }}
                                            className="mr-3"
                                        >
                                            <Feather name="edit" size={18} color="#2563eb" />
                                        </Pressable>
                                        <Pressable
                                            onPress={(e) => {
                                                e.stopPropagation && e.stopPropagation();
                                                deleteSubtopic(idx, subIdx);
                                            }}
                                        >
                                            <AntDesign name="delete" size={18} color="#2563eb" />
                                        </Pressable>
                                    </View>
                                ))}
                                {/* Add/Edit subtopic input */}
                                {selectedSubjectIdx === idx && (
                                    <View className="flex-row items-center mt-2">
                                        <TextInput
                                            value={subtopicInput}
                                            onChangeText={setSubtopicInput}
                                            placeholder="Add subtopic..."
                                            className="flex-1 bg-indigo-50 rounded-xl px-3 text-indigo-900 text-base"
                                            placeholderTextColor="#2563eb"
                                        />
                                        <Pressable
                                            onPress={() => addOrEditSubtopic(idx)}
                                            className="ml-2 bg-blue-600 rounded-full p-2 justify-center items-center"
                                        >
                                            <AntDesign name={editingSubtopicIdx !== null ? "check" : "plus"} size={18} color="#fff" />
                                        </Pressable>
                                    </View>
                                )}
                                {/* Add subtopic button */}
                                {selectedSubjectIdx !== idx && (
                                    <Pressable
                                        onPress={(e) => {
                                            e.stopPropagation && e.stopPropagation();
                                            // Toggle subtopic input for this subject
                                            if (selectedSubjectIdx === idx) {
                                                setSelectedSubjectIdx(null);
                                                setEditingSubtopicIdx(null);
                                                setSubtopicInput('');
                                            } else {
                                                setSelectedSubjectIdx(idx);
                                                setEditingSubtopicIdx(null);
                                                setSubtopicInput('');
                                            }
                                        }}
                                        className="mt-2 ml-4"
                                    >
                                        <Text className="text-blue-600">
                                            {selectedSubjectIdx === idx ? "- Cancel" : "+ Add subtopic"}
                                        </Text>
                                    </Pressable>
                                )}
                            </View>
                        )}
                    </Pressable>
                ))}
            </ScrollView>

            {/* Add/Edit subject input (shown only when showSubjectInput is true) */}
            {showSubjectInput && (
                
                    <View className="absolute bottom-96 right-6 left-6 flex-row items-center bg-white rounded-xl shadow-2xl p-2">
                        <TextInput
                            value={subjectInput}
                        onChangeText={setSubjectInput}
                        placeholder="Subject title..."
                        className="flex-1 bg-indigo-100 rounded-xl px-4 text-indigo-900 text-base"
                        placeholderTextColor="#2563eb"
                    />
                    <Pressable
                        onPress={addOrEditSubject}
                        className="ml-2 bg-blue-600 rounded-full p-2 justify-center items-center"
                    >
                        <AntDesign name={selectedSubjectIdx !== null ? "check" : "plus"} size={24} color="#fff" />
                    </Pressable>
                </View>
                
            )}

            {/* Add subject button */}
            {!showSubjectInput && (
                <Pressable
                    onPress={() => {
                        // Toggle subject input
                        if (showSubjectInput) {
                            setShowSubjectInput(false);
                            setSubjectInput('');
                            setSelectedSubjectIdx(null);
                        } else {
                            setShowSubjectInput(true);
                            setSubjectInput('');
                            setSelectedSubjectIdx(null);
                        }
                    }}
                    className="absolute bottom-0 right-6 bg-blue-600 rounded-full p-4 shadow-lg"
                >
                    <AntDesign name={showSubjectInput ? "close" : "plus"} size={24} color="#fff" />
                </Pressable>
            )}
        </View>
    );
};

export default Timetable;
