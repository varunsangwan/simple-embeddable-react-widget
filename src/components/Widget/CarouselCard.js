import React from "react";
import LazyLoad from "react-lazy-load";
import { checkIfVideoExtension } from "../../utils/checkIfVideoExtension";
import styles from "./widget.module.css";

export default class CarouselCard extends React.Component {
  formatMoney(n) {
    return "$ " + (Math.round(n * 100) / 100).toLocaleString();
  }

  render() {
    const { item, displayed, index, ETHprice, customStyles } = this.props;

    const {
      backgroundColor,
      fontColor,
      subtitleFontColor,
      buttonColor,
      buttonTextColor,
    } = customStyles;

    return (
      <div
        style={
          {
            backgroundColor: backgroundColor,

            marginLeft: "15px",
            marginRight: "15px",
          } || null
        }
        className={styles.gridItemCard}
      >
        {!checkIfVideoExtension(item.image) ? (
          displayed > index ? (
            <img className={styles.gridItemcardImage} src={item.image} />
          ) : (
            <LazyLoad debounce={false} throttle={250} offsetLeft={500}>
              <img className={styles.gridItemcardImage} src={item.image} />
            </LazyLoad>
          )
        ) : displayed > index ? (
          <video
            key={item.image}
            className={styles.gridItemcardImage}
            autoPlay
            playsInline
            muted
            loop
            preload="metadata"
            poster="https://d1iczm3wxxz9zd.cloudfront.net/video.png"
          >
            <source
              src={item.image}
              onError={(e) => {
                e.target.poster =
                  "https://d1iczm3wxxz9zd.cloudfront.net/video.png";
              }}
            />
          </video>
        ) : (
          <LazyLoad debounce={false} throttle={250}>
            <video
              key={item.image}
              className={styles.gridItemcardImage}
              autoPlay
              playsInline
              muted
              loop
              preload="metadata"
              poster="https://d1iczm3wxxz9zd.cloudfront.net/video.png"
            >
              <source
                src={item.image}
                onError={(e) => {
                  e.target.poster =
                    "https://d1iczm3wxxz9zd.cloudfront.net/video.png";
                }}
              />
            </video>
          </LazyLoad>
        )}

        <div
          style={{
            margin: "12px",
          }}
        >
          <div
            style={
              {
                color: subtitleFontColor,
              } || null
            }
            className={styles.gridSubtitle}
          >
            {item.category}
          </div>
          <h1
            style={
              {
                color: fontColor,
              } || null
            }
            className={styles.gridItemTitle}
          >
            {item.title}
          </h1>

          <h2
            style={
              {
                color: fontColor,
              } || null
            }
            className={styles.itemPrice}
          >
            <strong>
              {item.currrencyUnit == "ETH"
                ? item.buyPrice + " ETH"
                : this.formatMoney(ETHprice * item.buyPrice)}
            </strong>
            <div>
              {" "}
              (<span style={{ fontFamily: "sans-serif" }}>{`\u039E`}</span>
              {!item.currrencyUnit == "ETH"
                ? item.buyPrice + " ETH"
                : this.formatMoney(ETHprice * item.buyPrice)}
              )
            </div>
          </h2>
          <div
            style={
              {
                color: subtitleFontColor,
              } || null
            }
            className={styles.gridSubtitle}
          >
            {item.username}
          </div>

          <a
            style={
              {
                backgroundColor: buttonColor,
              } || null
            }
            className={styles.buyNowSingle}
            href={item.itemUrl}
          >
            <div
              style={
                {
                  color: buttonTextColor,
                } || null
              }
            >
              Buy Now
            </div>
          </a>
        </div>
      </div>
    );
  }
}
