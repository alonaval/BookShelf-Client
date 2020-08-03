import React from "react";
import { StyleSheet, View, TextInput } from "react-native";

function MaterialUnderlineTextbox3(props) {
  return (
    <View style={[styles.container, props.style]}>
      <TextInput
        placeholder={props.textInput1 || "אימייל"}
        style={styles.inputStyle}

      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderColor: "rgba(0,0,0,1)",
    borderBottomWidth: 1
  },
  inputStyle: {
    flex: 1,
    backgroundColor: "rgba(230, 230, 230,0.5)",
    color: "#000",
    alignSelf: "stretch",
    paddingTop: 16,
    paddingRight: 5,
    paddingBottom: 8,
    fontSize: 16,
    lineHeight: 16,
    textAlign: "right"
  }
});

export default MaterialUnderlineTextbox3;
