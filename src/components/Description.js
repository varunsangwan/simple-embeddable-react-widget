import React from "react";
import sanitizeHtml from "sanitize-html";
import { SANITIZER_CONFIG } from "../config";
import { getRequestWithoutAuth } from "../utils/api";
import styles from "./widget.module.css";

class Description extends React.Component {
  constructor() {
    super();
    this.state = {
      embedURL: "",
      iframelyHTML: "",
    };
  }
  /**
   * Parses HTML and extracts the embed then reinserts with the proper formatting for iframe
   */
  async ParseHTML(description) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(description, "text/html");
    let embedURL =
      htmlDoc &&
      htmlDoc.querySelector("oembed") &&
      htmlDoc.querySelector("oembed").getAttribute("url");
    if (embedURL) {
      let child = htmlDoc.querySelector("oembed");
      let newDoc =
        htmlDoc && htmlDoc.body && htmlDoc.body.querySelectorAll("figure");
      newDoc.forEach(async (item) => {
        if (item.contains(child)) {
          item.removeChild(child);
          let res = await getRequestWithoutAuth(
            `https://iframe.ly/api/oembed?url=${embedURL}&api_key=c73936455e7dda891b905d`
          );
          item.insertAdjacentHTML("beforeend", res.html);
          var clean = sanitizeHtml(htmlDoc.body.outerHTML, SANITIZER_CONFIG);
          this.setState({
            embedURL: embedURL,
            iframelyHTML: clean,
          });
          var htmlDocCheck = parser.parseFromString(clean, "text/html");
          if (clean.length > 150) {
            this.setState({ showMore: true });
          }
          let second = htmlDocCheck && htmlDocCheck.querySelector("oembed");
          if (second) {
            this.ParseHTML(clean);
          }
        }
      });
    } else {
      let desc = this.state.iframelyHTML;
      if (description !== this.state.iframelyHTML) {
        desc = description;
      }
      var clean = sanitizeHtml(desc, SANITIZER_CONFIG);
      if (clean.length > 150) {
        this.setState({ showMore: true });
      }
      this.setState({
        iframelyHTML: clean,
      });
    }
  }
  /**
   * Called to render the HTML for the embeds
   */
  getIframelyHtml() {
    return { __html: this.state.iframelyHTML };
  }
  componentDidMount() {
    window.iframely && iframely.load();
    this.ParseHTML(this.props.descriptionData);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.descriptionData !== this.props.descriptionData) {
      window.iframely && iframely.load();
      this.ParseHTML(this.props.descriptionData);
    }
  }

  render() {
    const { fontColor, buttonColor } = this.props;
    return (
      <div
        style={{
          overflow: "auto",
          height: "230px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={
              {
                color: fontColor,
                borderBottom: `4px solid ${buttonColor}`,
              } || null
            }
            className={styles.descriptionTab}
          >
            Description
          </div>
        </div>
        <p
          style={
            {
              color: fontColor,
            } || null
          }
          className={styles.description}
          dangerouslySetInnerHTML={this.getIframelyHtml()}
        />
      </div>
    );
  }
}

export default Description;
