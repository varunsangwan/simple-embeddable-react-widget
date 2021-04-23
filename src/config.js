export const API_HOST1 =
  "https://f4r75vsf8k.execute-api.us-east-1.amazonaws.com/prod";
export const API_DEV =
  "https://5p7xzvdgu9.execute-api.us-east-1.amazonaws.com/dev";
export const CORS_PROXY =
  "https://g1s14sw900.execute-api.us-east-1.amazonaws.com/prod/cors-proxy/?url=";
export const search = `${API_HOST1}/search`;
export const ESSearch = `https://search-mintable-eth-search-dny3k7asv3l7blchtresn3k6se.us-east-1.es.amazonaws.com/`;
export const fetchCurrentItem = `${API_HOST1}/listings/byusername`;
export const fetchItem = `${API_HOST1}/listings/`;
export const PRICE_FEED =
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
export const BACKUP_PRICE_FEED =
  "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=1EKKQSZBAD4UDNKSYIZQ5M1YS1WZ8RXN99";
export const PROFILE_S3_BUCKET = `https://mintable-user-profile-bucket-test-demo2.s3-us-west-2.amazonaws.com/`;
export const userProfile = `${API_HOST1}/profile`;

export const SANITIZER_CONFIG = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "p",
    "a",
    "ul",
    "ol",
    "nl",
    "li",
    "b",
    "i",
    "strong",
    "em",
    "strike",
    "abbr",
    "code",
    "hr",
    "br",
    "div",
    "table",
    "thead",
    "caption",
    "tbody",
    "tr",
    "th",
    "td",
    "pre",
    "iframe",
    "img",
    "figure",
    "oembed",
  ],
  disallowedTagsMode: "discard",
  allowedAttributes: {
    a: ["href", "name", "target"],
    iframe: ["src", "style", "scrolling", "allow"],
    figure: ["class"],
    div: ["style"],
    oembed: ["url"],
    // We don't currently allow img itself by default, but this
    // would make sense if we did. You could add srcset here,
    // and if you do the URL is checked for safety
    img: ["src"],
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [
    "img",
    "br",
    "hr",
    "area",
    "base",
    "basefont",
    "input",
    "link",
    "meta",
  ],
  // URL schemes we permit
  allowedSchemes: ["http", "https", "ftp", "mailto"],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
  allowProtocolRelative: true,
  allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
};
