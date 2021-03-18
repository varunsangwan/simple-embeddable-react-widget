import React from 'react'

import './widget.css';
import {fetchByUsername} from "../../fetchItemUsername/fetchItemUsername";

const widgetName = 'Mintable_Widget';

class Widget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            formData:null,
        };
    }
    
    componentDidUpdate(){
        console.log(this.state.formData);
        
    }
      
    render() {
        if (this.state.message) {
            return <div className="widget-container"><h1>I'm {widgetName}</h1><div>I have a message: {this.state.message}</div></div>;
        }
        else {
            return <div className="widget-container"><h1>I'm a {widgetName}</h1></div>;
        }
    }
    showUserNFT(name){
      console.log(name);
        let data = {
          username :name.username,
          lastKey: undefined,
          sub: undefined,
          store_id: undefined}
        let arr = fetchByUsername(data);
        console.log(arr);

    }
    setMessage(message){
        this.setState({message: message});
    }
};

export default Widget;