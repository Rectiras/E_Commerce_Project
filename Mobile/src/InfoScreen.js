import {SafeAreaView, View, Text, Image} from 'react-native';
import React from 'react';
import {Container, Header} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

function InfoScreen({navigation}) {

    const onBackPressed = () => {
        navigation.navigate('ProductsScreen');
    }


    return (
        <Container style={{backgroundColor: '#343a40'}}>
            <Header style={{
                flexDirection: 'row',
                backgroundColor: '#343a40',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>

                <Icon.Button
                    name="chevron-left"
                    backgroundColor="#343a40"
                    onPress={() => onBackPressed()}>
                </Icon.Button>

                <Text style={{textAlign: 'center', fontSize: 25, color: '#FFFF'}} onPress={onBackPressed}></Text>

                <Text> </Text>

            </Header>
            <SafeAreaView style={{flex: 1, backgroundColor: 'white', textAlign: 'center'}}>
                <View style={{alignItems: 'center', backgroundColor: 'white', marginTop: 100}}>
                    <Image source={require('./images/sumed_logo.jpg')}
                           style={{width: 360, height: 150}}/>
                </View>
                <View style={{marginTop: 60, margin: 4}}>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Sabancı Üniversitesi Kampüsü</Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>UC 1093</Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Orta Mah. Üniversite Cad.</Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>No.27 Orhanlı – Tuzla</Text>

                    <Text style={{
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 8
                    }}>sumed@sabanciuniv.edu</Text>
                    <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>0216 483 9497</Text>
                </View>
            </SafeAreaView>
            <Text style={{
                marginBottom: 30,
                marginTop: 15,
                alignItems: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>Copyright © SUMED</Text>
        </Container>
    );

}


export default InfoScreen;