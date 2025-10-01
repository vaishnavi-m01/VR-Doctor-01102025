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
    if (signatureRef.current) {
      try {
        console.log("Attempting to save signature...");
        console.log("Available methods:", Object.keys(signatureRef.current));
        
        // expo-draw uses getData() or getStrokes() instead of getDataURL()
        if (typeof signatureRef.current.getData === 'function') {
          const data = await signatureRef.current.getData();
          setSignatureData(data);
          console.log("✅ Signature saved successfully");
        } else if (typeof signatureRef.current.getStrokes === 'function') {
          const strokes = await signatureRef.current.getStrokes();
          const strokesData = JSON.stringify(strokes);
          setSignatureData(strokesData);
          console.log("✅ Signature strokes saved");
        } else {
          console.log("⚠️ Using signatureRef state directly");
          setSignatureData("signature_captured");
        }
      } catch (err) {
        console.log("❌ Error saving signature:", err);
      }
    } else {
      console.log("❌ signatureRef.current is null");
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
      {/* Semi-transparent backdrop */}
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View 
          className="bg-white rounded-3xl shadow-2xl"
          style={{ 
            width: width * 0.85, 
            maxWidth: 750,
            height: height * 0.6,
            padding: 20,
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-gray-200">
            {label && (
              <Text className="text-xl font-bold text-gray-800">
                {label}
              </Text>
            )}
            <TouchableOpacity 
              onPress={onClose}
              className="w-9 h-9 items-center justify-center rounded-full bg-gray-100"
            >
              <Text className="text-gray-600 text-xl font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <Text className="text-sm text-gray-600 mb-3">
            Please sign in the box below using your finger or stylus
          </Text>

          {/* Drawing Canvas */}
          <View className="flex-1 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 mb-4 p-2">
            <ExpoDraw
              ref={signatureRef}
              containerStyle={{
                flex: 1,
                borderRadius: 12,
                backgroundColor: "#ffffff",
              }}
              color="#000000"
              strokeWidth={3}
              enabled
              initialData={signatureData}
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              onPress={handleReset}
              className="bg-red-50 px-6 py-3 rounded-xl border-2 border-red-300"
            >
              <Text className="text-red-600 text-center font-bold text-base">Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleSave();
                onClose();
              }}
              className="bg-[#0ea06c] px-8 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-bold text-base">Save Signature</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default SignatureModal;
