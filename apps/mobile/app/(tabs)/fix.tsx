import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function FixScreen() {
  return (
    <View style={styles.container}>
      <Text style={typography.h2}>Incidencias</Text>
      <Text style={typography.bodySmall}>Reporta y sigue el estado de las incidencias</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 },
});
