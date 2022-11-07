import React, { Component } from 'react'
import Select from 'react-select'

export default class RestaurantsSelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectOptions: [],
            restaurants: []
        }
    }

    getOptions() {
        const restaurants = [
            { value: "amore mio", label: "Amore Mio" },
            { value: "joya", label: "Joya" },
            { value: "zozobra", label: "Zozobra" },
            { value: "bbb-tel-aviv", label: "BBB Tel Aviv" },
            { value: "olive-garden", label: "Olive Garden" }
        ];

        this.setState({ selectOptions: restaurants })
    }

    handleChange(e) {
        const restaurants = e;
        let rest = [];
        for (let i = 0; i < restaurants.length; i++) {
            rest.push(restaurants[i].label);
        }
        this.setState({ restaurants: rest });
        this.props.restaurantsCallback(rest);
    }

    componentDidMount() {
        this.getOptions()
    }

    render() {
        return (
            <div>
                <Select options={this.state.selectOptions} onChange={this.handleChange.bind(this)} isMulti />
            </div>
        )
    }
}