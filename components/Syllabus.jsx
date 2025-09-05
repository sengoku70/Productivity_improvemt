import React,{useState} from 'react';
import {View, Text, Pressable,TextInput,ScrollView } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Syllabus = () => {

const [syllabusarray, setSyllabusarray] = useState([]);
const [subtopicarray, setSubtopicArray] = useState([]);
const [syllabusName,setSyllabusName] = useState('');
const [subtopicName,setSubtopicName] = useState('');
const [ModalVisible, setmModalVisible] = useState(false);
const [editmode, seteditmode] = useState();
const [showtopics, Setshowtopics] = useState(false);
const [edittopic, setedittopic] = useState();

const handleAddSyllabus = () => {
    const arr = subtopicName.split(',').map(s => s.trim()).filter(s => s !== '');
    setSyllabusarray(prev => [...prev, syllabusName]);
    setSubtopicArray(prev => [...prev, arr]);
    console.log('subtopic array', subtopicarray);
    setSyllabusName(''); 
    setSubtopicName('');
    
//     console.log("syllabus array", syllabusarray);
//     console.log("subtopic array", subtopicarray);
};

const handleDeleteSyllabus = (index) => {
  setSyllabusarray(prev => {
    const copy = [...prev];
    copy.splice(index, 1);
    return copy;
  });

  setSubtopicArray(prev => {
    const copy = [...prev];
    copy.splice(index, 1);
    return copy;
  });
};


const delsubtopic = (i, j) => {
    setSubtopicArray(prev => 
        prev.map((subtopics, idx) => 
            idx === i ? subtopics.filter((_, k) => k !== j) : subtopics
        )
    );
  
};

const editsyllbus = (i) => {
    setSyllabusarray(prev => 
        prev.map((syllabus, idx) => idx === i ? syllabusName : syllabus)
    );
    setSyllabusName('');
    console.log('editsyllabus');
};

const edittopicfunc = (i, j) => {
    setSubtopicArray(prev =>
        prev.map((subtopics, idx) =>
            idx === i
                ? subtopics.map((topic, k) => k === j ? subtopicName : topic)
                : subtopics
        )
    );
    setSubtopicName('');
    console.log('editsubtopic');
};

 React.useEffect(() => {
        const saveData = async () => {
          console.log('Saving syllabus data',await AsyncStorage.getItem('syllabus'));
          console.log('Saving subtopic data',await AsyncStorage.getItem('subtopic'));
            try {
                await AsyncStorage.setItem('syllabus', JSON.stringify(syllabusarray));
                await AsyncStorage.setItem('subtopic', JSON.stringify(subtopicarray));
            } catch (e) {
                console.log('Failed to save syllabus data', e);
            }
        };
        saveData();
    }, [syllabusarray,subtopicarray]);



  React.useEffect(() => {
        const loadData = async () => {
            console.log('Loading syllabus data', await AsyncStorage.getItem('syllabus'));
            console.log('Loading subtopic data', await AsyncStorage.getItem('subtopic'));
            
            try {  
                const syllabus = await AsyncStorage.getItem('syllabus');
                const subtopic = await AsyncStorage.getItem('subtopic');
                if (syllabus && subtopic) {
                    setSyllabusarray(prev=>[...prev,...JSON.parse(syllabus)]);
                    setSubtopicArray(prev=>[...prev,...JSON.parse(subtopic)]);
                }
            } catch (e) {
                console.log('Failed to load syllabus data', e);
            }
        };
        loadData();
    }, []);

    
   


return (
        <ScrollView className="flex-1 h-screen">
            {/* Combined Syllabus and Subtopics Section */}


            <View className="flex p-4 h-screen mt-[60px]">
                <Text className="text-2xl font-bold mb-4 overflow-visible text-white"> Syllabus </Text>
                <View>
                    {
                        syllabusarray.map((item, i) => (
                            
                            <Pressable onPress={() => {Setshowtopics(prev => (prev === i ? null : i))}} key={i}  className={`mb-2 flex flex-col items-end bg-white px-4 py-[9px] rounded-md ${showtopics==i?" h-fit pb-[50px]":"h-[50px] overflow-hidden"}`}>
                                <View className={`flex flex-row items-center w-full `}>
                                <AntDesign name='book' size={30}/>
                                { editmode === i ? <TextInput
                                    value={syllabusName}
                                    onChangeText={(text) => {setSyllabusName(text)}}
                                    className="border border-gray-300 rounded-md outline-none w-[70%]"
                                /> : <Text className="text-black ml-[10px]">{item}</Text>
                                
                                }
                                
                                
                                <View className="flex flex-row items-center gap-5 ml-auto">
                                    
                                    {editmode === i ?
                                    <Pressable onPress={()=>{editsyllbus(i),seteditmode()}} >
                                        <AntDesign name="check" size={20} color="blue" />
                                     </Pressable>
                                     :
                                    <Pressable onPress={()=>{seteditmode(i)}} >
                                        <AntDesign name="edit" size={20} color="black" />
                                     </Pressable>
                                    }   


                                <Pressable onPress={()=>{handleDeleteSyllabus(item)}}>
                                    <AntDesign name="delete" size={20} color="black" />
                                </Pressable>
                                </View>
                                </View>
                                {
                                    showtopics === i && subtopicarray[i] && subtopicarray[i].length > 0 ? (
                                    <View className='flex flex-col rounded-md overflow-hidden items-start w-[90%] mt-4'>


                                        {subtopicarray[i].map((subtopic, j) => (
                                            <View className='bg-gray-200 px-[5px] justify-between border-b-[1px] border-gray-2 h-[40px] w-full flex flex-row items-center gap-2' key={j}>
                                                { edittopic === j ? 
                                                <TextInput
                                                    value={subtopicName}
                                                    onChangeText={(text) => {setSubtopicName(text)}}
                                                    className="border border-gray-300 rounded-md w-[70%]"

                                                /> :<Text key={j} className=' text-black'>{subtopic}</Text>
                                                }


                                                <View className='flex flex-row items-center gap-5'>
                                                {edittopic === j ?
                                                    <Pressable onPress={()=>{edittopicfunc(i,j),setedittopic()}} >
                                                        <AntDesign name="check" size={16} color="blue" />
                                                    </Pressable>
                                                    :
                                                    <Pressable onPress={()=>{setedittopic(j)}} >
                                                        <AntDesign name="edit" size={16} color="black" />
                                                    </Pressable>
                                                    } 
                                                <Pressable onPress={() => {delsubtopic(i,j)}}>
                                                    <AntDesign name='close' size={16}/>
                                                </Pressable> 
                                            
                                            </View>
                                            </View>
                                            
                                        ))}
                                        
                                    </View>
                                ) : null
                                }
                            
                            <Pressable
                                        className="absolute bottom-5 mr-[85px] bg-blue-600 rounded-full h-[30px] w-[30px] shadow-emerald-900 flex justify-center items-center "
                                        onPress={() => {
                                            Setshowtopics(prev => i);
                                            setedittopic(subtopicarray[i].length);
                                            subtopicarray[i].push(`untitled${i}`);
                                            edittopicfunc(i, subtopicarray[i].length);
                                            
                                            
                                        }}>
                                        
                                        <Text className="text-white font-bold text-center"><AntDesign name="plus" size={30}/></Text>
                            </Pressable>
                            </Pressable>
                        ))
                    }
                </View>
                
            </View>
            {/* Button to open model box */}

            {ModalVisible && (

                <View className="absolute top-0 left-0 right-0 bottom-0 bg-violet-900/50  flex items-center gap-2 justify-center">
                    <View className="bg-white p-[10px] rounded-lg w-[85%] flex items-center gap-2">
                        <Text className="text-lg font-bold">Add Syllabus</Text>
                        <TextInput          
                            placeholder="Syllabus Name"
                            value={syllabusName}
                            onChangeText={setSyllabusName}
                            className="border border-gray-300 w-full rounded-md "      

                        />
                        <View className='flex flex-row items-center h-40px overflow-hidden'>
                        <TextInput          
                            placeholder="subtopic Name"
                            value={subtopicName}
                            onChangeText={setSubtopicName}
                            className="border border-gray-300 rounded-l-md w-[90%] h-[40px]"      

                        />

                        <Pressable className='W-[40%] bg-green-400 rounded-r-md w-[10%] h-[40px] flex items-center justify-center'>
                            <Text ><AntDesign  name='plus' size={30}/></Text>
                        </Pressable>

                        </View>



                        <View className='flex flex-row w-full justify-between'>
                        <Pressable  
                            onPress={()=>(handleAddSyllabus(), setmModalVisible(false))}
                            className="bg-blue-600 rounded-md flex flex-row items-center justify-center h-[40px] w-[48%]"
                        >
                            <Text className="text-white text-center">Add Syllabus</Text>
                        </Pressable>
                        <Pressable  
                            onPress={() => setmModalVisible(false)}
                            className="bg-gray-300 rounded-md flex flex-row items-center justify-center h-[40px] w-[48%]"
                        >
                            <Text className="text-black text-center">Close</Text>
                        </Pressable>
                        </View>
                    </View>
                </View>
            )

            }
            {/* print all the async data saved  */}
            <Pressable onPress={()=>{

            async function getAllData() {
                try {
    
                const keys = await AsyncStorage.getItem('syllabus');
                const keys2 = await AsyncStorage.getItem('subtopic');
                //console.log('syllabus:', keys);
                console.log('subtopic:', keys2);
            
            } catch (e) {
                console.error("Error fetching AsyncStorage data", e);
            }
        };
        getAllData();
         
        }}  className=' bg-red-500 h-[50px] rounded-md w-[48%]  ml-[20px] flex items-center justify-center'>
            <Text className='text-white text-center'>show All Data</Text>
        </Pressable>
        <Pressable onPress={()=>{

        async function clearAllData() {
        try {
        await AsyncStorage.removeItem('syllabus');
        await AsyncStorage.removeItem('subtopic');
        setSyllabusarray([]);
        setSubtopicArray([]);
        console.log('All syllabus and subtopic data deleted');
        } catch (e) {
        console.error("Error clearing AsyncStorage data", e);
        }
        }
        clearAllData();
         
        }}  className=' ml-[52%] bg-blue-500 h-[50px] rounded-md w-[48%] mt-4 flex items-center justify-center'>
            <Text className='text-white text-center'>Delete All Data</Text>
        </Pressable>





            <View className="absolute mt-[190%] right-5 items-center z-5">
                <Pressable
                    className="bg-blue-600 rounded-full h-[60px] w-[60px] shadow flex justify-center items-center "
                    onPress={() => setmModalVisible(prev => !prev)}
                >
                    <Text className="text-white font-bold text-center"><AntDesign name="plus" size={60}/></Text>
                </Pressable>
               
            </View>

            </ScrollView>
        
    );
};



export default Syllabus;
