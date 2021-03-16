import React from 'react'
import {
    search,
    fetchItem,
    ElasticSearch,
  } from "../../config";
import './widget.css';

const widgetName = 'Mintable_Widget';

class Widget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            formData:null,
        };
    }
    
    async fetchItem(){
        const res = await fetch(url, requestParamsNoAuth("POST", body));
        return;
    }
    componentDidUpdate(){
        //this.fetchItem(this.state.formData);
    }
      
    render() {
        if (this.state.message) {
            return <div className="widget-container"><h1>I'm {widgetName}</h1><div>I have a message: {this.state.message}</div></div>;
        }
        else {
            return <div className="widget-container"><h1>I'm a {widgetName}</h1></div>;
        }
    }
    setFormData(data){
        this.setState({formData:data});
    }
    setMessage(message){
        this.setState({message: message});
    }
};

export default Widget;