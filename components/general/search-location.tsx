 import AsyncSelect from 'react-select/async';
import { components, type GroupBase, type ValueContainerProps } from 'react-select';
import { Locate } from 'lucide-react';  
import { 
  LocationItem, 
  SearchLocationProps, 
  MapboxSuggestion 
} from '@/lib/type';
 
const sessionToken = crypto.randomUUID();

async function searchPlaces(query: string, locationType?: "airport" | "location"): Promise<MapboxSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    session_token: sessionToken,
    ...(locationType && { location_type: locationType }),
  });

  const res = await fetch(`/api/mapbox-suggest?${params}`);
  const data = await res.json();
  return data.suggestions as MapboxSuggestion[];
}

export default ({placeholder = "Search location", className ="", locationType, value, onChange, onBlur, name }: SearchLocationProps) =>{
    
const ValueContainer = ({ children, ...props }: ValueContainerProps<LocationItem, false, GroupBase<LocationItem>>) => (
  <components.ValueContainer {...props}>
    <Locate
      size={16}
      style={{ position: 'absolute', left: 8, color: '#9ca3af' }} 
    />
    {children}
  </components.ValueContainer>
);

const promiseOptions = async (inputValue: string) => {
  const places = await searchPlaces(inputValue, locationType);
  const result = places.map((place: MapboxSuggestion) => ({
    label: locationType === 'airport' && place.external_ids?.iata
      ? `${place.external_ids.iata} - ${place.name}`
      : place.name,
    value: place.mapbox_id,
    description: place.full_address || place.place_formatted,
  }));
  return result
};

    return (
  <AsyncSelect<LocationItem, false, GroupBase<LocationItem>>
    key={locationType}
    instanceId={name}
    components={{ ValueContainer }}
    cacheOptions
    defaultOptions
    loadOptions={promiseOptions}
    placeholder={placeholder}
    className={className}
    isClearable
    backspaceRemovesValue
    formatOptionLabel={(option, { context }) =>
      context === "menu" ? (
        <div>
          <div>{option.label}</div>
          {option.description && (
            <div style={{ fontSize: 12, color: '#6b7280' }}>{option.description}</div>
          )}
        </div>
      ) : (
        <span>{option.label}</span>
      )
    }
    value={value || null}
    onChange={(option) => onChange?.(option)}
    onBlur={onBlur}
    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
    styles={{
    menuPortal: (base) => ({ ...base, zIndex: 50 }),
    valueContainer: (base) => ({
      ...base,
      paddingLeft: 30,
    }),
  }}
  />
) } ;