import React from "react";
import styles from "./widget.module.css";
import { fetchByUsername } from "../../fetchItemUsername/fetchItemUsername";
import { fetchES } from "../../fetchItemId/fetchItemId";
import {getETHPrice} from "../../utils/pricefeed";

const widgetName = "Mintable_Widget";

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null,
      link: null,
      message: null,
      formData: null,
      listingID: null,
      widgetData: null,
      backgroundColor:null,
      fontFamily:"Times New Roman", 
      ButtonColor:null,
      boxShadow:true,
      currrencyUnit:"ETH",
      ETHprice:null,
    };
  }
  async componentDidMount(){
    let price = await getETHPrice();
    this.setState({
      ETHprice: price.usd,
    });
  }
  formatMoney(n) {
    return "$ " + (Math.round(n * 100) / 100).toLocaleString();
  }
  render() {
    let img =
      this.state.widgetData == null
        ? null
        : Array.from(this.state.widgetData.keys());
    return (
      <div className={styles.abc}>
        {this.state.widgetData && (
          <div
            style={{
              fontFamily:this.state.fontFamily==null?"sans-serif":this.state.fontFamily,
              position: "relative",
              margin: "auto",
              overflow: "hidden",
              width: "520px",
              height: "350px",
              background: this.state.backgroundColor==null?"#f5f5f5":this.state.backgroundColor,
              boxShadow: this.state.boxShadow==true?"5px 5px 15px #ba7e7e":"0px",
              borderRadius: "10px",
            }}
          >
            <div>
              <img
                style={{ width: "250px", height: "310px", margin: "20px" }}
                src={img[0]}
              />
            </div>

            <div
              style={{
                position: "absolute",
                width: "40%",
                height: "100%",
                top: "10%",
                left: "60%",
              }}
            >
              <a href={this.state.userProfile}>
                <p
                  className={styles.abc}
                  style={{
                    fontSize: "0.6em",
                    color: "#ba7e7e",
                    letterSpacing: "1px",
                  }}
                >
                  {this.state.widgetData.get(img[0]).username}
                </p>
              </a>
              <h1
                style={{
                  fontSize: "1.2em",
                  color: "#4e4e4e",
                  marginTop: "-5px",
                }}
              >
                {this.state.widgetData.get(img[0]).title}
              </h1>
              <h2 style={{ color: "#c3a1a0", marginTop: "-5px" }}>
                {this.state.currrencyUnit=="ETH"?this.state.widgetData.get(img[0]).buyPrice+" ETH": this.formatMoney(this.state.ETHprice*this.state.widgetData.get(img[0]).buyPrice)+" USD"}
                
              </h2>
              <p
                className={styles.abc}
                style={{
                  textTransform: "none",
                  letterSpacing: "0",
                  marginBottom: "17px",
                  color: "#4e4e4e",
                  fontSize: "0.7em",
                  lineHeight: "1.6em",
                  marginRight: "25px",
                  textAlign: "justify",
                  overflow: "hidden",
                  maxWidth: "75ch",
                  maxHeight: "18ch",
                }}
              >
                {this.state.widgetData.get(img[0]).description}...
              </p>
              <div>
                <a href={this.state.link}>
                  <button
                    style={{
                      backgroundColor: this.state.ButtonColor==null?"#e0c9cb":this.state.ButtonColor,
                      width: "67%",
                      padding: "10px",
                      display: "inline-block",
                      outline: "0",
                      border: "0",
                      margin: "-1px",
                      borderRadius: "2px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "#f5f5f5",
                      cursor: "pointer",
                    }}
                  >
                    Buy Now
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  getSEOstring(title, subtitle) {
    title = title.replace(/[\s(?=\s*$)]/g, "-");
    var regex = /[\s](?!$)/g;
    title += "-";
    subtitle = subtitle.replace(regex, "-");
    let SEO = title.concat(subtitle);
    ////console.log(SEO.replace(/[^a-zA-Z0-9-_]/g, ""));
    return SEO.replace(/[^a-zA-Z0-9-_]/g, "");
  }
  async showId(params) {
    console.log(params)
    let element = await fetchES(params.id);
    console.log(element);
    let map = new Map();
    element.description = element.description.replace(/<\/?p[^>]*>/g, "");
    map.set(element.preview_images[0], {
      username: element.owner,
      buyPrice:
        element.buyNowPrice == 0 ? element.startingPrice : element.buyNowPrice,
      description: element.description,
      title: element.title,
      subtitle: element.subtitle,
      views: element.views,
      image: element.preview_images[0],
    });
    let SEO = this.getSEOstring(element.title, element.sub_title);
    let url = `https://mintable.app/${element.category}/item/${SEO}/${element.id}`;
    let user = `https://mintable.app/u/${element.owner}`;
    console.log(url);
    
    this.setState({
      link: url,
      userProfile: user,
      listingID: params.id,
      widgetData: map,
      backgroundColor:params.backgroundColor,
      fontFamily:params.fontFamily, 
      ButtonColor:params.ButtonColor,
      boxShadow:params.boxShadow, 
      currrencyUnit:params.currrencyUnit,
    });
    console.log(map);
  }
  async showUserNFT(name) {
    console.log(name);
    let data = {
      username: name.username,
      lastKey: undefined,
      sub: undefined,
      store_id: undefined,
    };
    let arr = await fetchByUsername(data);
    arr = arr.Items;
    let map = new Map();
    for (let i = 0; i < arr.length; i++) {
      map.set(arr[i].preview_images[0], {
        buyPrice: arr[i].buyNowPrice,
        title: arr[i].title,
        subtitle: arr[i].subtitle,
        views: arr[i].views,
        image: arr[i].preview_images[0],
      });
    }

    this.setState({
      widgetData: map,
    });
  }
  setMessage(message) {
    this.setState({ message: message });
  }
}

export default Widget;
