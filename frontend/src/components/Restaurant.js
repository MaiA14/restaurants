import React from "react";
import CustomForm from "./CustomForm";

const Restaurant = ({ restaurant, handleDelete, handleUpdate }) => {

    console.log(restaurant)
    return (
        <React.Fragment>
            <div className="container card">
                <div className="buttons-panel">
                    <CustomForm mode={"update"} restaurant={restaurant} onSubmit={handleUpdate} />
                    <button className="button"><img src="https://res.cloudinary.com/dtwqtpteb/image/upload/v1667666120/bmzpxkg8zn8kxwtv2egf.png"
                        width="20" height="20" alt="trash"
                        onClick={() => handleDelete(restaurant.id)} />
                    </button>
                </div>
                <img src={restaurant.img} width="100" height="100"></img>
                <div>  <b>Name:</b> {restaurant.name}</div>
                {restaurant.country ? <div>  <b>Country: </b> {restaurant.country}</div> : ''}
                {restaurant.chain ? <div>  <b>Chain: </b> {restaurant.chain}</div> : ''}
                <div>  <b>Active: </b> {restaurant.active}</div>
            </div>
        </React.Fragment>
    );
};

export default Restaurant;