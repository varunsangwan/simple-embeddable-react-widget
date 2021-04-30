import React from "react";
import { PROFILE_S3_BUCKET, userProfile } from "../../config";
import { fetchById } from "../../fetchItemId/fetchItemId";
import { fetchByUsername } from "../../fetchItemUsername/fetchItemUsername";
import { fetchByStoreId } from "../../fetchStoreItems/fetchStoreItems";
import { getRequestWithoutAuth } from "../../utils/api";
import { checkIfVideoExtension } from "../../utils/checkIfVideoExtension";
import { getETHPrice } from "../../utils/pricefeed";
import SocialSharing from "../SocialSharing";
import Description from "./Description";
import styles from "./widget.module.css";

const INITIAL_LOAD = 8;
const STEP_SIZE = 8;

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ETHprice: null,
      rawItems: null,
      lastKey: null,
      maxKey: null,

      backgroundColor: null,
      fontColor: null,
      subtitleFontColor: null,
      boxShadow: null,
      fontFamily: null,
      buttonColor: null,
      buttonTextColor: null,

      type: null, // nftId, nftIdArr, username, storeId
      widgetData: null,
      widgetDataArr: [],
    };

    this.loadMore = this.loadMore.bind(this);
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

  isNotFromMintableStore(storeId) {
    return storeId !== "000000-0000000000";
  }

  loadMore() {
    const { type, rawItems, lastKey, maxKey } = this.state;
    if ((type === "username" || type === "storeId") && maxKey > lastKey) {
      this.loadItems(rawItems.slice(lastKey, lastKey + STEP_SIZE));
      this.setState({
        lastKey: lastKey + STEP_SIZE,
      });
    }
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

  showNft(params) {
    const { ids, username, storeId } = params;
    // one item id
    if (ids && ids.length === 1) {
      this.setState({
        type: "nftId",
      });
      this.showWithId(params);
    }

    // many item ids
    if (ids && ids.length !== 1) {
      this.setState({
        type: "nftIdArr",
      });
      this.showWithIdArr(params);
    }

    // user name
    if (username) {
      this.setState({
        type: "username",
      });
      this.showWithUsernameOrStoreId(params, "username");
    }

    // store id
    if (storeId) {
      this.setState({
        type: "storeId",
      });
      this.showWithUsernameOrStoreId(params, "storeId");
    }
  }

  async showWithId(params) {
    const item = await fetchById(params.ids[0]);
    const SEO = this.getSEOstring(item.title, item.sub_title);
    const itemUrl = `https://mintable.app/${item.category}/item/${SEO}/${item.id}`;
    const userProfileUrl = `https://mintable.app/u/${item.owner}`;
    const { profileImg, socialMedia } = await this.getProfileImgAndSocialMedia(
      item.owner
    );

    const widgetData = {
      image: item.preview_images[0],
      username: item.owner,
      storeId: item.store_id,
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

      widgetData,
    });
  }

  async showWithIdArr(params) {
    const items = await Promise.all(
      params.ids.map(async (id) => {
        const item = await fetchById(id);
        return item;
      })
    );

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
        storeId: items[i].store_id,
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

      widgetDataArr,
    });
  }

  async loadItems(items) {
    const widgetDataArr = [...this.state.widgetDataArr];
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
        storeId: items[i].store_id,
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
      widgetDataArr,
    });
  }

  async showWithUsernameOrStoreId(params, fetchType) {
    let items;

    if (fetchType === "username") {
      const fetchParams = {
        username: params.username,
        // size: 8,
        // lastKey: undefined,
      };
      items = await fetchByUsername(fetchParams);
      items = items.Items;
    }

    if (
      fetchType === "storeId" &&
      this.isNotFromMintableStore(params.storeId)
    ) {
      const fetchParams = {
        store_id: params.storeId,
        // size: 8,
        // lastKey: undefined,
      };
      items = await fetchByStoreId(fetchParams);
      items = items.Items;
    }
    this.setState({
      backgroundColor: params.backgroundColor,
      fontColor: params.fontColor,
      subtitleFontColor: params.subtitleFontColor,
      boxShadow: params.boxShadow,
      fontFamily: params.fontFamily,
      buttonColor: params.buttonColor,
      buttonTextColor: params.buttonTextColor,
      rawItems: items,
      lastKey: INITIAL_LOAD,
      maxKey: items.length,
    });

    // here we have all the unprocessed items. (more than 8 as the api size param is not working)
    // we take just the first 8 and process them. The rest is processed when needed
    this.loadItems(items.slice(0, INITIAL_LOAD));
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

      lastKey,
      maxKey,
    } = this.state;

    if (type === "nftId") {
      return (
        <div
          style={
            {
              fontFamily: fontFamily,
            } || null
          }
          className={styles.fontContainer}
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
              <div
                style={{
                  margin: "32px",
                  position: "relative",
                  width: "100%",
                }}
              >
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
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://d2alktbws33m8c.cloudfront.net/profile.jpeg";
                      }}
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

    if (type === "nftIdArr" || type === "username" || type === "storeId") {
      return (
        <div
          style={
            {
              fontFamily: fontFamily,
            } || null
          }
          className={styles.fontContainer}
        >
          {widgetDataArr.length !== 0 && (
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
                  {type === "nftIdArr"
                    ? "NFTs for sale at Mintable.app"
                    : `${widgetDataArr[0].username}'s Store`}
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
                  // cent={
                  //   widgetDataArr[0].socialMedia.cent !== "" &&
                  //   widgetDataArr[0].socialMedia.cent
                  // }
                  // youtube={
                  //   widgetDataArr[0].socialMedia.youtube !== "" &&
                  //   widgetDataArr[0].socialMedia.youtube
                  // }
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
                ))}
              </div>

              <div style={{ position: "relative" }}>
                <div className={styles.poweredBy}>
                  <div>Powered by Mintable</div>
                  <img
                    style={{
                      backgroundColor: "#000",
                      width: "20px",
                      height: "20px",
                      marginLeft: "8px",
                    }}
                    src="https://mintable.app/logo.svg"
                    alt=""
                  />
                </div>

                {type !== "nftIdArr" && maxKey > lastKey && (
                  <div
                    onClick={this.loadMore}
                    className={styles.loadMore}
                    style={
                      {
                        color: buttonColor,
                        border: `1px solid ${buttonColor}`,
                      } || null
                    }
                  >
                    Load More
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    } else return null;
  }
}

export default Widget;
