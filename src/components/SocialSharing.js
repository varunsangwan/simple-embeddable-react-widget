import React from "react";
import instagramImg from "../assets/instagram.png";
import redditImg from "../assets/reddit.png";
import twitterImg from "../assets/twitter.png";
import youtubeImg from "../assets/youtube.png";
import styles from "./socialSharing.module.css";

export default function SocialSharing(props) {
  const { instagram, twitter, reddit, cent, youtube } = props;

  return (
    <div>
      <ul className={styles.container}>
        <li>
          {instagram && (
            <a
              href={`https://instagram.com/` + instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className={styles.iconContainer} src={instagramImg} alt="" />
            </a>
          )}
        </li>
        <li>
          {twitter && (
            <a
              href={`https://twitter.com/` + twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className={styles.iconContainer} src={twitterImg} alt="" />
            </a>
          )}
        </li>
        <li>
          {reddit && (
            <a
              href={`https://reddit.com/u/` + reddit}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className={styles.iconContainer} src={redditImg} alt="" />
            </a>
          )}
        </li>
        <li>
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
        </li>
        <li>
          {youtube && (
            <a
              href={`https://youtube.com/` + youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className={styles.iconContainer} src={youtubeImg} alt="" />
            </a>
          )}
        </li>
      </ul>
    </div>
  );
}
