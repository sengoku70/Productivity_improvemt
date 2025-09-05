import React,{useEffect, useState} from 'react';
import { ImageBackground,Pressable, ScrollView,StyleSheet, Dimensions,Text, View,TouchableOpacity } from 'react-native';
import './global.css';
import Xp from './components/Xp'; 
import Timetable from './components/Timetable';
import Daytime from './components/Daytime';
import Syllabus from './components/Syllabus';
import Home from './components/Home';
import { AntDesign,Feather } from '@expo/vector-icons';
import Routine from 'components/Routine';

//import * as Notifications from 'expo-notifications';




export default function App() {

// useEffect(() => {
//     // Ask permission
//     sendNotification();
//     Notifications.requestPermissionsAsync();
//   }, []);

//   const sendNotification = async () => {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Hello Baibhav 👋",
//         body: "Welcome to Study Buddy! Let's start your learning journey.",
//       },
//       trigger: null, // fire immediately
//     });
// };


  const [Retract,setRetract]  = useState(true);
  const [page, setPage] = useState('Home');
  
  const { height, width } = Dimensions.get("window");

  return (
    <View>
      


    <ScrollView className = {`h-screen w-screen `} >
      
      
      <Pressable  onPress={() => {setRetract(prev=>!prev)}}  className={`Sidebar bg-blue-100 h-screen absolute z-50 gap-2 p-2 pb-[50px] w-screen mt-[25px] flex justify-start flex-col
        ${Retract ? 'translate-x-[-100%]' : 'translate-x-0 '}`} >

        <Pressable  className={`flex flex-row px-[20px] justify-between items-center w-full h-[60px]
          ${Retract ? 'translate-x-[100%] translate-y-[1250%] w-screen bg-blue-100 absolute ' : 'translate-x-0 opacity-0'}`} >

          <Text onPress={()=>{setPage('Home')}} className='  text-[20px] h-fit  bg-blue-500 p-[3px] rounded-md'><AntDesign name="home" className='' size={30} color={page == "Home"?"black":"white"} /></Text>
          
          <Text onPress={()=>{setPage('Timetable')}} className='  text-[20px] h-fit  bg-blue-500 p-[3px] rounded-md '> <AntDesign name="table" size={30} color={page == "Timetable"?"black":"white"} /> </Text> 
          <Text onPress={()=>{setPage('routine')}} className='  text-[20px] h-fit  bg-blue-500 p-[3px] rounded-md ' > <Feather name="clock" size={30} color={page == "routine"?"black":"white"} /> </Text> 
          <Text onPress={()=>{setPage('Syllabus')}} className='  text-[20px] h-fit  bg-blue-500 p-[3px] rounded-md ' > <AntDesign name="book" size={30} color={page == "Syllabus"?"black":"white"} /> </Text> 
          <Text onPress={() => {setRetract(prev => !prev)}} className='  text-[20px] bg-blue-500 p-[3px] h-fit  rounded-md ' > <AntDesign name="bars" size={30} color="white" /> </Text> 
        </Pressable>
        <Pressable  onPress={()=>{setPage('Home');setRetract(prev => !prev)}}  className="h-[70px] flex flex-row items-center  text-white font-bold pl-2 rounded-md bg-blue-500"><Feather name="home" size={30} color="white" /><Text className='text-white font-bold flex text-[30px] ml-[20px]'>Home</Text></Pressable>
 
        <Pressable  onPress={()=>{setPage('Timetable');setRetract(prev => !prev)}}  className="h-[70px] flex flex-row items-center  text-white font-bold pl-2 rounded-md bg-blue-500"><AntDesign name="table" size={30} color="white" /><Text className='text-white font-bold flex text-[30px] ml-[20px]'>Streak</Text></Pressable>

        <Pressable  onPress={()=>{setPage('daytime');setRetract(prev => !prev)}}  className="h-[70px] flex flex-row items-center text-white font-bold pl-2 rounded-md bg-blue-500"><Feather name="sun" size={30} color="white" /><Text className='text-white font-bold flex text-[30px] ml-[13px]'> Day time</Text></Pressable>

        <Pressable  onPress={()=>{setPage('routine');setRetract(prev => !prev)}}  className="h-[70px] flex flex-row items-center text-white font-bold pl-2 rounded-md bg-blue-500"><Feather name="clock" size={30} color="white" /><Text className='text-white font-bold flex text-[30px] ml-[20px]'>Routine</Text></Pressable>

        <Pressable  onPress={()=>{setPage('Syllabus');setRetract(prev => !prev)}}  className="h-[70px] flex flex-row items-center text-white font-bold pl-2 rounded-md bg-blue-500"><Feather name="book" size={30} color="white" /><Text className='text-white font-bold flex text-[30px] ml-[20px]'>Syllabus</Text></Pressable>

        <Pressable  onPress={()=>{setPage('Settings');setRetract(prev => !prev)}}  className="h-[70px] flex flex-row mt-auto  items-center text-white font-bold px-3 rounded-md bg-blue-500">
           
              <ImageBackground className='bg-white h-[50px] w-[50px] rounded-full'></ImageBackground>
              <Text className='ml-3 text-[20px] text-white'>username</Text>
              <TouchableOpacity className='ml-auto'><Feather name="settings" size={30} color="white" /></TouchableOpacity>

        </Pressable>
        
      </Pressable>
     
      {page === 'Home' && <Home />}
      {page === 'Xp' && <Xp />}
      {page === 'Timetable' && <Timetable />}
      {page === 'daytime' && <Daytime />}
      {page === 'routine' && <Routine />}
      {page === 'Syllabus' && <Syllabus />}

          
    </ScrollView>

    



   
    </View>
  );
}

