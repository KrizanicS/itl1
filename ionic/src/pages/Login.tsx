import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
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

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.login(email, password);
      if (response.success) {
        history.push('/profile');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h2 className="ion-text-center">Welcome Back</h2>
            
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value || '')}
              />
            </IonItem>

            {error && (
              <IonText color="danger" className="ion-padding">
                <p>{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              onClick={handleLogin}
              disabled={loading}
              className="ion-margin-top"
            >
              {loading ? <IonSpinner name="crescent" /> : 'Login'}
            </IonButton>

            <p className="ion-text-center ion-margin-top">
              Don&apos;t have an account?{' '}
              <IonRouterLink routerLink="/register">Register</IonRouterLink>
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
