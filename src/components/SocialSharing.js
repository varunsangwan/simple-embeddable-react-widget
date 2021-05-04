import React from "react";
import instagramImg from "../assets/instagram.svg";
import redditImg from "../assets/reddit.svg";
import twitterImg from "../assets/twitter.svg";
import styles from "./socialSharing.module.css";

export default function SocialSharing(props) {
  const { instagram, twitter, reddit } = props;

  return (
    <div className={styles.container}>
      <div>
        {true && (
          <a
            href={`https://instagram.com/` + instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.iconContainer} src={instagramImg} alt="" />
          </a>
        )}
      </div>
      <div>
        {twitter && (
          <a
            href={`https://twitter.com/` + twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.iconContainer} src={twitterImg} alt="" />
          </a>
        )}
      </div>
      <div>
        {reddit && (
          <a
            href={`https://reddit.com/u/` + reddit}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.iconContainer} src={redditImg} alt="" />
          </a>
        )}
      </div>
      {/* <div>
          {cent && (
            <a
              href={`https://beta.cent.co/` + cent}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className={styles.iconContainer}
                src="https://d2alktbws33m8c.cloudfront.net/cent.png"
                alt=""
              />
            </a>
          )}
        </div>
        <div>
          {youtube && (
            <a
              href={`https://youtube.com/` + youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className={styles.iconContainer} src={youtubeImg} alt="" />
            </a>
          )}
        </div> */}
    </div>
  );
}
