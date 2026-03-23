import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
  IonSpinner,
  IonRouterLink,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ApiService } from '../services/ApiService';
import './Auth.css';

const Register: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.register(name, email, password, phone || undefined);
      if (response.success) {
        history.push('/profile');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h2 className="ion-text-center">Create Account</h2>
            
            <IonItem>
              <IonInput
                label="Name *"
                labelPlacement="floating"
                type="text"
                value={name}
                onIonInput={(e) => setName(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Email *"
                labelPlacement="floating"
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Password *"
                labelPlacement="floating"
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Phone (optional)"
                labelPlacement="floating"
                type="tel"
                value={phone}
                onIonInput={(e) => setPhone(e.detail.value || '')}
              />
            </IonItem>

            {error && (
              <IonText color="danger" className="ion-padding">
                <p>{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              onClick={handleRegister}
              disabled={loading}
              className="ion-margin-top"
            >
              {loading ? <IonSpinner name="crescent" /> : 'Register'}
            </IonButton>

            <p className="ion-text-center ion-margin-top">
              Already have an account?{' '}
              <IonRouterLink routerLink="/login">Login</IonRouterLink>
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Register;
