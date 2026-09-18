import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useToast } from '../../context/ToastContext';

/** expo-clipboard works cross-platform (web + native) — unlike portfolio-react's navigator.clipboard check, no Platform branch needed. */
export function CopyEmailButton({ email }: { email: string }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Copier l'adresse email"
      onPress={async () => {
        await Clipboard.setStringAsync(email);
        setCopied(true);
        showToast('Email copié !', 'success');
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      <Text>{copied ? '✅' : '📋'}</Text>
    </Pressable>
  );
}
