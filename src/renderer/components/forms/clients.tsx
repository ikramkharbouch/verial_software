import { useForm } from 'react-hook-form';
import '@renderer/styles/forms.scss';
import Select from 'react-select';
import { useState, useEffect, useContext } from 'react';
import 'react-international-phone/style.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientSchema } from '@renderer/types/ClientSchema';
import Input from './shared/input';
import InputPhone from './shared/phoneInput';
import { useCreateClient } from '@renderer/hooks';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import GlobalContext from '../../../context/Context';

const options = [
  { value: 'Entreprise', label: 'entreprise' },
  { value: 'Particulier', label: 'particulier' },
  { value: 'Particulier', label: 'particulier' },
];

interface IClientFormType {
  action ?: string;
}

const ClientsForm = ({action}: IClientFormType) => {
  const [clientType, setClientType] = useState('Entreprise');
  const [phone, setPhone] = useState([]);

  const { mutate, isError, error, data } = useMutation(useCreateClient);
  const { modalIsOpen, setIsOpen } = useContext(GlobalContext);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ClientSchema),
  });

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    let data = getValues();

    if (action == "create") {
      mutate(data);
    }
    else if (action == "modify") {
      console.log("modify data here");
    }
  };

  const handleChange = (selectedOption: string) => {
    setClientType(selectedOption);
  };

  useEffect(() => {
    if (data && data.status == 200) {
      setIsOpen(false);
      toast.success('Client Successfully created!');
    }
    // when the clients creates a new user, this action emerges
  }, [data]);

  console.log(modalIsOpen);

  return (
    <>
      {modalIsOpen && (
        <div>
          <h1>ClientsForm</h1>
          {errors && <span>Review inputs, all fields are required</span>}
        </div>
      )}

      <form className="clientsForm">
        
        <Input
          type="text"
          label="File Number"
          name="fileNb"
          register={register}
          placeholder="1002"
          required={true}
          disabled={!modalIsOpen}
        />

        <Input
          type="text"
          name="insurance"
          register={register}
          placeholder="Insurance Details here"
          disabled={!modalIsOpen}
        />

        <Input
          type="text"
          label="N.I.F"
          name="NIF"
          register={register}
          placeholder="#13829"
          required={true}
          disabled={!modalIsOpen}
        />

        <label htmlFor={'clientType'} className="input-label">
          <p>Type of client</p>
          <Select
            name="clientType"
            value={clientType}
            onChange={(e: any) => handleChange(e.value)}
            options={options}
            placeholder={clientType == '' ? 'Select Client Type' : clientType}
          />
        </label>

        <Input
          type="text"
          label="First Name"
          name="fname"
          register={register}
          placeholder="Lhaj"
          required={true}
          disabled={!modalIsOpen}
        />

        <Input
          type="text"
          label="Last Name"
          name="lname"
          register={register}
          placeholder="Mounir"
          required={true}
          disabled={!modalIsOpen}
        />

        <Input
          type="text"
          label="ICEO"
          name="iceo"
          register={register}
          placeholder="ICE02038920283729"
          required={true}
          disabled={!modalIsOpen}
        />

        <Input
          type="text"
          label="Tax Name"
          name="taxName"
          register={register}
          placeholder="Lhaj"
          required={true}
          disabled={!modalIsOpen}
        />

        <InputPhone
          label="Phone Number"
          value={phone as any}
          setPhone={setPhone as any}
          required={true}
          disabled={!modalIsOpen}
        />

        <div className="endForm">
          <Input
            type="text"
            label="Province"
            name="province"
            register={register}
            placeholder="Tetouan"
            required={true}
            disabled={!modalIsOpen}
          />

          <label htmlFor="location">
            <p>Location</p>
            <textarea name="location" rows={4} cols={40} disabled={!modalIsOpen} />
          </label>

          <Input
            type="text"
            label="Postal Code"
            name="postalCode"
            register={register}
            placeholder="30000"
            disabled={!modalIsOpen}
          />
        </div>

        <div className="phoneDetails">
          <h3>Phone Details</h3>
          <div className="inputs">
            <InputPhone
              label="Tel N1"
              value={phone as any}
              setPhone={setPhone as any}
              disabled={!modalIsOpen}
            />
            <InputPhone
              label="Tel N2"
              value={phone as any}
              setPhone={setPhone as any}
              disabled={!modalIsOpen}
            />
            <InputPhone
              label="Fax Number"
              value={phone as any}
              setPhone={setPhone as any}
              disabled={!modalIsOpen}
            />
          </div>
        </div>
        {modalIsOpen && (
          <input
            type="submit"
            value="Create New Client"
            onClick={(e: any) => onSubmit(e)}
          />
        )}
      </form>
    </>
  );
};

export default ClientsForm;
