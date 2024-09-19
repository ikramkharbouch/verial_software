import {
  PlusCircleFilled,
  CodepenOutlined,
  DeleteFilled,
  SearchOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  SwapOutlined,
  ApartmentOutlined,
  RadiusSettingOutlined,
  FieldTimeOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import Modal from 'react-modal';
import { Component, useContext, useState } from 'react';
import '@renderer/styles/actions.scss';
import ClientsForm from './forms/clients';
import { GlobalContext } from '@context';
import Search from './search';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80vh',
  },
};

const Actions = () => {
  const [currentData, setCurrentData] = useState();
  const { modalIsOpen, setIsOpen } = useContext(GlobalContext);


  function openModal(data: any) {
    setIsOpen(true);
    setCurrentData(data as any);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // do actions required after opening the modal
  }

  function closeModal() {
    setIsOpen(false);
  }

  function deleteCurrentData() {
    console.log('data deleted');
  }

  return (
    <>
      <div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {currentData}
        </Modal>
      </div>

      <div className="actions">
        <button id="new" onClick={() => openModal(<ClientsForm action="create"/>)}>
          New Client
          <PlusCircleFilled />
        </button>
        <button id="modify" onClick={() => openModal(<ClientsForm action="modify" />)}>
          Modify
          <CodepenOutlined />
        </button>
        <button onClick={deleteCurrentData}>
          Delete
          <DeleteFilled />
        </button>

        <button onClick={() => openModal(<Search />)}>
          Search
          <SearchOutlined />
        </button>
        <button onClick={() => openModal('make a comment here')}>
          Comment
          <FileTextOutlined />
        </button>

        <button onClick={() => openModal('calculate your data')}>
          Operations
          <RadiusSettingOutlined />
        </button>
        <button onClick={() => openModal('Directions window')}>
          Directions
          <SwapOutlined />
        </button>
        <button onClick={() => openModal('Processes Window')}>
          Processes
          <ApartmentOutlined />
        </button>
        <button onClick={() => openModal('Calculate Balance')}>
          Calculate Balance
          <CalculatorOutlined />
        </button>

        <button onClick={() => openModal('Make urgent changes')}>
          Urgent Changes
          <FieldTimeOutlined />
        </button>
        <button onClick={() => openModal('Download Bill from here')}>
          Download Bill
          <DownloadOutlined />
        </button>
        <button
          className=""
          onClick={() => openModal('See your last purchase')}
        >
          Last Purchase
          <ClockCircleOutlined />
        </button>
        <button
          className=""
          onClick={() => openModal('See your pending articles')}
        >
          Pending Article
          <ClockCircleOutlined />
        </button>
      </div>
    </>
  );
};

export default Actions;
