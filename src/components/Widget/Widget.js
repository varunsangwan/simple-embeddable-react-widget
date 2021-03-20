import React from 'react'

import './widget.css';
import {fetchByUsername} from "../../fetchItemUsername/fetchItemUsername";
import {fetchById} from "../../fetchItemId/fetchItemId";
 
const widgetName = 'Mintable_Widget';

class Widget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            formData:null,
            widgetData:null,
        };
    }
    
    
      
    render() {
      let img = this.state.widgetData==null?null: Array.from(this.state.widgetData.keys());
       return(
        <div>
        {this.state.widgetData && (<div class="container">
        <div class="images">
          <img src={img[0]} />
        </div>
        
        
        <div class="product">
          <p>{this.state.widgetData.get(img[0]).username}</p>
          <h1>{this.state.widgetData.get(img[0]).title}</h1>
          <h2>{this.state.widgetData.get(img[0]).buyPrice} ETH</h2>
          <p class="desc">{this.state.widgetData.get(img[0]).description}</p>
          <div class="buttons">
            <button class="add" style={{color:'purple'}}>Buy Now</button>
          </div>
        </div>
      </div>
      
                    )}
                    </div>
            
       )
    }
    async showId(id){
      let element = await fetchById(id.id);
      console.log(element)
      let map = new Map();
      element.description = element.description.replace(/<\/?p[^>]*>/g, "");
      map.set(element.preview_images[0], {username:element.owner, buyPrice: element.buyNowPrice==0?element.startingPrice:element.buyNowPrice,description:element.description , title: element.title, subtitle: element.subtitle, views: element.views, image: element.preview_images[0]});
      this.setState({
        widgetData:map,
      })
      console.log(map);
    }
    async showUserNFT(name){
      console.log(name);
        let data = {
          username :name.username,
          lastKey: undefined,
          sub: undefined,
          store_id: undefined}
        let arr = await fetchByUsername(data);
        arr = arr.Items;
        let map = new Map();
        for(let i=0;i<arr.length;i++){
          map.set(arr[i].preview_images[0], { buyPrice: arr[i].buyNowPrice, title: arr[i].title, subtitle: arr[i].subtitle, views: arr[i].views, image: arr[i].preview_images[0]});
        }
        
        this.setState({
          widgetData:map,
        })
    }
    setMessage(message){
        this.setState({message: message});
    }
};

export default Widget;