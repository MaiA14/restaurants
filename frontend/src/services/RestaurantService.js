import HttpService from './HttpService';

const restaurantsEndpoint = 'restaurants';

const getUserRestaurants = async () => {
  const restaurants = HttpService.get(`${restaurantsEndpoint}/get`);
  return restaurants;
}


const addRestaurant = async (data) => {
  const newRestaurant = HttpService.post(`${restaurantsEndpoint}/add`, data);
  return newRestaurant;
}

const deleteRestaurant = async (id) => {
  const deletedRestaurant = HttpService.post(`${restaurantsEndpoint}/delete/${id}`);
  return deletedRestaurant;
}

const updateRestaurant = async (data) => {
  const updatedRestaurant = HttpService.put(`${restaurantsEndpoint}/update/${data.id}`, data);
  return updatedRestaurant;
}


export default {
  getUserRestaurants,
  addRestaurant,
  deleteRestaurant,
  updateRestaurant
};