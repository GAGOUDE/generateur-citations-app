import { View, TouchableOpacity, Text } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Styles from './Styles';

const ButtonPlayShare = ({ onPress, iconName, textBtnDescription }) => {
    return (
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={onPress}
                style={Styles.otherBtnContainer}>
                <FontAwesome name={iconName} size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={Styles.textBtnDescription}>{textBtnDescription}</Text>
        </View>
    )
}

export default ButtonPlayShare;