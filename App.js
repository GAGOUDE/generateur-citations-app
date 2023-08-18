import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View, Linking, ScrollView, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Styles from './components/Styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import { RAPID_API_KEY } from '@env';
import ButtonPlayShare from './components/ButtonPlayShare';

export default function App() {

  const [quote, setQuote] = useState("...Loading");
  const [author, setAuthor] = useState("...Loading");
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voiceSelected, setVoiceSelected] = useState("fr-ca-x-caa-network");

  const rapidApiKey = RAPID_API_KEY;

  const randomQuote = async () => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
      }
    };

    fetch('https://quotes15.p.rapidapi.com/quotes/random/?language_code=fr', options)
      .then(response => response.json())
      .then(response => {
        setQuote(response.content)
        setAuthor(response.originator.name)
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    randomQuote();
  }, []);

  //===== Button Volume or speak
  // Settings
  useEffect(() => {
    const listAllVoiceOptions = async () => {
      let availableVoices = await Speech.getAvailableVoicesAsync();
      setVoices(availableVoices);
    };
    listAllVoiceOptions();
  }, [quote]);



  // PLAY VOICE
  const speakNow = () => {
    Speech.speak(quote, { voice: voiceSelected });
  }

  // STOP VOICE
  const speakStop = () => {
    Speech.stop();
  }

  //===== Button Copy text
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(quote);
  };

  //====== Twitter 
  const tweetNow = () => {
    const url = "https://twitter.com/intent/tweet?text=" + quote + " __Author : " + author;
    Linking.openURL(url);
  }

  return (
    <View style={Styles.container}>
      <SafeAreaView style={{ flex: 1, marginBottom: 20 }}>
        <ScrollView style={Styles.containerQuotes}>
          {/* HEADING */}
          <Text style={Styles.quoteHeading}>La Citation du Jour</Text>

          {/* QUOTE TEXT */}
          <FontAwesome5 name='quote-left' style={{ fontSize: 20, marginBottom: -12 }} color='#000' />
          <Text style={Styles.quoteText}>
            {quote}
          </Text>
          <FontAwesome5 name='quote-right' style={{ fontSize: 20, textAlign: 'right', marginTop: -20, marginBottom: 20 }} color='#000' />

          {/* QUOTE AUTHOR */}
          <Text style={Styles.quoteAuthor}>_auteur : {author}</Text>

          {/* NEW QUOTE BUTTON */}
          <TouchableOpacity
            onPress={randomQuote}
            style={Styles.newQuoteBtnContainer}>

            <Text style={Styles.newQuoteBtnText}>{isLoading ? "Loading..." : "Nouvelle citation"}</Text>
          </TouchableOpacity>

          {/* VOICE SELECTION */}
          <Text style={Styles.selectVoiceLabel}>Selectionner une langue</Text>
          <Picker
            style={Styles.selectVoice}
            selectedValue={voiceSelected}
            onValueChange={(itemValue, itemIndex) => setVoiceSelected(itemValue)}
          >
            {voices.map((voice) => (
              <Picker.Item
                label={voice.name}
                value={`${voice.name} (${voice.language})`}
                key={voice.identifier}
              />
            ))}
          </Picker>

          {/* OTHER BUTTONS */}
          <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginBottom: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 2, gap: 30 }}>
              {/* Play */}
              <ButtonPlayShare onPress={speakNow} iconName='play' textBtnDescription='PLAY' />

              {/* Stop */}
              <ButtonPlayShare onPress={speakStop} iconName='stop' textBtnDescription="STOP" />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8, gap: 55 }}>
              {/* Copy Text */}
              <ButtonPlayShare onPress={copyToClipboard} iconName='copy' textBtnDescription="COPIER" />

              {/* Share on Twitter */}
              <ButtonPlayShare onPress={tweetNow} iconName='twitter' textBtnDescription="PARTAGER" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <StatusBar style="light" barStyle="light-content" />
    </View>
  );
}


