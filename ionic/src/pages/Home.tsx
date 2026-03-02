import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonText,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { trash, add, refresh } from 'ionicons/icons';
import { ApiService, Item } from '../services/ApiService';
import './Home.css';

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [dbStatus, setDbStatus] = useState<string>('checking...');

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getItems();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const health = await ApiService.checkHealth();
      setDbStatus(health.database === 'connected' ? 'Connected' : 'Disconnected');
    } catch {
      setDbStatus('Disconnected');
    }
  };

  useEffect(() => {
    checkHealth();
    loadItems();
  }, []);

  const handleAddItem = async () => {
    if (!newName.trim()) {
      setError('Name is required');
      return;
    }
    try {
      await ApiService.createItem(newName);
      setNewName('');
      await loadItems();
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await ApiService.deleteItem(id);
      await loadItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ITL1 - Database Demo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Database Demo</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Database Status */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Database Status</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText color={dbStatus === 'Connected' ? 'success' : 'danger'}>
              <strong>MySQL: {dbStatus}</strong>
            </IonText>
          </IonCardContent>
        </IonCard>

        {/* Add Item Form */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Add New Item</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Name</IonLabel>
              <IonInput
                value={newName}
                onIonChange={(e) => setNewName(e.detail.value || '')}
              />
            </IonItem>
            <IonButton expand="block" onClick={handleAddItem} className="ion-margin-top">
              <IonIcon slot="start" icon={add} />
              Add Item
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Error Message */}
        {error && (
          <IonCard color="danger">
            <IonCardContent>
              <IonText color="light">{error}</IonText>
            </IonCardContent>
          </IonCard>
        )}

        {/* Items List */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Items from MySQL
              <IonButton fill="clear" size="small" onClick={loadItems}>
                <IonIcon icon={refresh} />
              </IonButton>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loading ? (
              <div className="ion-text-center">
                <IonSpinner />
              </div>
            ) : items.length === 0 ? (
              <IonText color="medium">No items found</IonText>
            ) : (
              <IonList>
                {items.map((item) => (
                  <IonItemSliding key={item.id}>
                    <IonItem>
                      <IonLabel>
                        <h2>{item.name}</h2>
                      </IonLabel>
                    </IonItem>
                    <IonItemOptions side="end">
                      <IonItemOption color="danger" onClick={() => handleDeleteItem(item.id)}>
                        <IonIcon slot="icon-only" icon={trash} />
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                ))}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
