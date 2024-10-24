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
import '@renderer/styles/actions.css';
import ClientsForm from './forms/clients';
import GlobalContext from '../../context/Context';
import Search from './search';
import ProvidersForm from './forms/providers';
import ArticlesForm from './forms/articles';

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
  const { modalIsOpen, setIsOpen } = useContext(GlobalContext) as any;

  const { currentTab } = useContext(GlobalContext) as any;

  // temporary solution to test
  // const [ modalIsOpen, setIsOpen] = useState(false);

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

  function setForm() {
    console.log("debugging here", currentTab);
    switch (currentTab) {
      case 0:
        openModal(<ClientsForm action="modify" />);
      case 1:
        openModal(<ProvidersForm action="modify" />);
      case 2:
        openModal(<ArticlesForm action="modify" />);
      case 3:
        openModal(<ClientsForm action="modify" />);
      case 4:
        openModal(<ClientsForm action="modify" />);
      case 4:
        openModal(<ClientsForm action="modify" />);
      case 5:
        openModal(<ClientsForm action="modify" />);
      case 6:
        openModal(<ClientsForm action="modify" />);
      case 7:
        openModal(<ClientsForm action="modify" />);
      case 8:
        openModal(<ClientsForm action="modify" />);
    }
  }

  console.log(currentTab);

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
        <button
          id="new"
          onClick={() => openModal(<ClientsForm action="create" />)}
        >
          New Client
          <PlusCircleFilled />
        </button>
        <button id="modify" onClick={() => setForm()}>
          Modify
          <CodepenOutlined />
        </button>
        <button onClick={deleteCurrentData}>
          Delete
          <DeleteFilled />
        </button>

        {/* <button onClick={() => openModal(<Search />)}>
          Search
          <SearchOutlined />
        </button> */}
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
