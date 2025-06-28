import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import DashboardHeadings from '../../../components/DashboardHeadings';

const AddPackages = () => {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      id: '',
      price: '',
      PV: '',
      name: '',
      description: '',
      features: ['']
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features'
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPlan) => axios.post('/api/membership', newPlan), // Replace with your endpoint
    onSuccess: () => {
      queryClient.invalidateQueries(['memberships']); // Optional: update list
      reset(); // Clear the form
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
   <div className='text-center mb-8'>
   <DashboardHeadings heading={"Update Packages"} smalltext={"Add best package that suits your needs and start earning today!"}></DashboardHeadings>
   
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4 border rounded">
      <input {...register('id')} placeholder="ID" className="w-full border p-2 rounded" />
      <input {...register('price')} placeholder="Price" className="w-full border p-2 rounded" />
      <input {...register('PV')} placeholder="PV" className="w-full border p-2 rounded" />
      <input {...register('name')} placeholder="Name" className="w-full border p-2 rounded" />
      <textarea {...register('description')} placeholder="Description" className="w-full border p-2 rounded" />

      <div>
        <label className="block font-semibold mb-2">Features</label>
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 mb-2">
            <input
              {...register(`features.${index}`)}
              placeholder={`Feature ${index + 1}`}
              className="flex-grow border p-2 rounded"
            />
            <button type="button" onClick={() => remove(index)} className="text-red-500">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => append('')} className="text-blue-500">+ Add Feature</button>
      </div>

      <button type="submit" disabled={mutation.isLoading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {mutation.isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
   </div>
  );
};

export default AddPackages;
