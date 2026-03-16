import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function SpacesScreen() {
  return (
    <View style={styles.container}>
      <Text style={typography.h2}>Reservas</Text>
      <Text style={typography.bodySmall}>Reserva zonas comunes de tu comunidad</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 },
});
