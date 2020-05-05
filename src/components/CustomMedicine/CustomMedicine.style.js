import { StyleSheet } from "react-native";
import { liwiColors } from "../../utils/constants";

export const styles = StyleSheet.create({
  container: { padding: 10, borderRadius: 2, marginBottom: 20 },
  item: { flex: 1, flexDirection: 'row', marginBottom: 5 },
  input: { flex: 1 },
  button: { width: 50 },
  icon: { fontSize: 18 },
  drugContainer: { flex: 1, flexDirection: 'row', marginBottom: 5 },
  title: { backgroundColor: liwiColors.redColor, color: liwiColors.whiteColor, padding: 4, borderRadius: 2, paddingLeft: 20, marginBottom: 20 },
});
