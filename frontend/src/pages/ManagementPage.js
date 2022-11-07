import React, { useState, useEffect } from "react";
import RestaurantService from '../services/RestaurantService';
import Restaurant from '../components/Restaurant';
import swal from 'sweetalert';
import Spinner from "../components/Spinner";
import AddForm from "../components/CustomForm";

export const ManagementPage = () => {
  let [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        restaurants = await RestaurantService.getUserRestaurants();
        setRestaurants(restaurants);
        console.log('restaurants ', restaurants)
        if (restaurants.length === 0) {
          swal("No data to show");
        }
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [])


  const handleSubmit = async (data) => {
    try {
      data.active = "active";
      await RestaurantService.addRestaurant(data)
      restaurants = await RestaurantService.getUserRestaurants();
      setRestaurants(restaurants);
    } catch (e) {
      if (e.response.status === 401) { // the specified user has no premission to delete
        swal("Premission denied.");
      } else if (e.response.status === 500) {
        swal("Restaurant already exists");
      }
    }
  }

  const handleUpdate = async (data) => {
    try {
      await RestaurantService.updateRestaurant(data)
      restaurants = await RestaurantService.getUserRestaurants();
      setRestaurants(restaurants);
    } catch (e) {
      if (e.response.status === 401) { // the specified user has no premission to update
        swal("Premission denied.");
      }
    }
  }
  

  const handleDeactivate = async (id) => {
    try {
      await RestaurantService.deactivateRestaurant(id);
      restaurants = await RestaurantService.getUserRestaurants();
      setRestaurants(restaurants);
    } catch (e) {
      if (e.response.status === 401) { // the specified user has no premission to delete
        swal("Premission denied.");
      }
    }
  }

  const handleDelete = async (id) => {
    try {
      await RestaurantService.deleteRestaurant(id);
      restaurants = await RestaurantService.getUserRestaurants();
      setRestaurants(restaurants);
    } catch (e) {
      if (e.response.status === 401) { // the specified user has no premission to delete
        swal("Premission denied.");
      }
    }
  }


  return (
    <div className="app">
      <AddForm onSubmit={handleSubmit} />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="restaurant-list">
          {restaurants.map((restaurant, index) => (
            <Restaurant
              key={index}
              index={index}
              restaurant={restaurant}
              handleDeactivate={handleDeactivate}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  )

}