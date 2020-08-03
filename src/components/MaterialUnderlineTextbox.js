import React from "react";
import { StyleSheet, View, TextInput } from "react-native";

function MaterialUnderlineTextbox(props) {
  return (
    <View style={[styles.container, props.style]}>
      <TextInput
        placeholder={props.textInput1 || ""}
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
    borderRadius: 10,
    borderColor: "rgba(0,0,0,1)",
    borderBottomWidth: 1
  },
  inputStyle: {
    flex: 1,
    color: "#000",
    alignSelf: "stretch",
    paddingTop: 16,
    paddingRight: 5,
    paddingBottom: 8,
    borderRadius: 10,
    borderColor: "#000000",
    borderWidth: 0,
    fontSize: 16,
    lineHeight: 16
  }
});

export default MaterialUnderlineTextbox;
