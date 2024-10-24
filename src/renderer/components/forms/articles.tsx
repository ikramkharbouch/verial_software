import { useForm } from 'react-hook-form';
import '@renderer/styles/forms.css';
import { useState, useEffect, useContext } from 'react';
import 'react-international-phone/style.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientSchema } from '@renderer/types/ClientSchema';
import Input from './shared/input';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import GlobalContext from '../../../context/Context';
import DoubleInput from './shared/doubleInput';
import React from 'react';
import { useCreateClient } from '@renderer/hooks';

const options = [
  { value: 'Entreprise', label: 'entreprise' },
  { value: 'Particulier', label: 'particulier' },
  { value: 'Particulier', label: 'particulier' },
];

interface IClientFormType {
  action?: string;
}

const ArticlesForm = ({ action }: IClientFormType) => {
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

    if (action == 'create') {
      mutate(data);
    } else if (action == 'modify') {
      console.log('modify data here');
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
      <React.Suspense fallback={<>loading...</>}>
        {modalIsOpen && (
          <div>
            <h1>Article's form</h1>
            {errors && <span>Review inputs, all fields are required</span>}
          </div>
        )}

        <form className="form-layout">
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
            label="number"
            name="number"
            register={register}
            placeholder="#13829"
            required={true}
            disabled={!modalIsOpen}
          />

          <Input
            label="Address"
            type="text"
            name="address"
            register={register}
            placeholder="Insurance Details here"
            disabled={!modalIsOpen}
          />

          <Input
            label="CODE BARRE"
            type="text"
            name="codebarre"
            register={register}
            placeholder="Insurance Details here"
            disabled={!modalIsOpen}
          />

          <Input
            label="Article's name"
            type="text"
            name="codebarre"
            register={register}
            placeholder="Insurance Details here"
            disabled={!modalIsOpen}
          />

          <Input
            label="Short Name"
            type="text"
            name="shortname"
            register={register}
            placeholder="Insurance Details here"
            disabled={!modalIsOpen}
          />

          <DoubleInput options={options} label="Provider" />
          <DoubleInput options={options} label="Manufacturer" />
          <DoubleInput options={options} label="Category" />

          <div className="pricing">
            <h2>Pricing</h2>
            <div className="form-layout pricing-form">
              <Input
                label="Manual Cost"
                type="text"
                name="shortname"
                register={register}
                placeholder="Insurance Details here"
                disabled={!modalIsOpen}
              />

              <Input
                label="Last Cost"
                type="text"
                name="shortname"
                register={register}
                placeholder="Insurance Details here"
                disabled={!modalIsOpen}
              />

              <Input
                label="Price/Range"
                type="text"
                name="shortname"
                register={register}
                placeholder="Insurance Details here"
                disabled={!modalIsOpen}
              />
              <Input
                label="Price"
                type="text"
                name="shortname"
                register={register}
                placeholder="Insurance Details here"
                disabled={!modalIsOpen}
              />
              <Input
                label="Price + IMP"
                type="text"
                name="shortname"
                register={register}
                placeholder="Insurance Details here"
                disabled={!modalIsOpen}
              />
            </div>
          </div>

          <div className="btm-section">
            <div className="ancillary-fees">
              <h2>Ancillary Fees</h2>
              <div className="form-layout">
                <Input
                  label="Fee A: margin + price"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />

                <Input
                  label="Fee B: margin + price"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />

                <Input
                  label="Fee C: margin + price"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />
                <Input
                  label="Fee A: price"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />
                <Input
                  label="Fee B: price"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />
                <Input
                  label="Fee C: price"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />

                <Input
                  label="Fee A: price + iva"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />
                <Input
                  label="Fee B: price + iva"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />
                <Input
                  label="Fee C: price + iva"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />
              </div>
            </div>

            <div className="stocking-options">
              <h2>Stocking Options</h2>
              <div className='form-layout'>
                <Input
                  label="Min stock"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />

                <Input
                  label="Max stock"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />

                <Input
                  label="Location"
                  type="text"
                  name="shortname"
                  register={register}
                  placeholder="placeholder"
                  disabled={!modalIsOpen}
                />
              </div>
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
      </React.Suspense>
    </>
  );
};

export default ArticlesForm;
