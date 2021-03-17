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
    requestParamsNoAuth(method, body){
        let params = {
          method: method,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
      
        if (body) {
          params["body"] = JSON.stringify(body);
        }
      
        params["mode"] = "cors";
        return params;
      };
    async fetchItem(url, body){
        const res =  await fetch(url, this.requestParamsNoAuth("POST", body));
        if (res.status === 401) {
            //localStorage.removeItem(AUTHENTICATION_TOKEN);
            console.log("404")
          }
          if (res.status >= 200 && res.status < 400) {
              console.log(res.json())
            return res.json();
          } else {
            const response = await res.json();
        
            throw Error(response.reason);
          }
       
    }
    componentDidUpdate(){
        
        this.fetchItem(url, formData);
    }
      
    render() {
        if (this.state.message) {
            return <div className="widget-container"><h1>I'm {widgetName}</h1><div>I have a message: {this.state.message}</div></div>;
        }
        else {
            return <div className="widget-container"><h1>I'm a {widgetName}</h1></div>;
        }
    }
    showUserNFT(data){
        this.setState({formData:data});
    }
    setMessage(message){
        this.setState({message: message});
    }
};

export default Widget;