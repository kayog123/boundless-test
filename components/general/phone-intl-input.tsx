import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface PhoneIntlInputProps {
  className?: string;
  value?: string;
  onChange?: (phone: string) => void;
  onBlur?: () => void;
  name?: string;
}

export default function PhoneIntlInput({ className, value = '', onChange, onBlur, name }: PhoneIntlInputProps) {
  return (
    <div>
      <PhoneInput
        defaultCountry="us"
        value={value}
        onChange={(phone) => onChange?.(phone)}
        onBlur={onBlur}
        name={name}
        inputStyle={{ width: "100%" }}
      />
    </div>
  );
}
