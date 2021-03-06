import React, {useEffect, useState} from 'react';
import CodePush from 'react-native-code-push';
import {StyleSheet, View, Alert} from 'react-native';

import {Screen, Text, Spacer, Button} from '../components';
import {DEPLOYMENT_KEY} from '../constants';

const S = StyleSheet.create({
  info: {flexDirection: 'row'},
  headline: {textAlign: 'center', fontWeight: 'bold'},
});

function AppInfoScreen() {
  const [packageMetadata, setPackageMetadata] = useState({});

  useEffect(() => {
    async function getPackageMetadata() {
      const data = await CodePush.getCurrentPackage();
      console.log({data});
      if (data) {
        setPackageMetadata(data);
      }
    }
    getPackageMetadata();
    // call once loaded
  }, []);
  const handleCheckForUpdatePress = async () => {
    CodePush.checkForUpdate(DEPLOYMENT_KEY).then((update) => {
      if (!update) {
        Alert.alert('', 'The app is up to date!');
      } else {
        Alert.alert('', 'An update is available! ');
      }
    });
  };
  const metadata = packageMetadata ? Object.keys(packageMetadata) : [];

  const notAvailable = __DEV__;

  if (notAvailable) {
    <Screen>
      <Spacer medium />
      <Text large secondaryColor style={S.headline}>
        Not available in DEV enviroment
      </Text>
      <Spacer medium />
    </Screen>;
  }

  return (
    <Screen>
      <Spacer medium />
      <Button title="Check for update" onPress={handleCheckForUpdatePress} />
      <Spacer medium />

      <Text large secondaryColor style={S.headline}>
        Package metadata
      </Text>
      {metadata
        .filter((key) => typeof packageMetadata[key] !== 'function')
        .map((key) => {
          let value = packageMetadata[key];
          if (typeof packageMetadata[key] === 'boolean') {
            value = packageMetadata[key] ? 'true' : 'false';
          }
          return (
            <>
              <Spacer medium />
              <View style={S.info}>
                <Text>{key}</Text>
                <Spacer medium />
                <Text secondaryColor>{value}</Text>
              </View>
            </>
          );
        })}
    </Screen>
  );
}

export default AppInfoScreen;
