import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../Navigation/types';
import AssessItem from '../../../components/AssessItem';
import { View } from 'react-native';
import { TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Text } from 'react-native';

interface ParticipantInfoProps {
  patientId?: number;
  age?: number;
  studyId?: number;
}

export default function ParticipantInfo({ patientId = 1, age = 0, studyId = 1 }: ParticipantInfoProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [text, setText] = useState("");

  const handleSave = () => {
    console.log("Saved text:", text);
    // Add your save logic here
  };

  return (
    <ScrollView className="flex-1 p-4">

      <AssessItem
        icon="📋"
        title="Socio Demographic Form"
        subtitle="Personal Information, education, and contact information"
        onPress={() => navigation.navigate("SocioDemographic", { patientId, age, studyId })}
        className="bg-[#F6F7F7] border-[#F6F7F7]"
      />

      <AssessItem
        icon="❤️"
        title="Participant Screening Form"
        subtitle="Assess eligibility, medical history, and clinical checklist"
        onPress={() => navigation.navigate("PatientScreening", { patientId, age: age || 0, studyId: studyId || 1 })}
        className="bg-[#F6F7F7] border-[#F6F7F7]"
      />

      <AssessItem
        icon="📝"
        title="Informed Consent Form"
        subtitle="Study details, participant information, acknowledgements, and signatures"
        onPress={() => navigation.navigate("InformedConsent", { patientId, age, studyId })}
        className="bg-[#F6F7F7] border-[#F6F7F7]"
      />

      <AssessItem
        icon="📊"
        title="Study and Control Group Assignment"
        subtitle="Assign participants to study groups and track assignments"
        onPress={() =>
          navigation.navigate('StudyGroupAssignment', { patientId, age: age || 0, studyId: studyId || 1 })
        }
        className="bg-[#F6F7F7] border-[#F6F7F7]" />

      <View className="p-4 bg-white">
        {/* TextArea */}
        <TextInput
          className="flex-1 border border-gray-300 rounded-xl p-3 text-gray-700"
          multiline
          placeholder="Enter your notes..."
          value={text}
          onChangeText={setText}
          numberOfLines={5}
          style={{ maxHeight: 120 }}
        />

        {/* Save Button on the right */}
        <View className="flex-row items-end justify-end">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-green-100 px-4 py-1 rounded-lg border border-green-600 mt-4"
            style={{ width: 80 }}
          >
            <Text className="text-green-600 text-center font-bold text-base">Save</Text>
          </TouchableOpacity>
        </View>

      </View>


    </ScrollView>
  );
}
