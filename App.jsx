import React from 'react';
import {View} from 'react-native';
import './global.css';
import { Provider } from "react-redux";
import store from "./src/store.js";
import Xp from './components/Xp'; 

 export default function App() {

  return (
    <Provider store={store}>
        
     <View className='absolute z-20 h-screen w-screen'><Xp/></View>
    </Provider>
  );
}