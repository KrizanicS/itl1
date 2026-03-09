import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import { logOut, save } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { ApiService, User } from '../services/ApiService';
import './Auth.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!ApiService.isLoggedIn()) {
      history.push('/login');
      return;
    }
    loadProfile();
  }, [history]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getProfile();
      if (response.success && response.user) {
        setUser(response.user);
        setName(response.user.name);
        setPhone(response.user.phone || '');
      } else {
        setError(response.message || 'Failed to load profile');
        if (!response.success) {
          ApiService.logout();
          history.push('/login');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await ApiService.updateProfile(name, phone || undefined);
      if (response.success && response.user) {
        setUser(response.user);
        setSuccess('Profile updated successfully');
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    ApiService.logout();
    history.push('/login');
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Welcome, {user?.name}!</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>Email</IonLabel>
              <IonText>{user?.email}</IonText>
            </IonItem>
            <IonItem>
              <IonLabel>Role</IonLabel>
              <IonText className="ion-text-capitalize">{user?.role}</IonText>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Edit Profile</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Name</IonLabel>
              <IonInput
                type="text"
                value={name}
                onIonChange={(e) => setName(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Phone</IonLabel>
              <IonInput
                type="tel"
                value={phone}
                onIonChange={(e) => setPhone(e.detail.value || '')}
              />
            </IonItem>

            {error && (
              <IonText color="danger" className="ion-padding">
                <p>{error}</p>
              </IonText>
            )}

            {success && (
              <IonText color="success" className="ion-padding">
                <p>{success}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              onClick={handleUpdateProfile}
              disabled={saving}
              className="ion-margin-top"
            >
              <IonIcon slot="start" icon={save} />
              {saving ? <IonSpinner name="crescent" /> : 'Save Changes'}
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonButton
          expand="block"
          color="danger"
          onClick={handleLogout}
          className="ion-margin-top"
        >
          <IonIcon slot="start" icon={logOut} />
          Logout
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
