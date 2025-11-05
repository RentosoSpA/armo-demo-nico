import FormPropiedad from '../components/propiedades/FormPropiedad';
import { useAuth } from '../context/useAuth';

const CrearPropiedad = () => {
  const { currentUser } = useAuth();

  const handleCreated = () => {
    // Navigation is handled within the form component
  };

  // Pasar userId para el storageKey del borrador
  return (
    <FormPropiedad 
      mode="create" 
      onCreated={handleCreated}
      userId={currentUser?.uid}
    />
  );
};

export default CrearPropiedad;