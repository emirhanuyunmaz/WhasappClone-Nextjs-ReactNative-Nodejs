import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useGetAllUserQuery, useGetDenemeQuery } from '../store/user/userStore';
import UserCard from '../components/UserCard';

export default function HomeScreen({navigation}) {

  const responseDeneme = useGetDenemeQuery()
  const responseAllUser = useGetAllUserQuery()
  const [dataList,setDataList] = useState([])

    /*
    *1 -> Kullanıcı listesi
    *2 -> 
    */

    // useEffect(() =>{

    //     if(responseDeneme.isSuccess){
    //       console.log("SSS::SS",responseDeneme.data)
    //     }
        
    //   },[responseDeneme.isFetching,responseDeneme.isError,responseDeneme.isSuccess])
      
      
      useEffect(() => {
        
        if(responseAllUser.isSuccess){
          console.log("SSAA::",responseAllUser.isSuccess)
          setDataList(responseAllUser.data.data) 
          // console.log(dataList.);
          console.log(dataList);
        
      }

    },[responseAllUser.isSuccess,responseAllUser.isFetching,responseAllUser.isError])
   

  return (
    <View style={styles.container} > 
       <FlatList
        style={styles.container}
        data={dataList}
        renderItem={({item}) =><UserCard user={item} navigation={navigation} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    gap:10
  }
})