import { Select } from 'antd';
import type { SelectProps } from 'antd';

interface CountryOption {
  code: string;
  name: string;
  dialCode: number;
  flag: string;
}

const countries: CountryOption[] = [
  { code: 'CL', name: 'Chile', dialCode: 56, flag: '🇨🇱' },
  { code: 'AR', name: 'Argentina', dialCode: 54, flag: '🇦🇷' },
  { code: 'PE', name: 'Perú', dialCode: 51, flag: '🇵🇪' },
  { code: 'CO', name: 'Colombia', dialCode: 57, flag: '🇨🇴' },
  { code: 'MX', name: 'México', dialCode: 52, flag: '🇲🇽' },
  { code: 'BR', name: 'Brasil', dialCode: 55, flag: '🇧🇷' },
  { code: 'UY', name: 'Uruguay', dialCode: 598, flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay', dialCode: 595, flag: '🇵🇾' },
  { code: 'BO', name: 'Bolivia', dialCode: 591, flag: '🇧🇴' },
  { code: 'EC', name: 'Ecuador', dialCode: 593, flag: '🇪🇨' },
  { code: 'VE', name: 'Venezuela', dialCode: 58, flag: '🇻🇪' },
  { code: 'CR', name: 'Costa Rica', dialCode: 506, flag: '🇨🇷' },
  { code: 'PA', name: 'Panamá', dialCode: 507, flag: '🇵🇦' },
  { code: 'GT', name: 'Guatemala', dialCode: 502, flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', dialCode: 504, flag: '🇭🇳' },
  { code: 'SV', name: 'El Salvador', dialCode: 503, flag: '🇸🇻' },
  { code: 'NI', name: 'Nicaragua', dialCode: 505, flag: '🇳🇮' },
  { code: 'DO', name: 'República Dominicana', dialCode: 1, flag: '🇩🇴' },
  { code: 'CU', name: 'Cuba', dialCode: 53, flag: '🇨🇺' },
  { code: 'US', name: 'Estados Unidos', dialCode: 1, flag: '🇺🇸' },
  { code: 'CA', name: 'Canadá', dialCode: 1, flag: '🇨🇦' },
  { code: 'ES', name: 'España', dialCode: 34, flag: '🇪🇸' },
  { code: 'FR', name: 'Francia', dialCode: 33, flag: '🇫🇷' },
  { code: 'DE', name: 'Alemania', dialCode: 49, flag: '🇩🇪' },
  { code: 'IT', name: 'Italia', dialCode: 39, flag: '🇮🇹' },
  { code: 'GB', name: 'Reino Unido', dialCode: 44, flag: '🇬🇧' },
  { code: 'PT', name: 'Portugal', dialCode: 351, flag: '🇵🇹' },
  { code: 'NL', name: 'Países Bajos', dialCode: 31, flag: '🇳🇱' },
  { code: 'BE', name: 'Bélgica', dialCode: 32, flag: '🇧🇪' },
  { code: 'CH', name: 'Suiza', dialCode: 41, flag: '🇨🇭' },
  { code: 'SE', name: 'Suecia', dialCode: 46, flag: '🇸🇪' },
  { code: 'NO', name: 'Noruega', dialCode: 47, flag: '🇳🇴' },
  { code: 'DK', name: 'Dinamarca', dialCode: 45, flag: '🇩🇰' },
  { code: 'FI', name: 'Finlandia', dialCode: 358, flag: '🇫🇮' },
  { code: 'PL', name: 'Polonia', dialCode: 48, flag: '🇵🇱' },
  { code: 'RU', name: 'Rusia', dialCode: 7, flag: '🇷🇺' },
  { code: 'CN', name: 'China', dialCode: 86, flag: '🇨🇳' },
  { code: 'JP', name: 'Japón', dialCode: 81, flag: '🇯🇵' },
  { code: 'KR', name: 'Corea del Sur', dialCode: 82, flag: '🇰🇷' },
  { code: 'IN', name: 'India', dialCode: 91, flag: '🇮🇳' },
  { code: 'AU', name: 'Australia', dialCode: 61, flag: '🇦🇺' },
  { code: 'NZ', name: 'Nueva Zelanda', dialCode: 64, flag: '🇳🇿' },
  { code: 'ZA', name: 'Sudáfrica', dialCode: 27, flag: '🇿🇦' },
  { code: 'IL', name: 'Israel', dialCode: 972, flag: '🇮🇱' },
  { code: 'AE', name: 'Emiratos Árabes Unidos', dialCode: 971, flag: '🇦🇪' },
  { code: 'SA', name: 'Arabia Saudita', dialCode: 966, flag: '🇸🇦' },
  { code: 'TR', name: 'Turquía', dialCode: 90, flag: '🇹🇷' },
  { code: 'EG', name: 'Egipto', dialCode: 20, flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', dialCode: 234, flag: '🇳🇬' },
  { code: 'KE', name: 'Kenia', dialCode: 254, flag: '🇰🇪' },
];

interface CountryPhoneSelectProps extends Omit<SelectProps<number>, 'options'> {
  value?: number;
  onChange?: (value: number) => void;
}

const CountryPhoneSelect = ({ 
  value, 
  onChange, 
  placeholder = 'Seleccionar país',
  className,
  ...rest 
}: CountryPhoneSelectProps) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`country-phone-select ${className || ''}`}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) => {
        const country = countries.find(c => c.dialCode === option?.value);
        if (!country) return false;
        const searchText = input.toLowerCase();
        return (
          country.name.toLowerCase().includes(searchText) ||
          country.dialCode.toString().includes(searchText) ||
          country.code.toLowerCase().includes(searchText)
        );
      }}
      popupClassName="country-phone-dropdown"
      {...rest}
    >
      {countries.map((country) => (
        <Select.Option key={country.code} value={country.dialCode}>
          <div className="country-option">
            <span className="country-name">{country.name}: +{country.dialCode}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default CountryPhoneSelect;
