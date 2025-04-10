import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { serialize } from 'object-to-formdata';
import { toast } from 'sonner';

import axiosInstance from './axiosInstance';

interface IUseGetAllProps<T> {
  url: string;
  options?: UseQueryOptions<T[], AxiosError>;
  axiosConfig?: AxiosRequestConfig;
}

// Generic GET All Hook
export function useGetAll<T>({ url, options, axiosConfig }: IUseGetAllProps<T>) {
  const response = useQuery<T[], AxiosError>({
    queryKey: [url],
    queryFn: async () => {
      const res: AxiosResponse<T[]> = await axiosInstance.get<T[]>(url, axiosConfig);
      return res.data ?? res;
    },
    ...options,
    staleTime: 10 * 60 * 1000, // 10 minutes for this specific query
  });

  return response;
}

interface IUseGetByIdProps<T> {
  url: string;
  id: string;
  options?: UseQueryOptions<T, AxiosError>;
  axiosConfig?: AxiosRequestConfig;
}

// Generic GET By ID Hook
export function useGetById<T>({ url, id, axiosConfig, options }: IUseGetByIdProps<T>) {
  const response = useQuery<T, AxiosError>({
    queryKey: [url, id],
    queryFn: async () => {
      const res: AxiosResponse<T> = await axiosInstance.get<T>(`${url}/${id}`, axiosConfig);

      return res.data ?? (res as any); // ? I have to go with as any otherwise I get ts error
    },
    enabled: !!id,
    ...options,
    staleTime: 10 * 60 * 1000, // 10 minutes for this specific query
  });
  return response;
}
interface IUseCreateProps<T, U> {
  url: string;
  options?: UseMutationOptions<T, AxiosError, U>;
  axiosConfig?: AxiosRequestConfig;
  asFormData?: boolean; // new optional flag
}

// Generic POST Hook
export function useCreate<T, U = T>({ url, axiosConfig, options, asFormData = false }: IUseCreateProps<T, U>) {
  return useMutation<T, AxiosError, U>({
    mutationFn: async (data) => {
      // If asFormData flag is true, convert data object to FormData using objectToFormData
      const payload = asFormData ? serialize(data) : data;
      const response = await axiosInstance.post<T>(url, payload, axiosConfig);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      toast.success('Operation was successful!', {
        style: {
          background: '#10B981',
          border: 'none',
          color: 'white',
        },
      });
      options?.onSuccess && options?.onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message ?? 'Something went wrong !', {
        style: {
          backgroundColor: '#EF4444',
          border: 'none',
          color: 'white',
        },
      });
      options?.onError && options?.onError(error, variables, context);
    },
    ...options,
  });
}

interface IUseUpdateProps<T, U> {
  url: string;
  options?: UseMutationOptions<T, AxiosError, { id: string; data: U }>;
  axiosConfig?: AxiosRequestConfig;
  asFormData?: boolean; // new optional flag
}

// Generic PUT Hook
export function useUpdate<T, U = Partial<T>>({ url, axiosConfig, options, asFormData = false }: IUseUpdateProps<T, U>) {
  return useMutation<T, AxiosError, { id: string; data: U }>({
    mutationFn: async ({ id, data }) => {
      const payload = asFormData ? serialize(data) : data;
      const response = await axiosInstance.put<T>(`${url}/${id}`, payload, axiosConfig);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      toast.success('Operation was successful!', {
        style: {
          background: '#10B981',
          border: 'none',
          color: 'white',
        },
      });
      options?.onSuccess && options?.onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message ?? 'Something went wrong !', {
        style: {
          backgroundColor: '#EF4444',
          border: 'none',
          color: 'white',
        },
      });
      options?.onError && options?.onError(error, variables, context);
    },
    ...options,
  });
}

interface IUseDeleteProps {
  url: string;
  options?: UseMutationOptions<void, AxiosError, string>;
  axiosConfig?: AxiosRequestConfig;
}

// Generic DELETE Hook
export function useDelete({ url, axiosConfig, options }: IUseDeleteProps) {
  return useMutation<void, AxiosError, string>({
    mutationFn: async (id) => {
      await axiosInstance.delete(`${url}/${id}`, axiosConfig);
    },
    onSuccess: (data, variables, context) => {
      toast.success('Operation was successful!', {
        style: {
          background: '#10B981',
          border: 'none',
          color: 'white',
        },
      });
      options?.onSuccess && options?.onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message ?? 'Something went wrong !', {
        style: {
          backgroundColor: '#EF4444',
          border: 'none',
          color: 'white',
        },
      });
      options?.onError && options?.onError(error, variables, context);
    },
    ...options,
  });
}
