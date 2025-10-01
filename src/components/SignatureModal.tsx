import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import ExpoDraw from "expo-draw";
// import { captureRef as takeSnapshotAsync } from 'react-native-view-shot';
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");



type SignatureModalProps = {
  label?: string;
  error?: string;
  value?: string;
  visible: boolean;
  onClose: () => void;
  signatureData: string;
  setSignatureData: (value: string) => void;
};


const SignatureModal: React.FC<SignatureModalProps> = ({
  visible,
  label,
  error,
  value,
  onClose,
  signatureData,

  setSignatureData,
}) => {
  const signatureRef = useRef<any>(null);
  console.log("signatureRef", signatureRef);
  const [showError, setShowError] = useState(!!error);


  console.log("LABEL", label)

  useEffect(() => {
    if (value && value.trim() !== "") {
      setShowError(false);
    } else if (error) {
      setShowError(true);
    }
  }, [value, error]);


  const handleSave = async () => {
    if (signatureRef.current && typeof signatureRef.current.getDataURL === 'function') {
      try {
        const dataUrl = await signatureRef.current.getDataURL();
        setSignatureData(dataUrl);
        console.log("Saved signature:", dataUrl.substring(0, 50) + "...");
      } catch (err) {
        console.log("Error getting signature data:", err);
      }
    } else {
      console.log("getDataURL method not available on signatureRef.current");
    }
  };
  // const handleSave
  //  = async () => {
  //   if (signatureRef.current) {
  //     const uri = await takeSnapshotAsync(signatureRef, {
  //       format: 'png',
  //       quality: 0.8,
  //       result: 'data-uri',
  //     });
  //     console.log('Signature saved:', uri);
  //   }
  // };



  const handleReset = () => {
    signatureRef.current?.clear();
    setSignatureData("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="absolute inset-0 justify-center items-center px-4 z-50">
        <View className="w-11/12  bg-green-50 border-2 border-green-200 rounded-2xl 
                mx-4 my-8 p-4">
          <View className="flex-row justify-between items-center mb-3 border-b border-green-300 pb-3">
            {label && (
              <Text
                className={`text-md font-medium mb-2 ${showError ? "text-red-500" : "text-green-800"
                  }`}
              >
                {label}
              </Text>
            )}
            <TouchableOpacity onPress={onClose}>
              <Text className="text-2xl" style={{ color: '#166534' }}>✖</Text>
            </TouchableOpacity>
          </View>


          <ExpoDraw
            ref={signatureRef}
            containerStyle={{
              height: height * 0.3,
              width: width * 0.8,
              borderWidth: 1,
              borderColor: "#dce9e4",
              borderRadius: 12,
              backgroundColor: "#fafafa",
              marginBottom: 12,
            }}
            color="#000"
            strokeWidth={4}
            enabled
            initialData={signatureData}
          />



          <View className="flex-row justify-end mt-2 space-x-3">

            <TouchableOpacity
              onPress={handleReset}
              className="bg-red-100 px-4 py-1 rounded-lg border border-red-500"
            >
              <Text className="text-red-500 text-center font-bold text-base">Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="bg-green-100 px-4 py-1 rounded-lg border border-green-600"
            >
              <Text className="text-green-600 text-center font-bold text-base">Done</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default SignatureModal;
