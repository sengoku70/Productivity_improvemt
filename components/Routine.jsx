import React,{useState} from 'react';
import { View, Text, Pressable,TextInput,ScrollView, Touchable, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';




const Routine = () => {
    const [rtitle, setRtitle] = useState([]);
    
    const [form, setForm] = useState(false);
    const [from, setFrom] = useState();
    const [title , settitle] = useState('');
    const [to, setTo] = useState();
    const [fromtime, setfromtime] = useState('AM');
    const [totime, settotime] = useState('AM');
   
    const rtime = () => {

        let arr = [...rtitle]; 
        const newfrom = fromtime == 'AM' ? from : JSON.parse(from) + 12;
        const newto = totime == 'AM' ? to : JSON.parse(to) + 12;
        console.log(newfrom,newto);
        for(let i=newfrom;i<=newto;i++){
            
            arr[i] = title;
            
        }
        
        setRtitle(arr);
        settitle('');
        setFrom('');
        setTo('');
        
       
                
      
    }
    const date = new Date();
    const currentHour = date.getHours();
    let color = ''; 
    
    const find = (num)=>{

        if(num === currentHour){
            color = 'bg-blue-400';
            //console.log(color);
            return rtitle[num] ?  rtitle[num] :  true;
            
        }
        
        if(rtitle[num] != ''){
            color = 'bg-indigo-300';
            return rtitle[num];
           
        }

       

    }

    
    React.useEffect(() => {
        const loadData = async () => {
            try {
                const storedRtitile = await AsyncStorage.getItem('rtitle');
                if (storedRtitile !== null) setRtitle(JSON.parse(storedRtitile));
     
               
            } catch (e) {
                console.log('Failed to load data', e);
            }
        };
        loadData();
    }, []);

    React.useEffect(() => {
        const saveData = async () => {
            try {
                await AsyncStorage.setItem('rtitle', JSON.stringify(rtitle));
          
            } catch (e) {
                console.log('Failed to save data', e);
            }
        };
        saveData();
    }, [rtitle]);



    const clearData = async () => {
        
        let arr = [...rtitle]; 
        const newfrom = fromtime == 'AM' ? from : JSON.parse(from) + 12;
        const newto = totime == 'AM' ? to : JSON.parse(to) + 12;
       
        for(let i=newfrom;i<=newto;i++){
            
            arr[i] = '';
            
        }
        
        setRtitle(arr);
        setFrom();
        setTo(); 
        settitle('');
        
    }
      

    return (
    <View>
       <ScrollView className='h-screen overflow-hidden w-screen'>

            <View className='h-screen w-screen  flex mt-[30px] rounded-md flex-col flex-wrap gap-1 pl-[3%]'>
                    {Array.from({length:24},(_,i) => (
                        <View key={i} className={`flex flex-row rounded-md justify-start items-center px-[15px] ${find(i+1) ? `${color}` : 'bg-white' } border-neutral-400 shadow-lg w-[48%] h-[7.5%] `}>
                            <View className='bg-blue-500 rounded-full w-[50px] h-[50px] flex justify-center items-center shadow-2xl '>
                                <Text className='text-white'>{i>=12?(i)-11:i+1}{i>=12?" PM":" AM"}</Text>
                            </View>
                                <Text className=' ml-[15px]'>{find(i+1)}</Text>
                        </View>
                    ))}
            </View>
           
                {
                    form && (
                        <View className='absolute self-center rounded-md p-[10px] mt-[50%] bg-gray-100 flex justify-evenly h-fit gap-2 w-[200px] z-10'> 
                                <TextInput value={title} onChangeText={settitle} placeholder='title' className='w-full h-[50px] pl-2 bg-neutral-300 rounded-md '></TextInput>
                                <View className=' flex-row '>
                                <TextInput value={from} onChangeText={setFrom} placeholder='from' className='w-[80%] h-[50px] pl-2 bg-neutral-300 rounded-l-md '></TextInput>
                                <TouchableOpacity onPress={()=>{setfromtime(fromtime == 'AM' ? 'PM' : 'AM')}} className= 'flex justify-center items-center bg-blue-500 w-[20%] rounded-r-md'><Text className='text-white'>{fromtime}</Text></TouchableOpacity>
                                </View>
                                <View className=' flex-row '>
                                <TextInput value={to} onChangeText={setTo} placeholder='to' className='w-[80%] h-[50px] pl-2 bg-neutral-300 rounded-l-md '></TextInput>
                                <TouchableOpacity onPress={() => {settotime(totime == 'AM' ? 'PM' : 'AM')}} className='flex justify-center items-center bg-blue-500 w-[20%] rounded-r-md'><Text className='text-white'>{totime}</Text></TouchableOpacity>
                                </View>             
                                <View className='flex flex-row justify-between gap-2 items-center'>
                                <Pressable className='bg-blue-500 w-[48%] h-[50px] rounded-md' onPress={()=>{rtime();setForm(prev => !prev)}}>
                                    <Text className='py-4 text-center'>Add</Text>
                                </Pressable>
                                <Pressable className='bg-red-300 w-[48%] h-[50px] rounded-md' onPress={()=>{clearData();setForm(prev => !prev)}}>
                                    <Text className='py-4 text-center'>remove</Text>
                                </Pressable>
                                </View>

                                

                        </View>
                    )
                }
            


            
       </ScrollView>
                <Pressable onPress={()=>{setForm(prev => !prev)}} className='absolute bg-gray-200 border-blue-500 border-[3px] bottom-28 right-7 flex justify-center items-center h-[60px] w-[60px] rounded-full shadow-2xl'><Text><AntDesign name="plus" size={40} color="blue"/></Text></Pressable>

            
       </View>

    );
};


export default Routine;
