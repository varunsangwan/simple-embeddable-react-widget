import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { PROFILE_S3_BUCKET, userProfile } from "../config";
import { fetchById } from "../fetchItemId/fetchItemId";
import { fetchByUsername } from "../fetchItemUsername/fetchItemUsername";
import { fetchByStoreId } from "../fetchStoreItems/fetchStoreItems";
import { getRequestWithoutAuth } from "../utils/api";
import { checkIfVideoExtension } from "../utils/checkIfVideoExtension";
import { getETHPrice } from "../utils/pricefeed";
import CarouselCard from "./CarouselCard";
import Description from "./Description";
import SocialSharing from "./SocialSharing";
import styles from "./widget.module.css";

const INITIAL_LOAD = 8;
const STEP_SIZE = 8;

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      displayed: 8,

      ETHprice: null,
      rawItems: null,
      lastKey: null,
      maxKey: null,

      backgroundColor: null,
      fontColor: null,
      subtitleColor: null,
      boxShadow: null,
      fontFamily: null,
      buttonColor: null,
      buttonTextColor: null,

      type: null, // nftId, nftIdArr, username, storeId
      size: null, //normal, mini
      widgetData: null,
      widgetDataArr: [],
    };

    this.loadMore = this.loadMore.bind(this);
    this.addCount = this.addCount.bind(this);
  }
  async componentDidMount() {
    const price = await getETHPrice();
    this.setState({
      ETHprice: price.usd,
    });
  }

  addCount() {
    this.setState((prevState) => {
      return {
        ...prevState,
        displayed: prevState.displayed + 1,
      };
    });
  }

  formatMoney(n) {
    return "$" + (Math.round(n * 100) / 100).toLocaleString();
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
    const { ids, username, storeId, size } = params;
    // one item id
    if (ids && ids.length === 1) {
      this.setState({
        type: "nftId",
        size,
      });
      this.showWithId(params);
    }

    // many item ids
    if (ids && ids.length !== 1) {
      this.setState({
        type: "nftIdArr",
        size,
      });
      this.showWithIdArr(params);
    }

    // user name
    if (username) {
      this.setState({
        type: "username",
        size,
      });
      this.showWithUsernameOrStoreId(params, "username");
    }

    // store id
    if (storeId) {
      this.setState({
        type: "storeId",
        size,
      });
      this.showWithUsernameOrStoreId(params, "storeId");
    }
  }

  async showWithId(params) {
    const item = await fetchById(params.ids[0]);
    if (!item) {
      this.setState({
        error: "This listing is not available",
      });
      return;
    }

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
      // subtitle: item.sub_title,
      description: item.description.replace(/<\/?p[^>]*>/g, ""),
      category: item.category,
      // views: item.views,
      currencyUnit: item.currency,
      itemUrl,
      userProfileUrl,
      profileImg,
      socialMedia,
    };

    this.setState({
      backgroundColor: params.backgroundColor,
      fontColor: params.fontColor,
      subtitleColor: params.subtitleColor,
      boxShadow: params.boxShadow,
      fontFamily: params.fontFamily,
      buttonColor: params.buttonColor,
      buttonTextColor: params.buttonTextColor,

      widgetData,
    });
  }

  async showWithIdArr(params) {
    let items = await Promise.all(
      params.ids.map(async (id) => {
        const item = await fetchById(id);
        return item;
      })
    );
    items = items.filter((item) => item !== undefined);
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
        // subtitle: items[i].sub_title,
        description: items[i].description.replace(/<\/?p[^>]*>/g, ""),
        category: items[i].category,
        // views: items[i].view_count,
        currencyUnit: items[i].currency,
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
      subtitleColor: params.subtitleColor,
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
        // subtitle: items[i].sub_title,
        description: items[i].description.replace(/<\/?p[^>]*>/g, ""),
        category: items[i].category,
        // views: items[i].view_count,
        currencyUnit: items[i].currency,
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
    }
    this.setState({
      backgroundColor: params.backgroundColor,
      fontColor: params.fontColor,
      subtitleColor: params.subtitleColor,
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
    if (this.state.size === "mini") {
      this.loadItems(items);
    } else {
      this.loadItems(items.slice(0, INITIAL_LOAD));
    }
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
      error,

      backgroundColor,
      fontColor,
      subtitleColor,
      boxShadow,
      fontFamily,
      buttonColor,
      buttonTextColor,

      type,
      size,
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
          <div
            style={{
              textAlign: "center",
              fontSize: "24px",
              marginTop: "24px",
            }}
          >
            {error}
          </div>
          {widgetData && size !== "mini" && (
            <div className={styles.normalContainer}>
              <div className={styles.topContainer}>
                <div className={styles.storeName}>
                  {`${widgetData.username}'s Store`}
                </div>
                {widgetData.socialMedia && (
                  <SocialSharing
                    instagram={
                      widgetData.socialMedia.instagram !== "" &&
                      widgetData.socialMedia.instagram
                    }
                    twitter={
                      widgetData.socialMedia.twitter !== "" &&
                      widgetData.socialMedia.twitter
                    }
                    reddit={
                      widgetData.socialMedia.reddit !== "" &&
                      widgetData.socialMedia.reddit
                    }
                  />
                )}
              </div>
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
                    margin: "16px",
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
                            color: subtitleColor,
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
                        color: subtitleColor,
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
                      {widgetData.currencyUnit == "ETH" ? (
                        <>
                          <span style={{ fontFamily: "sans-serif" }}>
                            {`\u039E`}
                          </span>
                          {widgetData.buyPrice}
                        </>
                      ) : (
                        this.formatMoney(
                          this.state.ETHprice * widgetData.buyPrice
                        )
                      )}{" "}
                    </strong>
                    <div>
                      (
                      {!widgetData.currencyUnit == "ETH" ? (
                        <>
                          <span style={{ fontFamily: "sans-serif" }}>
                            {`\u039E`}
                          </span>
                          {widgetData.buyPrice}
                        </>
                      ) : (
                        this.formatMoney(
                          this.state.ETHprice * widgetData.buyPrice
                        )
                      )}
                      )
                    </div>
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
              </div>{" "}
            </div>
          )}

          {widgetData && size === "mini" && (
            <div className={styles.miniContainer}>
              <div className={styles.topContainer}>
                <div className={styles.storeName}>
                  {`${widgetData.username}'s Store`}
                </div>
                {widgetData.socialMedia && (
                  <SocialSharing
                    instagram={
                      widgetData.socialMedia.instagram !== "" &&
                      widgetData.socialMedia.instagram
                    }
                    twitter={
                      widgetData.socialMedia.twitter !== "" &&
                      widgetData.socialMedia.twitter
                    }
                    reddit={
                      widgetData.socialMedia.reddit !== "" &&
                      widgetData.socialMedia.reddit
                    }
                  />
                )}
              </div>
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
                  <img
                    className={styles.miniCardImage}
                    src={widgetData.image}
                  />
                ) : (
                  <video
                    key={widgetData.image}
                    className={styles.miniCardImage}
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
                    padding: "16px",
                    boxSizing: "border-box",
                    position: "relative",
                    height: "250px",
                    width: "70%",
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
                            color: subtitleColor,
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
                        color: subtitleColor,
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
                      {widgetData.currencyUnit == "ETH" ? (
                        <>
                          <span style={{ fontFamily: "sans-serif" }}>
                            {`\u039E`}
                          </span>
                          {widgetData.buyPrice}
                        </>
                      ) : (
                        this.formatMoney(
                          this.state.ETHprice * widgetData.buyPrice
                        )
                      )}{" "}
                    </strong>
                    <div>
                      (
                      {!widgetData.currencyUnit == "ETH" ? (
                        <>
                          <span style={{ fontFamily: "sans-serif" }}>
                            {`\u039E`}
                          </span>
                          {widgetData.buyPrice}
                        </>
                      ) : (
                        this.formatMoney(
                          this.state.ETHprice * widgetData.buyPrice
                        )
                      )}
                      )
                    </div>
                  </h2>

                  <a
                    style={
                      {
                        backgroundColor: buttonColor,
                        color: buttonTextColor,
                      } || null
                    }
                    className={styles.miniBuyNow}
                    href={widgetData.itemUrl}
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          )}

          {widgetData && (
            <div className={styles.mobileContainer}>
              <div
                style={{ paddingTop: "16px" }}
                className={styles.artistFlexContainer}
              >
                <div
                  style={{
                    backgroundColor: "#000",
                    width: "64px",
                    height: "64px",
                    borderRadius: "100%",
                  }}
                >
                  <img
                    style={{
                      backgroundColor: "#000",
                      width: "64px",
                      height: "64px",
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
                  <div className={styles.storeName}>
                    {`${widgetData.username}'s Store`}
                  </div>
                  {widgetData.socialMedia && (
                    <div style={{ marginLeft: "-4px", marginTop: "4px" }}>
                      <SocialSharing
                        instagram={
                          widgetData.socialMedia.instagram !== "" &&
                          widgetData.socialMedia.instagram
                        }
                        twitter={
                          widgetData.socialMedia.twitter !== "" &&
                          widgetData.socialMedia.twitter
                        }
                        reddit={
                          widgetData.socialMedia.reddit !== "" &&
                          widgetData.socialMedia.reddit
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <div
                style={
                  {
                    backgroundColor: backgroundColor,
                    boxShadow:
                      boxShadow && "0px 6px 15px -4px rgba(0, 0, 0, 0.2)",
                  } || null
                }
                className={styles.mobileCard}
              >
                {!checkIfVideoExtension(widgetData.image) ? (
                  <img
                    className={styles.mobileCardImage}
                    src={widgetData.image}
                  />
                ) : (
                  <video
                    key={widgetData.image}
                    className={styles.mobileCardImage}
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
                    padding: "16px",
                    position: "relative",
                  }}
                >
                  <div
                    style={
                      {
                        color: subtitleColor,
                      } || null
                    }
                    className={styles.mobileItemType}
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
                      {widgetData.currencyUnit == "ETH" ? (
                        <>
                          <span style={{ fontFamily: "sans-serif" }}>
                            {`\u039E`}
                          </span>
                          {widgetData.buyPrice}
                        </>
                      ) : (
                        this.formatMoney(
                          this.state.ETHprice * widgetData.buyPrice
                        )
                      )}{" "}
                    </strong>
                    <div>
                      (
                      {!widgetData.currencyUnit == "ETH" ? (
                        <>
                          <span style={{ fontFamily: "sans-serif" }}>
                            {`\u039E`}
                          </span>
                          {widgetData.buyPrice}
                        </>
                      ) : (
                        this.formatMoney(
                          this.state.ETHprice * widgetData.buyPrice
                        )
                      )}
                      )
                    </div>
                  </h2>

                  <a
                    style={
                      {
                        backgroundColor: buttonColor,
                        color: buttonTextColor,
                      } || null
                    }
                    className={styles.mobileBuyNow}
                    href={widgetData.itemUrl}
                  >
                    Buy Now
                  </a>
                </div>
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
                  NFTs for sale at Mintable.app
                </div>
                {widgetDataArr[0].socialMedia && (
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
                )}
              </div>

              {size !== "mini" && (
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

                      <div
                        style={{
                          margin: "12px",
                        }}
                      >
                        <div
                          style={
                            {
                              color: subtitleColor,
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
                            {item.currencyUnit == "ETH" ? (
                              <>
                                <span style={{ fontFamily: "sans-serif" }}>
                                  {`\u039E`}
                                </span>
                                {item.buyPrice}
                              </>
                            ) : (
                              this.formatMoney(
                                this.state.ETHprice * item.buyPrice
                              )
                            )}{" "}
                          </strong>
                          <div>
                            (
                            {!item.currencyUnit == "ETH" ? (
                              <>
                                <span style={{ fontFamily: "sans-serif" }}>
                                  {`\u039E`}
                                </span>
                                {item.buyPrice}
                              </>
                            ) : (
                              this.formatMoney(
                                this.state.ETHprice * item.buyPrice
                              )
                            )}
                            )
                          </div>
                        </h2>
                        <div
                          style={
                            {
                              color: subtitleColor,
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
              )}

              {size === "mini" && (
                <Carousel
                  containerClass={styles.carousel}
                  swipeable={true}
                  responsive={responsive}
                  // infinite={true}
                  keyBoardControl={true}
                  transitionDuration={1}
                  arrows={true}
                  afterChange={() => {
                    this.addCount();
                  }}
                >
                  {widgetDataArr.map((item, i) => {
                    return (
                      <CarouselCard
                        item={item}
                        displayed={this.state.displayed}
                        index={i}
                        key={i}
                        ETHprice={this.state.ETHprice}
                        customStyles={{
                          backgroundColor,
                          fontColor,
                          subtitleColor,
                          buttonColor,
                          buttonTextColor,
                        }}
                      />
                    );
                  })}
                </Carousel>
              )}

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

                {type !== "nftIdArr" && size !== "mini" && maxKey > lastKey && (
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
