//TODO check if from mintable store

import React from "react";
import { PROFILE_S3_BUCKET, userProfile } from "../../config";
import { fetchES } from "../../fetchItemId/fetchItemId";
import { fetchByUsername } from "../../fetchItemUsername/fetchItemUsername";
import { getRequestWithoutAuth } from "../../utils/api";
import { checkIfVideoExtension } from "../../utils/checkIfVideoExtension";
import { getETHPrice } from "../../utils/pricefeed";
import SocialSharing from "../SocialSharing";
import Description from "./Description";
import styles from "./widget.module.css";
class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ETHprice: null,

      backgroundColor: null,
      fontColor: null,
      subtitleFontColor: null,
      boxShadow: null,
      fontFamily: null,
      buttonColor: null,
      buttonTextColor: null,

      type: null,
      widgetData: null,
      widgetDataArr: [],
    };
  }
  async componentDidMount() {
    const price = await getETHPrice();
    this.setState({
      ETHprice: price.usd,
    });
  }

  formatMoney(n) {
    return "$ " + (Math.round(n * 100) / 100).toLocaleString();
  }

  async getProfileImgAndSocialMedia(username) {
    const profileData = await getRequestWithoutAuth(
      userProfile + "/" + username
    );
    return {
      profileImg: profileData.profile_image,
      socialMedia: profileData.social_media,
    };
  }

  async showWithNftId(params) {
    const item = await fetchES(params.id);

    const SEO = this.getSEOstring(item.title, item.sub_title);
    const itemUrl = `https://mintable.app/${item.category}/item/${SEO}/${item.id}`;
    const userProfileUrl = `https://mintable.app/u/${item.owner}`;
    const { profileImg, socialMedia } = await this.getProfileImgAndSocialMedia(
      item.owner
    );

    const widgetData = {
      image: item.preview_images[0],
      username: item.owner,
      buyPrice: item.buyNowPrice == 0 ? item.startingPrice : item.buyNowPrice,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description.replace(/<\/?p[^>]*>/g, ""),
      category: item.category,
      views: item.views,
      currrencyUnit: item.currrency,
      itemUrl,
      userProfileUrl,
      profileImg,
      socialMedia,
    };

    this.setState({
      backgroundColor: params.backgroundColor,
      fontColor: params.fontColor,
      subtitleFontColor: params.subtitleFontColor,
      boxShadow: params.boxShadow,
      fontFamily: params.fontFamily,
      buttonColor: params.buttonColor,
      buttonTextColor: params.buttonTextColor,

      type: params.type,
      widgetData,
    });
  }

  async showUserNFT(params) {
    const fetchParams = {
      username: params.username,
      size: params.itemCount,
      lastKey: undefined,
    };
    let items = await fetchByUsername(fetchParams);
    items = items.Items;

    const widgetDataArr = [];
    for (let i = 0; i < items.length; i++) {
      const SEO = this.getSEOstring(items[i].title, items[i].sub_title);
      const itemUrl = `https://mintable.app/${items[i].category}/item/${SEO}/${items[i].id}`;
      const userProfileUrl = `https://mintable.app/u/${items[i].owner}`;
      const {
        profileImg,
        socialMedia,
      } = await this.getProfileImgAndSocialMedia(items[i].owner);

      const widgetData = {
        image: items[i].preview_images[0],
        username: items[i].owner,
        buyPrice:
          items[i].buyNowPrice == 0
            ? items[i].startingPrice
            : items[i].buyNowPrice,
        title: items[i].title,
        subtitle: items[i].subtitle,
        description: items[i].description.replace(/<\/?p[^>]*>/g, ""),
        category: items[i].category,
        views: items[i].views,
        currrencyUnit: items[i].currrency,
        itemUrl,
        userProfileUrl,
        profileImg,
        socialMedia,
      };
      widgetDataArr.push(widgetData);
    }

    this.setState({
      backgroundColor: params.backgroundColor,
      fontColor: params.fontColor,
      subtitleFontColor: params.subtitleFontColor,
      boxShadow: params.boxShadow,
      fontFamily: params.fontFamily,
      buttonColor: params.buttonColor,
      buttonTextColor: params.buttonTextColor,

      type: params.type,
      widgetDataArr,
    });
  }

  getSEOstring(title, subtitle) {
    title = title.replace(/[\s(?=\s*$)]/g, "-");
    var regex = /[\s](?!$)/g;
    title += "-";
    subtitle = subtitle.replace(regex, "-");
    let SEO = title.concat(subtitle);
    return SEO.replace(/[^a-zA-Z0-9-_]/g, "");
  }

  render() {
    const {
      backgroundColor,
      fontColor,
      subtitleFontColor,
      boxShadow,
      fontFamily,
      buttonColor,
      buttonTextColor,

      type,
      widgetData,
      widgetDataArr,
    } = this.state;

    console.log(type);

    if (type === "nftId") {
      return (
        <div
          style={
            {
              fontFamily: fontFamily,
            } || null
          }
          className={styles.widgetContainer}
        >
          {widgetData && (
            <div
              style={
                {
                  backgroundColor: backgroundColor,
                  boxShadow:
                    boxShadow && "0px 6px 15px -4px rgba(0, 0, 0, 0.2)",
                } || null
              }
              className={styles.card}
            >
              {!checkIfVideoExtension(widgetData.image) ? (
                <img className={styles.cardImage} src={widgetData.image} />
              ) : (
                <video
                  key={widgetData.image}
                  className={styles.cardImage}
                  autoPlay
                  playsInline
                  muted
                  loop
                  preload="metadata"
                  poster="https://d1iczm3wxxz9zd.cloudfront.net/video.png"
                >
                  <source
                    src={widgetData.image}
                    onError={(e) => {
                      e.target.poster =
                        "https://d1iczm3wxxz9zd.cloudfront.net/video.png";
                    }}
                  />
                </video>
              )}
              <div style={{ margin: "32px", position: "relative" }}>
                <div className={styles.artistFlexContainer}>
                  <div
                    style={{
                      backgroundColor: "#000",
                      width: "48px",
                      height: "48px",
                      borderRadius: "100%",
                    }}
                  >
                    <img
                      style={{
                        backgroundColor: "#000",
                        width: "48px",
                        height: "48px",
                        borderRadius: "100%",
                      }}
                      src={`${PROFILE_S3_BUCKET}${widgetData.profileImg}`}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "16px",
                    }}
                  >
                    <a
                      href={widgetData.userProfileUrl}
                      style={
                        {
                          color: fontColor,
                        } || null
                      }
                      className={styles.artistName}
                    >
                      {widgetData.username}
                    </a>
                    <div
                      style={
                        {
                          color: subtitleFontColor,
                        } || null
                      }
                      className={styles.artistLabel}
                    >
                      Artist
                    </div>
                  </div>
                </div>

                <div
                  style={
                    {
                      color: subtitleFontColor,
                    } || null
                  }
                  className={styles.itemType}
                >
                  {widgetData.category}
                </div>

                <h1
                  style={
                    {
                      color: fontColor,
                    } || null
                  }
                  className={styles.itemTitle}
                >
                  {widgetData.title}
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
                    {widgetData.currrencyUnit == "ETH"
                      ? widgetData.buyPrice + " ETH"
                      : this.formatMoney(
                          this.state.ETHprice * widgetData.buyPrice
                        )}
                  </strong>
                  <span>
                    {" "}
                    ({`\u039E`}
                    {!widgetData.currrencyUnit == "ETH"
                      ? widgetData.buyPrice + " ETH"
                      : this.formatMoney(
                          this.state.ETHprice * widgetData.buyPrice
                        )}
                    )
                  </span>
                </h2>

                <Description
                  fontColor={fontColor}
                  buttonColor={buttonColor}
                  descriptionData={widgetData.description}
                />

                <a
                  style={
                    {
                      backgroundColor: buttonColor,
                    } || null
                  }
                  className={styles.buyNow}
                  href={widgetData.itemUrl}
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
          )}
        </div>
      );
    }

    if (type === "username") {
      return (
        <div
          style={
            {
              fontFamily: fontFamily,
            } || null
          }
          className={styles.widgetContainer}
        >
          {widgetDataArr && (
            <div
              style={
                {
                  backgroundColor: backgroundColor,
                  boxShadow:
                    boxShadow && "0px 6px 15px -4px rgba(0, 0, 0, 0.2)",
                } || null
              }
              className={styles.gridCard}
            >
              <div className={styles.topContainer}>
                <div className={styles.storeName}>
                  {widgetDataArr[0].username}'s Store
                </div>
                <SocialSharing
                  instagram={
                    widgetDataArr[0].socialMedia.instagram !== "" &&
                    widgetDataArr[0].socialMedia.instagram
                  }
                  twitter={
                    widgetDataArr[0].socialMedia.twitter !== "" &&
                    widgetDataArr[0].socialMedia.twitter
                  }
                  reddit={
                    widgetDataArr[0].socialMedia.reddit !== "" &&
                    widgetDataArr[0].socialMedia.reddit
                  }
                  cent={
                    widgetDataArr[0].socialMedia.cent !== "" &&
                    widgetDataArr[0].socialMedia.cent
                  }
                  youtube={
                    widgetDataArr[0].socialMedia.youtube !== "" &&
                    widgetDataArr[0].socialMedia.youtube
                  }
                />
              </div>

              <div className={styles.gridContainer}>
                {widgetDataArr.map((item, i) => (
                  <div
                    style={
                      {
                        backgroundColor: backgroundColor,
                      } || null
                    }
                    className={styles.gridItemCard}
                    key={i}
                  >
                    <div
                      style={{
                        width: "100%",
                        paddingBottom: "100%",
                        position: "relative",
                      }}
                    >
                      {!checkIfVideoExtension(item.image) ? (
                        <img
                          className={styles.gridItemcardImage}
                          src={item.image}
                        />
                      ) : (
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
                      )}
                    </div>

                    <div
                      style={{
                        margin: "16px",
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

                      <div className={styles.absoluteBottomContainer}>
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
                              : this.formatMoney(
                                  this.state.ETHprice * item.buyPrice
                                )}
                          </strong>
                          <span>
                            {" "}
                            ({`\u039E`}
                            {!item.currrencyUnit == "ETH"
                              ? item.buyPrice + " ETH"
                              : this.formatMoney(
                                  this.state.ETHprice * item.buyPrice
                                )}
                            )
                          </span>
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TODO: add view more */}
            </div>
          )}
        </div>
      );
    } else return null;
  }
}

export default Widget;
