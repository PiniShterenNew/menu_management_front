import React, { useContext, useState } from 'react';
import { Button, Modal } from 'antd';
import MixForm from '../components/mixes/MixForm';
import MixList from '../components/mixes/MixList';
import './MixesPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMixContext } from '../context/subcontexts/MixContext';

function MixesPage() {
  const { addMix } = useMixContext();
  const [isMixModalVisible, setIsMixModalVisible] = useState(false);

  const showMixModal = () => {
    setIsMixModalVisible(true);
  };

  const handleMixModalClose = () => {
    setIsMixModalVisible(false);
  };

  return (
    <div style={{ padding: '1em 20px' }} className="scrollable-content mixes-page-container">
      <div className="mix-controls">
        <Button type="primary" onClick={showMixModal} className="add-mix-button">
          <strong>הוסף תערובת חדשה</strong>
        </Button>
      </div>

      <MixList />

      <Modal
        title="הוסף תערובת חדשה"
        open={isMixModalVisible}
        onCancel={handleMixModalClose}
        className="popup-modal"
        footer={null}
        destroyOnClose
      >
        <MixForm addMix={addMix} onClose={handleMixModalClose} />
      </Modal>
    </div>
  );
}

export default MixesPage;
