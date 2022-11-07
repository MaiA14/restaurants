import HttpService from './HttpService';

const restaurantsEndpoint = 'restaurants';

const getUserRestaurants = async () => {
  const restaurants = await HttpService.get(`${restaurantsEndpoint}/get`);
  return restaurants;
}


const addRestaurant = async (data) => {
  const newRestaurant = await HttpService.post(`${restaurantsEndpoint}/add`, data);
  return newRestaurant;
}

const deactivateRestaurant = async (id) => {
  const deletedRestaurant = await HttpService.post(`${restaurantsEndpoint}/deactivate/${id}`);
  return deletedRestaurant;
}

const deleteRestaurant = async (id) => {
  return await HttpService.delete(`${restaurantsEndpoint}/delete/${id}`);
}

const updateRestaurant = async (data) => {
  const updatedRestaurant = await HttpService.put(`${restaurantsEndpoint}/update/${data.id}`, data);
  return updatedRestaurant;
}


export default {
  getUserRestaurants,
  addRestaurant,
  deactivateRestaurant,
  deleteRestaurant,
  updateRestaurant
};