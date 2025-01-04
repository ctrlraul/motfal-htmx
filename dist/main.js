// src/routers/game-router.tsx
import { Router as Router2, urlencoded } from "express";

// src/helpers/escape-html.ts
var matchHtmlRegExp = /["'&<>]/;
var escape_html_default = escapeHtml;
function escapeHtml(string) {
  const str = "" + string;
  const match = matchHtmlRegExp.exec(str);
  if (!match) {
    return str;
  }
  let escape;
  let html = "";
  let index = 0;
  let lastIndex = 0;
  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escape = "&quot;";
        break;
      case 38:
        escape = "&amp;";
        break;
      case 39:
        escape = "&#39;";
        break;
      case 60:
        escape = "&lt;";
        break;
      case 62:
        escape = "&gt;";
        break;
      default:
        continue;
    }
    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }
    lastIndex = index + 1;
    html += escape;
  }
  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

// src/jsx.ts
import { parseDocument, ElementType } from "htmlparser2";
var voidElements = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
function jsx(type, attributes, ...children) {
  if (typeof type === "function") {
    if (type === Fragment)
      return children;
    return type({ ...attributes, children });
  }
  return {
    type,
    attributes: attributes || {},
    children
  };
}
function Fragment(_type, _attributes, ...children) {
  return children;
}
function render(element, indent2 = "") {
  if (typeof element === "string")
    return indent2 + escape_html_default(element);
  if (Array.isArray(element))
    return element.map((item) => render(item, indent2)).join("\n");
  if (typeof element === "object" && element !== null)
    return renderElement(element);
  return String(element);
}
function fromHtml(html) {
  const dom = parseDocument(html);
  const result = dom.children.map((child) => toJsxElement(child)).filter((element) => element != null);
  return result;
}
function toJsxElement(node) {
  switch (node.type) {
    case ElementType.Text:
      return node.data;
    case ElementType.Tag:
    case ElementType.Script:
    case ElementType.Style:
      return {
        type: node.name,
        attributes: node.attribs,
        children: node.children.map(toJsxElement).filter((child) => child != null)
      };
    case ElementType.Root:
    case ElementType.Directive:
    case ElementType.CDATA:
      break;
  }
  return null;
}
function renderElement(element) {
  const { type: tag } = element;
  let attributes = "";
  let innerHtml = null;
  for (const [key, value] of Object.entries(element.attributes)) {
    if (value === void 0)
      continue;
    switch (key) {
      case "DANGEROUSLY_SET_OUTER_HTML":
        return String(value);
      case "DANGEROUSLY_SET_INNER_HTML":
        innerHtml = String(value);
        break;
      default:
        attributes += ` ${key}="${escape_html_default(String(value))}"`;
        break;
    }
  }
  const content = innerHtml ? innerHtml : element.children.map((item) => render(item)).join("");
  if (voidElements.has(tag) && content.length === 0)
    return `<${tag}${attributes} />`;
  return `<${tag}${attributes}>${content}</${tag}>`;
}

// src/html/components/Style.tsx
function Style(props) {
  return /* @__PURE__ */ jsx("style", { DANGEROUSLY_SET_INNER_HTML: props.css });
}

// src/html/CookiesPopup.tsx
function CookiesPopup() {
  return /* @__PURE__ */ jsx("div", { id: "cookiesPopup" }, /* @__PURE__ */ jsx("div", { class: "g-box-pop g-foreground" }, /* @__PURE__ */ jsx("span", null, "Hi there! We only use cookies that are essential for the site to function\u2014nothing extra. Thanks for visiting!"), /* @__PURE__ */ jsx("div", { class: "buttons" }, /* @__PURE__ */ jsx(
    "button",
    {
      "hx-post": "/cookies/accept",
      "hx-target": "#cookiesPopup",
      "hx-swap": "outerHTML"
    },
    "Accept"
  ), /* @__PURE__ */ jsx("div", { class: "spacer" }), /* @__PURE__ */ jsx("button", { "hx-post": "/cookies/reject" }, "Reject"))));
}

// src/html/Root.tsx
function Root(props) {
  return /* @__PURE__ */ jsx("html", { lang: "en" }, /* @__PURE__ */ jsx("head", null, /* @__PURE__ */ jsx("meta", { charset: "UTF-8" }), /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), /* @__PURE__ */ jsx("title", null, props.title), /* @__PURE__ */ jsx("link", { rel: "icon", type: "image/svg", href: "images/branding/logo-x64.svg" }), /* @__PURE__ */ jsx("link", { rel: "stylesheet", href: "global.css" }), /* @__PURE__ */ jsx("script", { src: "https://unpkg.com/htmx.org@2.0.4" }), /* @__PURE__ */ jsx("script", { src: "https://unpkg.com/htmx-ext-sse@2.2.2/sse.js" })), /* @__PURE__ */ jsx("body", { "hx-ext": "sse", "sse-connect": "/sse" }, /* @__PURE__ */ jsx("div", { id: "root" }, /* @__PURE__ */ jsx("div", { class: "g-content-width" }, props.children)), props.user.acceptedCookies ? "" : /* @__PURE__ */ jsx(CookiesPopup, null)));
}

// src/html/MainHeader.tsx
function MainHeader(props) {
  const css = (
    /*css*/
    `
		header.main {
			font-size: calc(1rem * sqrt(2));
			font-weight: 600;
			text-align: center;
			padding: 0.5rem;
		}
	`
  );
  return /* @__PURE__ */ jsx("header", { class: "main g-box g-foreground g-round-header-corners" }, /* @__PURE__ */ jsx("i", null, props.children || "Most Of These Folks Are Lying"), /* @__PURE__ */ jsx("style", null, css));
}

// src/html/icons.tsx
import * as path from "path";

// src/helpers/import-text.ts
import { join } from "path";

// src/helpers/env.ts
import { config } from "dotenv";
config();
function env(name, defaultValue) {
  const value = process.env[name];
  if (typeof value === "string")
    return value;
  if (typeof defaultValue === "string")
    return defaultValue;
  throw new Error(`Missing required environment variable '${name}'`);
}

// src/helpers/import-text.ts
import { readFileSync } from "fs";
var cache = /* @__PURE__ */ new Map();
var useCache = env("ENV") != "DEV";
function importText(...pathSegments) {
  const filePath = join(...pathSegments);
  let text = cache.get(filePath);
  if (!text) {
    text = readFileSync(filePath, "utf8");
    if (useCache)
      cache.set(filePath, text);
  }
  return text;
}

// src/helpers/omit.ts
function omit(object, keys) {
  const keySet = new Set(keys);
  const copy = {};
  for (const key in object) {
    if (keySet.has(key))
      continue;
    copy[key] = object[key];
  }
  return copy;
}

// src/html/components/FromHtml.tsx
function FromHtml(props) {
  const elements = fromHtml(props.html);
  const first = elements[0];
  if (elements.length === 0 || typeof first === "string")
    return /* @__PURE__ */ jsx(Fragment, null, elements);
  if (props.children)
    first.children.push(...props.children);
  Object.assign(first.attributes, omit(props, ["html"]));
  return /* @__PURE__ */ jsx(Fragment, null, elements);
}

// src/html/components/Svg.tsx
function Svg(props) {
  const svg = importText(props.src);
  const attributes = omit(props, ["src"]);
  return /* @__PURE__ */ jsx(FromHtml, { ...attributes, html: svg });
}

// src/html/icons.tsx
function Check(props) {
  return /* @__PURE__ */ jsx(Svg, { ...props, src: path.join(process.cwd(), "/static/images/icons/check.svg") });
}
function Exit(props) {
  return /* @__PURE__ */ jsx(Svg, { ...props, src: path.join(process.cwd(), "/static/images/icons/exit.svg") });
}
function OpenExternal(props) {
  return /* @__PURE__ */ jsx(Svg, { ...props, src: path.join(process.cwd(), "/static/images/icons/open-external.svg") });
}
function Pencil(props) {
  return /* @__PURE__ */ jsx(Svg, { ...props, src: path.join(process.cwd(), "/static/images/icons/pencil.svg") });
}

// src/html/pages/home/NickSection.tsx
function NickSection(props) {
  return /* @__PURE__ */ jsx("div", { id: "nick", "hx-get": "/nick-change", "hx-swap": "outerHTML" }, "Playing as", /* @__PURE__ */ jsx("span", null, props.nick), /* @__PURE__ */ jsx(Pencil, null));
}

// src/html/components/LoadingSpinner.tsx
function LoadingSpinner(props) {
  const element = /* @__PURE__ */ jsx("div", { ...props }, /* @__PURE__ */ jsx("div", { class: "spinner" }));
  if (!element.attributes.class)
    element.attributes.class = "";
  element.attributes.class += " g-loading-spinner g-indicator";
  return element;
}

// src/html/pages/home/style.css
var style_default = "main {\r\n	align-items: center;\r\n	justify-content: center;\r\n}\r\n\r\n\r\n.content {\r\n	display: flex;\r\n	align-items: center;\r\n	justify-content: center;\r\n	flex-direction: column;\r\n	gap: 1rem;\r\n}\r\n\r\n\r\nbutton.create {\r\n	display: block;\r\n	width: 100%;\r\n}\r\n\r\n\r\nform.join {\r\n	position: relative;\r\n	display: flex;\r\n	gap: 1rem;\r\n	width: 100%;\r\n}\r\n\r\nform.join input[type=text] {\r\n	flex: 1;\r\n	width: 0; /* Without this it grows too much for some reason */\r\n}\r\n\r\nform.join button {\r\n	width: 3rem;\r\n}\r\n\r\n\r\n\r\ndiv#nick,\r\nform#nick {\r\n	height: 5rem;\r\n}\r\n\r\ndiv#nick {\r\n	display: flex;\r\n	margin-top: 2rem;\r\n	align-items: center;\r\n	gap: 0.25rem;\r\n	width: 100%;\r\n	justify-content: center;\r\n}\r\n\r\ndiv#nick span {\r\n	color: var(--color-accent);\r\n	font-weight: 700;\r\n}\r\n\r\ndiv#nick > svg {\r\n	margin-left: 0.25rem;\r\n	width: 1.25rem;\r\n}\r\n\r\nform#nick {\r\n	margin-top: 2rem;\r\n	display: grid;\r\n	grid-template-areas: 'i i' 'c o';\r\n	grid-template-rows: 1fr 1fr;\r\n	grid-template-columns: 1fr 1fr;\r\n	gap: 0.5rem;\r\n}\r\n\r\nform#nick input {\r\n	grid-area: i;\r\n}\r\n\r\nform#nick .cancel {\r\n	grid-area: c;\r\n}\r\n\r\nform#nick .ok {\r\n	grid-area: o;\r\n}\r\n\r\n\r\nfooter {\r\n	text-align: center;\r\n	padding: 1rem;\r\n}";

// src/html/pages/home/Page.tsx
function Home(props) {
  return /* @__PURE__ */ jsx(
    Root,
    {
      title: "Mo\xFEFAL - Most of these Folks Are Lying",
      user: props.user
    },
    /* @__PURE__ */ jsx(MainHeader, null, "Mo\xFEFAL"),
    /* @__PURE__ */ jsx("main", null, /* @__PURE__ */ jsx("div", { class: "content g-box" }, /* @__PURE__ */ jsx(
      "button",
      {
        class: "g-big create",
        "hx-get": "/make",
        "hx-target": "#root",
        "hx-swap": "outerHTML",
        "hx-push-url": "true"
      },
      "Make new room"
    ), /* @__PURE__ */ jsx(
      "form",
      {
        class: "join",
        "hx-post": "/join",
        "hx-target": "#root",
        "hx-swap": "outerHTML",
        "hx-trigger": "submit",
        "hx-indicator": "#join-indicator"
      },
      /* @__PURE__ */ jsx(
        "input",
        {
          class: "g-big",
          type: "text",
          id: "code",
          name: "code",
          placeholder: "Go to room",
          required: true
        }
      ),
      /* @__PURE__ */ jsx("button", { class: "g-big", type: "submit" }, "\u2386"),
      /* @__PURE__ */ jsx(LoadingSpinner, { id: "join-indicator", style: "border-radius: var(--radius-common)" })
    ), /* @__PURE__ */ jsx(NickSection, { nick: props.user.nick }))),
    /* @__PURE__ */ jsx(
      "footer",
      {
        "hx-get": "/rules",
        "hx-target": "#root",
        "hx-swap": "outerHTML",
        "hx-push-url": "true"
      },
      "How to play"
    ),
    /* @__PURE__ */ jsx(Style, { css: style_default })
  );
}

// src/html/pages/rules/style.css
var style_default2 = "main {\r\n	text-align: center;\r\n	justify-content: center;\r\n	gap: 2rem;\r\n	padding: 1rem;\r\n}\r\n\r\nbutton {\r\n	margin: 1rem;\r\n}\r\n\r\nfooter {\r\n	text-align: center;\r\n	margin: 1rem;\r\n}";

// src/html/pages/rules/page.tsx
function Rules({ user }) {
  return /* @__PURE__ */ jsx(Root, { title: "Mo\xFEFAL - How to play", user }, /* @__PURE__ */ jsx(MainHeader, null, "How to play"), /* @__PURE__ */ jsx("main", null, /* @__PURE__ */ jsx("div", null, "One player is the guesser, the rest are liars."), /* @__PURE__ */ jsx("div", null, "Each liar selects an article."), /* @__PURE__ */ jsx("div", null, "One article is picked at random, and only its title is shown."), /* @__PURE__ */ jsx("div", null, "The liars come up with their own description of what the article is about."), /* @__PURE__ */ jsx("div", null, "The guesser tries to figure out which liar chose the article.")), /* @__PURE__ */ jsx(
    "footer",
    {
      "hx-get": "/",
      "hx-target": "#root",
      "hx-swap": "outerHTML",
      "hx-push-url": "true"
    },
    "Ok"
  ), /* @__PURE__ */ jsx(Style, { css: style_default2 }));
}

// src/articles/domains/pokeapi.co.ts
import * as changeCase from "change-case";
import Axios from "axios";
var pokedexBaseUrl = "https://www.pokemon.com/us/pokedex/";
var apiBaseUrl = "https://pokeapi.co/api/v2";
var axios = Axios.create({ baseURL: apiBaseUrl });
var totalPokemon = 0;
async function getArticle(id4) {
  const parsedId = parsePokemonId(id4);
  const response = await axios.get("/pokemon/" + parsedId);
  const article = {
    description: changeCase.capitalCase(response.data.name) + " is a pokemon!",
    italic: false,
    link: pokedexBaseUrl + response.data.name,
    title: changeCase.capitalCase(response.data.name),
    thumbnail: response.data.sprites.front_default
  };
  return article;
}
async function getRandomArticles(count, _rules) {
  if (totalPokemon === 0) {
    const response = await axios.get("/pokemon-species?limit=1");
    totalPokemon = response.data.count;
  }
  const randomIds = Array.from({ length: count }, () => Math.floor(Math.random() * totalPokemon) + 1);
  const promises = randomIds.map((id4) => axios.get("/pokemon/" + id4));
  const responses = await Promise.all(promises);
  const suggestions = responses.map((response) => ({
    id: changeCase.capitalCase(response.data.name),
    title: changeCase.capitalCase(response.data.name),
    search: pokedexBaseUrl + response.data.name
  }));
  return suggestions;
}
function parsePokemonId(id4) {
  if (id4.indexOf("/") !== -1) {
    const pathSegments = id4.split("/");
    const encodedTitle = pathSegments[pathSegments.length - 1];
    return changeCase.kebabCase(decodeURIComponent(encodedTitle));
  }
  const int = parseInt(id4);
  if (!isNaN(int))
    return int.toString();
  return changeCase.kebabCase(id4);
}
var PokeApi = {
  name: "Pokemon",
  itemName: "pokemon",
  submitInputPlaceholder: "Pokemon name, ID, or pokedex link",
  ruleSet: [],
  getArticle,
  getRandomArticles
};

// src/articles/domains/wikipedia.org.ts
import Axios2 from "axios";
var apiBaseUrl2 = "https://wikipedia.org/";
var axios2 = Axios2.create({ baseURL: apiBaseUrl2 });
async function getArticle2(id4) {
  const title = getTitleFromId(id4);
  const response = await axios2.get("/w/api.php", {
    params: {
      action: "query",
      titles: title,
      format: "json",
      redirects: "1",
      prop: "pageprops|pageimages|description|extracts",
      exintro: "1",
      explaintext: "1",
      pithumbsize: "500",
      origin: "*"
    }
  });
  const pageData = Object.values(response.data.query.pages)[0];
  const article = {
    link: new URL("wiki/" + title, apiBaseUrl2).href,
    title: response.data.query.redirects ? response.data.query.redirects[0].from : pageData.title,
    description: pageData.extract,
    thumbnail: pageData.thumbnail ? pageData.thumbnail.source : null,
    italic: (pageData.pageprops.displaytitle || "").startsWith("<i>")
  };
  return article;
}
async function getRandomArticles2(count, _rules) {
  const namespaces = [
    0
    // Articles namespace
  ];
  const response = await axios2.get("/w/api.php", {
    params: {
      action: "query",
      generator: "random",
      grnnamespace: namespaces.join("|"),
      grnlimit: count.toString(),
      format: "json",
      origin: "*"
      // Handle CORS
    }
  });
  const suggestions = Object.values(response.data.query.pages).map((item) => ({
    id: item.title,
    search: new URL("wiki/" + item.title, apiBaseUrl2).href,
    title: item.title
  }));
  return suggestions;
}
function getTitleFromId(id4) {
  if (id4.indexOf("/") === -1)
    return id4;
  const protocolTest = /^(http|https):\/\//;
  const url = new URL(protocolTest.test(id4) ? id4 : "https://" + id4);
  if (url.searchParams.has("title"))
    return url.searchParams.get("title");
  const pathSegments = url.pathname.split("/");
  const encodedTitle = pathSegments[pathSegments.length - 1];
  return decodeURIComponent(encodedTitle);
}
var WikipediaOrg = {
  name: "Wikipedia",
  itemName: "Article",
  submitInputPlaceholder: "Article name or Wikipedia link",
  ruleSet: [{
    id: "anyNamespace",
    name: "Any Namespace",
    description: "Allow picking articles in any namespace",
    defaultValue: true
  }, {
    id: "preserveTitleStyle",
    name: "Preserve Title Style",
    description: "Preserve the title style of articles (italics)",
    defaultValue: true
  }],
  getArticle: getArticle2,
  getRandomArticles: getRandomArticles2
};

// src/articles/domains/wiktionary.org.ts
import Axios3 from "axios";
var apiBaseUrl3 = "https://wiktionary.org/";
var axios3 = Axios3.create({ baseURL: apiBaseUrl3 });
async function getArticle3(id4) {
  const title = getTitleFromId2(id4);
  const response = await axios3.get("/w/api.php", {
    params: {
      action: "query",
      titles: title,
      format: "json",
      redirects: "1",
      prop: "extracts|description",
      exintro: "1",
      explaintext: "1",
      origin: "*"
    }
  });
  const pageData = Object.values(response.data.query.pages)[0];
  const articleData = {
    link: new URL("wiki/" + title, apiBaseUrl3).href,
    title: response.data.query.redirects ? response.data.query.redirects[0].from : pageData.title,
    description: pageData.extract,
    thumbnail: "",
    italic: false
  };
  return articleData;
}
async function getRandomArticles3(amount, _rules) {
  const namespaces = [
    0
    // Articles namespace
  ];
  const response = await axios3.get("/w/api.php", {
    params: {
      action: "query",
      generator: "random",
      grnnamespace: namespaces.join("|"),
      grnlimit: amount.toString(),
      format: "json",
      origin: "*"
      // Handle CORS
    }
  });
  const suggestions = Object.values(response.data.query.pages).map((item) => ({
    id: item.title,
    search: new URL("wiki/" + item.title, apiBaseUrl3).href,
    title: item.title
  }));
  return suggestions;
}
function getTitleFromId2(id4) {
  if (id4.indexOf("/") === -1)
    return id4;
  const protocolTest = /^(http|https):\/\//;
  const url = new URL(protocolTest.test(id4) ? id4 : "https://" + id4);
  if (url.searchParams.has("title"))
    return url.searchParams.get("title");
  const pathSegments = url.pathname.split("/");
  const encodedTitle = pathSegments[pathSegments.length - 1];
  return decodeURIComponent(encodedTitle);
}
var WiktionaryOrg = {
  name: "Wiktionary",
  itemName: "word",
  submitInputPlaceholder: "Word or Wiktionary link",
  ruleSet: [{
    id: "anyNamespace",
    name: "Any Namespace",
    description: "Allow picking articles in any namespace",
    defaultValue: true
  }],
  getArticle: getArticle3,
  getRandomArticles: getRandomArticles3
};

// src/articles/articles-helper.ts
var domains = /* @__PURE__ */ new Map();
domains.set(WikipediaOrg.name, WikipediaOrg);
domains.set(WiktionaryOrg.name, WiktionaryOrg);
domains.set(PokeApi.name, PokeApi);
function getArticle4(domainName, link) {
  return domains.get(domainName).getArticle(link);
}
function getRandomArticles4(domainName, count, rules) {
  return domains.get(domainName).getRandomArticles(count, rules);
}
function createRules(domainName, params) {
  const ruleSet = domains.get(domainName).ruleSet;
  const rules = {};
  for (const rule of ruleSet) {
    const param = params[domainName + "-" + rule.id];
    rules[rule.id] = param === "on";
  }
  return rules;
}
function getRule(domainName, id4) {
  const ruleSet = domains.get(domainName).ruleSet;
  for (const rule of ruleSet) {
    if (rule.id == id4)
      return rule;
  }
  throw new Error(`Domain '${domainName}' has no rule with id '${id4}'`);
}
function getRules(domainName) {
  return domains.get(domainName).ruleSet;
}
function getDomain(domainName) {
  return domains.get(domainName);
}
function getDomains() {
  return Array.from(domains.values());
}
function isDomainRegistered(domain) {
  return domains.has(domain);
}
var ArticlesHelper = {
  getArticle: getArticle4,
  getRandomArticles: getRandomArticles4,
  createRules,
  getRule,
  getRules,
  // TODO: Get rid
  getDomain,
  getDomains,
  isDomainRegistered
};

// src/html/pages/make/style.css
var style_default3 = "main {\r\n	justify-content: center;\r\n}\r\n\r\n\r\nsection > .header {\r\n	text-align: center;\r\n	margin-bottom: 0.5rem;\r\n}\r\n\r\nsection > .items {\r\n	display: flex;\r\n	flex-direction: column;\r\n	gap: 0.5rem;\r\n}\r\n\r\n\r\nlabel.option {\r\n	display: flex;\r\n	align-items: center;\r\n	gap: 0.5rem;\r\n	padding: 0.25rem 0.5rem;\r\n	width: 100%;\r\n	height: 2rem;\r\n	background-color: var(--color-background);\r\n	border-radius: var(--radius-common);\r\n}\r\n\r\n\r\nsection.rules {\r\n	display: flex;\r\n	flex: 1;\r\n	flex-direction: column;\r\n}\r\n\r\nsection.rules > .items {\r\n	flex: 1;\r\n	flex-direction: column;\r\n}\r\n\r\nsection.rules > .items > .checkboxes {\r\n	display: flex;\r\n	flex-direction: column;\r\n	gap: 0.5rem;\r\n	flex: 1;\r\n	overflow-y: scroll;\r\n}\r\n\r\nsection.rules .limit-container {\r\n	display: flex;\r\n	align-items: center;\r\n	gap: inherit;\r\n	height: 2.25rem;\r\n}\r\n\r\nsection.rules .limit-container label {\r\n	flex: 1;\r\n	width: initial;\r\n}\r\n\r\nsection.rules .limit-container input[type='number'] {\r\n	width: 4.5rem;\r\n}\r\n\r\nsection.rules .limit-container > * {\r\n	height: 100%;\r\n}\r\n\r\n/*\r\ninput[type='checkbox'] {\r\n	margin-right: 0.5rem;\r\n} */\r\n\r\n\r\nbutton.make {\r\n	margin: 1rem;\r\n}\r\n\r\n\r\nfooter {\r\n	text-align: center;\r\n	margin: 1rem;\r\n}\r\n";

// src/html/pages/make/Page.tsx
var limitUsers = false;
function MakeRoom(props) {
  return /* @__PURE__ */ jsx(Root, { title: "Mo\xFEFAL - Make Room", user: props.user }, /* @__PURE__ */ jsx(MainHeader, null, "Make Room"), /* @__PURE__ */ jsx("main", null, /* @__PURE__ */ jsx(DomainsSection, null), /* @__PURE__ */ jsx(RulesSection, null), props.currentRoom ? /* @__PURE__ */ jsx("div", { class: "g-box-pop g-foreground" }, /* @__PURE__ */ jsx("label", { class: "option" }, /* @__PURE__ */ jsx("input", { type: "checkbox", name: "invite", checked: true }), "Invite previous room")) : "", /* @__PURE__ */ jsx(
    "button",
    {
      class: "make g-big",
      "hx-post": "/make",
      "hx-target": "#root",
      "hx-swap": "outerHTML",
      "hx-include": "input",
      "hx-push-url": "true",
      "hx-indicator": "#make-indicator"
    },
    "Make"
  ), /* @__PURE__ */ jsx(LoadingSpinner, { id: "make-indicator" })), /* @__PURE__ */ jsx("footer", null, /* @__PURE__ */ jsx(
    "div",
    {
      "hx-get": "/",
      "hx-target": "#root",
      "hx-swap": "outerHTML",
      "hx-push-url": "true"
    },
    "Cancel"
  )), /* @__PURE__ */ jsx(Style, { css: style_default3 }));
}
function DomainsSection() {
  const onclick = `
		document.querySelectorAll('[data-domain]').forEach(x => x.hidden = true);
		document.querySelectorAll('[data-domain="%domain%"]').forEach(x => x.hidden = false);
	`;
  return /* @__PURE__ */ jsx("section", { class: "domains g-box-pop g-foreground" }, /* @__PURE__ */ jsx("div", { class: "header" }, "Domain"), /* @__PURE__ */ jsx("div", { class: "items" }, ArticlesHelper.getDomains().map((domain, i) => /* @__PURE__ */ jsx("label", { class: "option", onclick: onclick.replace("%domain%", domain.name) }, /* @__PURE__ */ jsx("input", { type: "radio", name: "domain", value: domain.name, checked: !i || void 0 }), domain.name))));
}
function RulesSection() {
  return /* @__PURE__ */ jsx("section", { class: "rules g-box-pop g-foreground" }, /* @__PURE__ */ jsx("div", { class: "header" }, "Rules"), /* @__PURE__ */ jsx("div", { class: "items" }, /* @__PURE__ */ jsx("div", { class: "checkboxes" }, ArticlesHelper.getDomains().map(
    (domain, i) => domain.ruleSet.map((rule) => /* @__PURE__ */ jsx("div", { "data-domain": domain.name, hidden: !!i || void 0 }, /* @__PURE__ */ jsx("label", { class: "option" }, /* @__PURE__ */ jsx("input", { type: "checkbox", name: domain.name + "-" + rule.id, checked: rule.defaultValue }), rule.name)))
  )), /* @__PURE__ */ jsx("div", { class: "g-hr" }), /* @__PURE__ */ jsx("div", { class: "limit-container" }, /* @__PURE__ */ jsx("label", { class: "option" }, /* @__PURE__ */ jsx(
    "input",
    {
      type: "checkbox",
      name: "limit-users",
      onclick: "limitInput.hidden = !this.checked",
      checked: limitUsers || void 0
    }
  ), "Participants limit"), /* @__PURE__ */ jsx(
    "input",
    {
      id: "limitInput",
      type: "number",
      name: "users-limit",
      value: 4,
      min: 3,
      max: 40,
      step: 1,
      hidden: !limitUsers
    }
  ))));
}

// src/helpers/object-length.ts
function objectLength(obj) {
  return Object.keys(obj).length;
}

// src/html/pages/room/guesser/UsersCount.tsx
var id = "users-count";
function UsersCount(props) {
  if (props.swappingExistent == void 0)
    props.swappingExistent = true;
  const text = `Participants ( ${getCountString(props.room)} )`;
  if (props.swappingExistent) {
    return /* @__PURE__ */ jsx("span", { id, "hx-swap-oob": "outerHTML:#" + id }, text);
  }
  return /* @__PURE__ */ jsx("span", { id }, text);
}
function getCountString(room) {
  const usersCount = objectLength(room.users);
  if (room.usersLimit == 0)
    return usersCount;
  return usersCount + "/" + room.usersLimit;
}

// src/helpers/logger.ts
var Logger = class _Logger {
  label;
  constructor(label) {
    this.label = label;
  }
  log(...message) {
    _Logger.log(this.label, ...message);
  }
  static log(label, ...message) {
    console.log(`[${label}]`, ...message);
  }
};

// src/helpers/random-string.ts
function randomString(length, charSet = "abcdefghijklmnopqrstuvwxyz0123456789") {
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    result += charSet.charAt(randomIndex);
  }
  return result;
}

// src/helpers/token-helper.ts
import tnacl from "tweetnacl";
function createSecretToken(data, secret2) {
  const nonce = tnacl.randomBytes(tnacl.secretbox.nonceLength);
  const payload = Buffer.from(JSON.stringify(data));
  const box = tnacl.secretbox(payload, nonce, secret2);
  const token = Buffer.concat([nonce, box]);
  return token.toString("base64");
}
function readSecretToken(token, secret2) {
  const buf = Buffer.from(token, "base64");
  const nonce = buf.slice(0, tnacl.secretbox.nonceLength);
  const box = buf.slice(tnacl.secretbox.nonceLength);
  const payload = Buffer.from(tnacl.secretbox.open(box, nonce, secret2));
  const obj = JSON.parse(payload.toString());
  return obj;
}
function generateId(byteLength = 128) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  const base64 = btoa(String.fromCharCode(...bytes));
  const urlSafeToken = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return urlSafeToken;
}
var TokenHelper = {
  createSecretToken,
  readSecretToken,
  generateId
};

// src/middlewares/session-parser.ts
import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";
import { randomUUID } from "crypto";
var Session = class {
  id;
  user;
  // Not so much readonly as we want it to be public get but private set
  constructor(id4) {
    this.id = id4;
    this.user = {
      id: randomUUID(),
      nick: generateNick(),
      acceptedCookies: false
    };
  }
  save(res, data) {
    if (data)
      Object.assign(this.user, data);
    const token = TokenHelper.createSecretToken(this, secret);
    res.cookie(cookieName, token);
  }
};
var secret = Buffer.from(env("SESSIONS_SECRET"));
var cookieName = "session";
async function middleware(req, res, next) {
  if (cookieName in req.cookies) {
    req.session = TokenHelper.readSecretToken(req.cookies[cookieName], secret);
    req.session.save = Session.prototype.save;
  } else {
    const session = new Session(TokenHelper.generateId());
    session.save(res);
    req.session = session;
  }
  await next();
}
function generateNick() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: " ",
    style: "capital"
  });
}
var SessionParser = {
  cookieName,
  middleware
};

// src/managers/event-sender.ts
import { Router } from "express";
var logger = new Logger("EventSender");
var targets = /* @__PURE__ */ new Map();
var router = Router();
router.use(SessionParser.middleware);
router.get("/sse", async (req, res) => {
  const { user } = req.session;
  const target = res;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  targets.set(user.id, target);
  req.on("close", () => {
    logger.log(user.nick, "disconnected");
    RoomsManager.notifyUserDisconnected(user);
    targets.delete(user.id);
  });
  logger.log(user.nick, "connected");
  RoomsManager.notifyUserConnected(user);
});
function send(userId, type, html) {
  const target = targets.get(userId);
  if (!target)
    return;
  target.write(`event: ${type}
`);
  target.write(`data: ${html}

`);
}
function sendHtml(userId, html) {
  targets.get(userId)?.write(html);
}
function isConnected(userId) {
  return targets.has(userId);
}
var EventSender = {
  router,
  send,
  sendHtml,
  isConnected
};

// src/html/pages/room/guesser/UsersListItem.tsx
var Check2 = /* @__PURE__ */ jsx("span", { style: "color: var(--color-accent);" }, /* @__PURE__ */ jsx(Check, null));
function getSwapString(userId) {
  return `UpdateUsersListItem-${userId}`;
}
function UsersListItem({ user, room }) {
  const check = room.articles.find((article) => article.userId == user.id);
  const classes = [];
  if (!EventSender.isConnected(user.id))
    classes.push("disconnected");
  if (user.id === room.guesserId)
    classes.push("guesser");
  return /* @__PURE__ */ jsx(
    "li",
    {
      class: classes.join(" "),
      "sse-swap": getSwapString(user.id),
      "hx-swap": "outerHTML"
    },
    /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("span", { class: "nick" }, user.nick), check ? Check2 : "", /* @__PURE__ */ jsx("div", { class: "kick", "hx-post": "/kick?id=" + user.id }, "Kick"), /* @__PURE__ */ jsx("span", { class: "guesser-label" }, "Guesser"))
  );
}

// src/html/pages/room/guesser/ArticlesCounter.tsx
import { capitalCase as capitalCase2 } from "change-case";
var id2 = "items-counter";
function ArticlesCounter(props) {
  if (props.swappingExistent == void 0)
    props.swappingExistent = true;
  const count = props.room.articles.length;
  const domain = ArticlesHelper.getDomain(props.room.domainName);
  const element = /* @__PURE__ */ jsx("span", { id: id2, style: "font-size: 1.2rem;" }, count, " ", capitalCase2(domain.itemName + (count === 1 ? "" : "s")), " submitted");
  if (props.swappingExistent)
    element.attributes["hx-swap-oob"] = "outerHTML:#" + id2;
  return element;
}

// src/html/ArticleTitle.tsx
function ArticleTitle(props) {
  if (!props.preserveStyle || !props.article.italic)
    return /* @__PURE__ */ jsx(Fragment, null, props.article.title);
  return /* @__PURE__ */ jsx("i", null, props.article.title);
}

// src/html/pages/room/started/StartedView.tsx
function RoomStarted(props) {
  const style = (
    /*style*/
    `
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding: 1rem;
		text-align: center;
		color: var(--color-accent);
		flex: 1;
	`
  );
  return /* @__PURE__ */ jsx(Fragment, null, /* @__PURE__ */ jsx("section", { style: "flex: 1; display: flex; flex-direction: column;" }, /* @__PURE__ */ jsx("h2", { style }, /* @__PURE__ */ jsx(
    ArticleTitle,
    {
      article: props.article,
      preserveStyle: props.room.rules.preserveTitleStyle
    }
  ))), /* @__PURE__ */ jsx("div", { class: "g-box" }, /* @__PURE__ */ jsx(
    "button",
    {
      class: "g-big create",
      "hx-get": "/make",
      "hx-target": "#root",
      "hx-swap": "outerHTML",
      "hx-push-url": "true",
      style: "width: 100%;"
    },
    "Make new room"
  )));
}

// src/html/pages/room/guesser/StartButton.tsx
var id3 = "start-button";
function StartButton(props) {
  if (props.swappingExistent === void 0)
    props.swappingExistent = true;
  const attributes = {
    id: id3,
    class: "start g-big",
    "hx-post": "/start",
    "hx-target": "#room-view"
  };
  if (props.swappingExistent)
    attributes["hx-swap-oob"] = "outerHTML:#" + id3;
  if (props.room.articles.length === 0)
    attributes["disabled"] = true;
  return /* @__PURE__ */ jsx("button", { ...attributes }, "Start");
}

// src/html/pages/room/started/invite.css
var invite_default = "@keyframes slideUp {\r\n	from {\r\n		transform: translateY(100%);\r\n		opacity: 0;\r\n	}\r\n	to {\r\n		transform: translateY(0);\r\n		opacity: 1;\r\n	}\r\n}\r\n\r\n@keyframes slideDown {\r\n	from {\r\n		transform: translateY(0);\r\n		opacity: 1;\r\n	}\r\n	to {\r\n		transform: translateY(100%);\r\n		opacity: 0;\r\n	}\r\n}\r\n\r\n#invitePopup {\r\n	position: absolute;\r\n	text-align: center;\r\n	animation: slideUp 200ms ease-out;\r\n	opacity: 1;\r\n	margin-bottom: 0;\r\n	bottom: 5.25rem;\r\n}\r\n\r\n#invitePopup.hide {\r\n	animation: slideDown 200ms ease-out;\r\n	opacity: 0;\r\n}";

// src/html/pages/room/started/InvitePopup.tsx
function InvitePopup(props) {
  return /* @__PURE__ */ jsx("div", { id: "invitePopup", class: "g-box-pop g-foreground" }, /* @__PURE__ */ jsx("span", { style: "color: var(--color-accent)" }, props.user.nick + " "), /* @__PURE__ */ jsx("span", null, "invited you to room"), /* @__PURE__ */ jsx("span", { style: "color: var(--color-accent)" }, " " + props.room.id), /* @__PURE__ */ jsx("div", null, "Domain:", /* @__PURE__ */ jsx("span", { style: "color: var(--color-accent)" }, " " + props.room.domainName)), /* @__PURE__ */ jsx("div", { style: "display: flex; margin-top: 0.5rem" }, /* @__PURE__ */ jsx(
    "button",
    {
      class: "g-big",
      style: "width: 40%",
      onclick: '\r\n						invitePopup.classList.add("hide");\r\n						setTimeout(() => invitePopup.remove(), 200);\r\n					'
    },
    "Reject"
  ), /* @__PURE__ */ jsx("div", { style: "flex: 1;" }), /* @__PURE__ */ jsx(
    "button",
    {
      class: "g-big",
      style: "width: 40%",
      "hx-get": "/join/" + props.room.id,
      "hx-target": "#root",
      "hx-swap": "outerHTML",
      "hx-replace-url": "true"
    },
    "Join"
  )), /* @__PURE__ */ jsx(Style, { css: invite_default }));
}

// src/managers/rooms-manager.tsx
var logger2 = new Logger("RoomsManager");
var rooms = /* @__PURE__ */ new Map();
function notifyUserConnected(user) {
  const room = getUserRoom(user.id);
  if (room == null)
    return;
  const swapString = getSwapString(user.id);
  const html = render(
    /* @__PURE__ */ jsx(UsersListItem, { user, room })
  );
  EventSender.send(room.guesserId, swapString, html);
}
function notifyUserDisconnected(user) {
  const room = getUserRoom(user.id);
  if (room == null)
    return;
  if (room.currentArticle != -1)
    return;
  const swapString = getSwapString(user.id);
  const html = render(
    /* @__PURE__ */ jsx(UsersListItem, { user, room })
  );
  EventSender.send(room.guesserId, swapString, html);
}
function createRoom(guesser, domainName, rules, usersLimit) {
  const room = {
    id: findAvailableRoomId(),
    guesserId: guesser.id,
    domainName,
    rules,
    usersLimit,
    articles: [],
    creationTime: Date.now(),
    currentArticle: -1,
    users: { [guesser.id]: guesser },
    kicked: []
  };
  rooms.set(room.id, room);
  logger2.log(`Room created (${room.id})`);
  return room;
}
function getRoom(roomId) {
  return rooms.get(roomId) || null;
}
function getUserRoom(userId) {
  for (const room of rooms.values()) {
    if (userId in room.users)
      return room;
  }
  return null;
}
function addUserToRoom(room, user) {
  logger2.log(`Adding user '${user.nick}' to room '${room.id}'`);
  room.users[user.id] = user;
  const html = render(
    /* @__PURE__ */ jsx(Fragment, null, /* @__PURE__ */ jsx(UsersCount, { room }), /* @__PURE__ */ jsx(UsersListItem, { user, room }))
  );
  EventSender.send(room.guesserId, "AddUsersListItem", html);
}
function removeUserFromRoom(room, userId) {
  const user = room.users[userId];
  if (!user)
    throw new Error(`No user with id '${userId}' in room '${room.id}'`);
  logger2.log(`Removing user (${user.id}) from room (${room.id})`);
  const shouldNotifyOthers = room.currentArticle === -1;
  delete room.users[user.id];
  if (objectLength(room.users) === 0 || user.id === room.guesserId) {
    if (shouldNotifyOthers && user.id === room.guesserId) {
      const html = render(/* @__PURE__ */ jsx(Home, { user }));
      emitToRoom(room, "Kicked", html);
    }
    deleteRoom(room.id);
    return;
  }
  room.articles = room.articles.filter((article) => article.userId != user.id);
  if (shouldNotifyOthers) {
    const html = render(
      /* @__PURE__ */ jsx(Fragment, null, /* @__PURE__ */ jsx(StartButton, { room }), /* @__PURE__ */ jsx(ArticlesCounter, { room }), /* @__PURE__ */ jsx(UsersCount, { room }))
    );
    EventSender.send(room.guesserId, getSwapString(user.id), html);
  }
}
function isUserInRoom(room, userId) {
  return userId in room.users;
}
function kickUserFromRoom(room, userId) {
  if (room.kicked.includes(userId))
    return;
  const user = room.users[userId];
  if (!user)
    return;
  removeUserFromRoom(room, user.id);
  room.kicked.push(user.id);
  const html = render(/* @__PURE__ */ jsx(Home, { user }));
  EventSender.send(user.id, "Kicked", html);
}
function addArticleToUserInRoom(room, userId, article) {
  const user = findUserInRoom(room, userId);
  if (!user)
    throw new Error("User not in room");
  article.userId = userId;
  room.articles.push(article);
  const swapString = getSwapString(user.id);
  const html = render(
    /* @__PURE__ */ jsx(Fragment, null, /* @__PURE__ */ jsx(StartButton, { room }), /* @__PURE__ */ jsx(ArticlesCounter, { room }), /* @__PURE__ */ jsx(UsersListItem, { user, room }))
  );
  EventSender.send(room.guesserId, swapString, html);
}
function startRoom(requestedByUserId, room) {
  if (requestedByUserId != room.guesserId)
    throw new Error("Only the guesser can start");
  if (room.articles.length == 0)
    throw new Error("No articles submitted");
  if (room.currentArticle != -1)
    throw new Error("Already started");
  logger2.log("Starting room", room.id);
  room.currentArticle = Math.floor(Math.random() * room.articles.length);
  const article = room.articles[room.currentArticle];
  const html = render(/* @__PURE__ */ jsx(RoomStarted, { article, room }));
  emitToRoomExcept(room, "Started", html, [room.guesserId]);
}
function indexRooms() {
  return rooms;
}
function inviteToNewRoom(fromRoom, fromUser, toRoom) {
  const html = render(/* @__PURE__ */ jsx(InvitePopup, { user: fromUser, room: toRoom }));
  emitToRoom(fromRoom, "Invited", html);
}
function deleteRoom(roomId) {
  logger2.log(`Deleting room (${roomId})`);
  rooms.delete(roomId);
}
function emitToRoom(room, eventName, html) {
  for (const userId in room.users)
    EventSender.send(userId, eventName, html);
}
function emitToRoomExcept(room, eventName, html, exceptionIds) {
  for (const userId in room.users) {
    if (exceptionIds.includes(userId))
      continue;
    EventSender.send(userId, eventName, html);
  }
}
function findAvailableRoomId() {
  const charset = "0123456789";
  let length = 2;
  let id4 = randomString(length, charset);
  while (id4 in rooms) {
    length++;
    id4 = randomString(length, charset);
  }
  return id4;
}
function findUserInRoom(room, userId) {
  return room.users[userId];
}
var RoomsManager = {
  notifyUserConnected,
  notifyUserDisconnected,
  createRoom,
  getRoom,
  getUserRoom,
  addUserToRoom,
  removeUserFromRoom,
  isUserInRoom,
  kickUserFromRoom,
  addArticleToUserInRoom,
  startRoom,
  indexRooms,
  inviteToNewRoom
};

// src/html/pages/room/liar/SuggestionsListItem.tsx
function SuggestionsListItem(props) {
  return /* @__PURE__ */ jsx("li", { onclick: `suggestionLink.value = '${props.id}'` }, /* @__PURE__ */ jsx("span", { style: "flex: 1;" }, props.title), /* @__PURE__ */ jsx("a", { href: props.search, target: "_blank", style: "color: inherit; align-self: flex-start;" }, /* @__PURE__ */ jsx("button", { style: "width: 2em; height: 2em; padding: 0.1em;" }, /* @__PURE__ */ jsx(OpenExternal, null))));
}

// src/html/pages/room/liar/ArticleSubmitted.tsx
function ArticleSubmitted(props) {
  const style = (
    /*style*/
    `
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		text-align: center;
	`
  );
  return /* @__PURE__ */ jsx("div", { style }, /* @__PURE__ */ jsx("div", { class: "g-box" }, /* @__PURE__ */ jsx("div", null, "You submitted"), /* @__PURE__ */ jsx("span", null, /* @__PURE__ */ jsx("a", { href: props.article.link, target: "_blank", style: "color: inherit" }, /* @__PURE__ */ jsx("button", { style: "display: flex; margin: auto; align-items: center; padding: 0.5rem" }, /* @__PURE__ */ jsx(
    ArticleTitle,
    {
      article: props.article,
      preserveStyle: props.room.rules.preserveTitleStyle
    }
  ), /* @__PURE__ */ jsx(OpenExternal, { style: "width: 1.5rem; height: 1.5rem; margin-left: 0.25rem;" }))))), /* @__PURE__ */ jsx("br", null), /* @__PURE__ */ jsx("div", null, "Waiting room start..."));
}

// src/html/pages/room/RoomHeader.tsx
function RoomHeader(props) {
  return /* @__PURE__ */ jsx("header", { class: "g-box g-foreground g-round-header-corners", style: "display: flex;" }, /* @__PURE__ */ jsx("div", { style: "flex: 1;" }, /* @__PURE__ */ jsx("div", { style: "font-weight: 700;" }, "Room", /* @__PURE__ */ jsx("span", { style: "color: var(--color-accent); opacity: 0.8;" }, " " + props.room.id, " (", props.room.domainName, ")")), /* @__PURE__ */ jsx("div", { style: "font-size: 85%;" }, "Created ", /* @__PURE__ */ jsx("span", { id: "time" }, "X seconds ago"))), /* @__PURE__ */ jsx(
    "button",
    {
      style: "width: 2.5em;",
      "hx-post": "/leave",
      "hx-target": "#root",
      "hx-swap": "outerHTML",
      "hx-replace-url": "true"
    },
    /* @__PURE__ */ jsx(Exit, { style: "width: 1.25rem; height: 1.25rem;" })
  ));
}

// src/html/pages/room/liar/liar.css
var liar_default = "#suggestionLink {\r\n	font-size: 90%;\r\n}\r\n\r\n\r\nsection.submit {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 0.5rem;\r\n    text-align: center;\r\n	flex: 1;\r\n    justify-content: center;\r\n}\r\n\r\nsection.submit form {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 0.5rem;\r\n}\r\n\r\n\r\nsection.suggestions {\r\n	overflow: hidden;\r\n}\r\n\r\n#suggestions {\r\n    list-style: none;\r\n    padding: 0;\r\n    margin: 0;\r\n    margin-top: 0.5em;\r\n    width: 100%;\r\n    height: 42vh;\r\n    overflow-y: auto;\r\n}\r\n\r\n#suggestions > li {\r\n    display: flex;\r\n    align-items: center;\r\n    background-color: #00000010;\r\n    margin-top: 0.2em;\r\n    border-radius: 0.3em;\r\n    padding: 0.3em;\r\n}";

// src/html/pages/room/liar/LiarView.tsx
function LiarView(props) {
  const article = props.room.articles.find((article2) => article2.userId == props.user.id);
  const domain = ArticlesHelper.getDomain(props.room.domainName);
  if (article)
    return /* @__PURE__ */ jsx(ArticleSubmitted, { room: props.room, article });
  return /* @__PURE__ */ jsx(Fragment, null, /* @__PURE__ */ jsx("section", { class: "submit g-box" }, /* @__PURE__ */ jsx("div", null, "Submit ", domain.itemName), /* @__PURE__ */ jsx(
    "form",
    {
      "hx-post": "/submit",
      "hx-target": "#room-view",
      "hx-swap": "innerHTML",
      "hx-trigger": "submit",
      "hx-indicator": "#submit-indicator"
    },
    /* @__PURE__ */ jsx(
      "input",
      {
        class: "g-big",
        type: "text",
        id: "suggestionLink",
        name: "link",
        placeholder: domain.submitInputPlaceholder,
        required: true
      }
    ),
    /* @__PURE__ */ jsx("button", { class: "g-big" }, "Submit")
  )), /* @__PURE__ */ jsx("section", { class: "suggestions g-box g-foreground" }, /* @__PURE__ */ jsx("div", { style: "display: flex" }, /* @__PURE__ */ jsx("span", { style: "flex: 1" }, "Suggestions"), /* @__PURE__ */ jsx(
    "button",
    {
      "hx-get": "/suggestions",
      "hx-target": "#suggestions",
      "hx-swap": "innerHTML",
      "hx-trigger": "mousedown, load",
      "hx-indicator": "#suggestions-indicator"
    },
    "Reroll"
  )), /* @__PURE__ */ jsx("div", { style: "position: relative" }, /* @__PURE__ */ jsx("ul", { id: "suggestions" }), /* @__PURE__ */ jsx(LoadingSpinner, { id: "suggestions-indicator" }))), /* @__PURE__ */ jsx(LoadingSpinner, { id: "submit-indicator" }), /* @__PURE__ */ jsx(Style, { css: liar_default }));
}

// src/html/pages/room/guesser/UsersList.tsx
function UsersList(props) {
  const { room } = props;
  const users = Object.values(room.users);
  return /* @__PURE__ */ jsx(Fragment, null, /* @__PURE__ */ jsx(UsersCount, { room, swappingExistent: false }), /* @__PURE__ */ jsx("ul", null, users.map(
    (user) => /* @__PURE__ */ jsx(UsersListItem, { user, room })
  ), /* @__PURE__ */ jsx("div", { hidden: true, "sse-swap": "AddUsersListItem", "hx-swap": "beforebegin" })));
}

// src/html/pages/room/guesser/guesser.css
var guesser_default = "section.center {\r\n	position: relative;\r\n	flex: 1;\r\n	width: 100%;\r\n	display: flex;\r\n	flex-direction: column;\r\n	gap: 1em;\r\n	justify-content: center;\r\n	align-items: center;\r\n}\r\n\r\nsection.center > button.start {\r\n	width: 10rem;\r\n}\r\n\r\n\r\n#articles-counter {\r\n	font-weight: 700;\r\n	color: var(--color-accent);\r\n}\r\n\r\n\r\nsection > span {\r\n	display: block;\r\n	text-align: center;\r\n	width: 100%;\r\n	font-weight: 700;\r\n}\r\n\r\n\r\nsection.users > ul {\r\n	height: 12em;\r\n	overflow-y: auto;\r\n	margin-top: 0.5em;\r\n	padding: 0;\r\n	margin: 0;\r\n}\r\n\r\nsection.users > ul > li {\r\n	margin-top: 0.5rem;\r\n}\r\n\r\nsection.users > ul > li > div {\r\n	display: flex;\r\n    align-items: center;\r\n	background: var(--color-background);\r\n    border-radius: var(--radius-common);\r\n    padding: 0.25rem 0.5rem;\r\n}\r\n\r\n\r\nsection.users > ul > li .kick {\r\n	flex: 1;\r\n	color: var(--color-bad);\r\n	text-align: end;\r\n}\r\n\r\nsection.users > ul > li.guesser .kick {\r\n	display: none;\r\n}\r\n\r\nsection.users > ul > li .guesser-label {\r\n	flex: 1;\r\n	display: none;\r\n	font-size: 80%;\r\n	color: var(--color-accent);\r\n	text-align: end;\r\n}\r\n\r\nsection.users > ul > li.guesser .guesser-label {\r\n	display: initial;\r\n}\r\n\r\nsection.users > ul > li.guesser {\r\n	order: -1;\r\n}\r\n\r\nsection.users > ul > li.disconnected {\r\n	text-decoration: line-through;\r\n}\r\n\r\n\r\nsection.invite > div {\r\n	display: flex;\r\n	width: 100%;\r\n	margin-top: 0.5em;\r\n	gap: 0.5rem;\r\n}\r\n\r\nsection.invite > div > input {\r\n	flex: 1;\r\n}\r\n\r\n\r\n#invite-link {\r\n	font-size: 90%;\r\n}\r\n\r\n#copy-invite-button {\r\n	padding: 0.5rem;\r\n}";

// src/html/pages/room/guesser/GuesserView.tsx
function GuesserView(props) {
  return /* @__PURE__ */ jsx(Fragment, null, /* @__PURE__ */ jsx("section", { class: "center" }, /* @__PURE__ */ jsx(
    ArticlesCounter,
    {
      room: props.room,
      swappingExistent: false
    }
  ), /* @__PURE__ */ jsx(StartButton, { room: props.room, swappingExistent: false })), /* @__PURE__ */ jsx("section", { class: "users g-box-pop g-foreground" }, /* @__PURE__ */ jsx(UsersList, { room: props.room })), /* @__PURE__ */ jsx("section", { class: "invite g-box g-foreground g-round-footer-corners" }, /* @__PURE__ */ jsx("span", null, "Invite"), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("input", { type: "text", id: "invite-link" }), /* @__PURE__ */ jsx("button", { id: "copy-invite-button" }, "Copy"))), /* @__PURE__ */ jsx(Style, { css: guesser_default }));
}

// src/html/components/Script.tsx
function Script(props) {
  return /* @__PURE__ */ jsx("script", { DANGEROUSLY_SET_INNER_HTML: importText(props.src) });
}

// src/html/components/Json.tsx
var indent = false;
function Json(props) {
  const json = indent ? JSON.stringify(props.data, null, "	") : JSON.stringify(props.data);
  return /* @__PURE__ */ jsx(
    "script",
    {
      id: props.id,
      type: "application/json",
      DANGEROUSLY_SET_INNER_HTML: json
    }
  );
}

// src/html/pages/room/RulesPopup.tsx
function RulesPopup(props) {
  const rules = Object.entries(props.room.rules);
  return /* @__PURE__ */ jsx("div", { id: "rulesPopup", "hx-on:click": "this.hidden = true", hidden: true }, /* @__PURE__ */ jsx("div", { class: "g-box-pop g-foreground" }, /* @__PURE__ */ jsx("span", null, "Rules"), rules.map(
    ([id4, value]) => /* @__PURE__ */ jsx(InputForRule, { domainName: props.room.domainName, id: id4, value })
  )));
}
function InputForRule(props) {
  const rule = ArticlesHelper.getRule(props.domainName, props.id);
  return /* @__PURE__ */ jsx("label", null, /* @__PURE__ */ jsx("input", { type: "checkbox", disabled: true, checked: props.value || void 0 }), " " + rule.name);
}

// src/html/pages/room/Page.tsx
import { join as join3 } from "path";

// src/html/pages/room/style.css
var style_default4 = "#room-view {\r\n    position: relative;\r\n    flex: 1;\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n\r\nbutton.rules {\r\n	margin: 0.5rem;\r\n	border-radius: 0;\r\n	border-bottom-right-radius: var(--radius-common);\r\n	width: 4rem;\r\n}\r\n\r\n\r\n#rulesPopup {\r\n	position: fixed;\r\n	left: 0;\r\n	top: 0;\r\n	width: 100%;\r\n	height: 100%;\r\n	background-color: #00000020;\r\n}\r\n\r\n#rulesPopup > div {\r\n	display: flex;\r\n	flex-direction: column;\r\n	gap: 0.5rem;\r\n}\r\n\r\n#rulesPopup > div > div {\r\n	text-align: center;\r\n}";

// src/html/pages/room/Page.tsx
function Room(props) {
  const { room, user } = props;
  const dataForClient = {
    roomId: room.id,
    roomCreationTime: room.creationTime,
    isGuesser: user.id === room.guesserId
  };
  let View;
  if (room.currentArticle != -1)
    View = /* @__PURE__ */ jsx(RoomStarted, { room, article: room.articles[room.currentArticle] });
  else if (props.user.id == room.guesserId)
    View = /* @__PURE__ */ jsx(GuesserView, { ...props });
  else
    View = /* @__PURE__ */ jsx(LiarView, { ...props });
  return /* @__PURE__ */ jsx(Root, { title: "Mo\xFEFAL - Room", user }, /* @__PURE__ */ jsx(Json, { id: "data", data: dataForClient }), /* @__PURE__ */ jsx(RoomHeader, { ...props }), /* @__PURE__ */ jsx("main", null, /* @__PURE__ */ jsx("button", { class: "rules", "hx-on:click": "rulesPopup.hidden = false" }, "Rules"), /* @__PURE__ */ jsx("div", { id: "room-view" }, View)), /* @__PURE__ */ jsx(RulesPopup, { ...props }), /* @__PURE__ */ jsx(Script, { src: join3(process.cwd(), "static/scripts/room/script.js") }), /* @__PURE__ */ jsx(Style, { css: style_default4 }), /* @__PURE__ */ jsx("div", { hidden: true, "sse-swap": "Kicked", "hx-target": "#root", "hx-swap": "outerHTML" }), /* @__PURE__ */ jsx("div", { hidden: true, "sse-swap": "Started", "hx-target": "#room-view" }), /* @__PURE__ */ jsx("div", { hidden: true, "sse-swap": "Invited", "hx-target": "main", "hx-swap": "beforeend" }));
}

// src/routers/game-router.tsx
var NickLengthMax = 32;
var ArticlesPerRequest = 16;
var router2 = Router2();
router2.use(urlencoded({ extended: true }));
router2.use(SessionParser.middleware);
router2.get("/", (req, res) => {
  const { user } = req.session;
  const room = RoomsManager.getUserRoom(user.id);
  if (room) {
    res.redirect("/room");
    return;
  }
  res.type("text/html");
  res.send(render(
    /* @__PURE__ */ jsx(Home, { user })
  ));
});
router2.post("/cookies/accept", (req, res) => {
  req.session.save(res, { acceptedCookies: true });
  res.type("text/html");
  res.send();
});
router2.post("/cookies/reject", (req, res) => {
  const { user } = req.session;
  const room = RoomsManager.getUserRoom(user.id);
  if (room)
    RoomsManager.removeUserFromRoom(room, user.id);
  res.clearCookie(SessionParser.cookieName);
  res.header("Hx-Redirect", "https://www.google.com/");
});
router2.get("/nick-change", (req, res) => {
  res.type("text/html");
  res.send(render(
    /* @__PURE__ */ jsx(
      "form",
      {
        id: "nick",
        "hx-post": "/nick-change",
        "hx-swap": "outerHTML",
        "hx-trigger": "submit"
      },
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          name: "nick",
          placeholder: "New nick",
          value: req.session.user.nick,
          max: NickLengthMax
        }
      ),
      /* @__PURE__ */ jsx("button", { class: "cancel", type: "submit" }, "Cancel"),
      /* @__PURE__ */ jsx("button", { class: "ok", type: "submit" }, "Ok")
    )
  ));
});
router2.post("/nick-change", async (req, res) => {
  const { user } = req.session;
  const nick = String(req.body["nick"] || "").slice(0, NickLengthMax);
  if (nick != "" && nick != user.nick)
    req.session.save(res, { nick });
  res.type("text/html");
  res.send(render(/* @__PURE__ */ jsx(NickSection, { nick: user.nick })));
});
router2.get("/rules", (req, res) => {
  res.type("text/html");
  res.send(render(/* @__PURE__ */ jsx(Rules, { user: req.session.user })));
});
router2.get("/make", (req, res) => {
  const { user } = req.session;
  const currentRoom = RoomsManager.getUserRoom(user.id);
  res.type("text/html");
  res.send(render(/* @__PURE__ */ jsx(MakeRoom, { currentRoom, user })));
});
router2.post("/make", async (req, res) => {
  const { user } = req.session;
  const domainName = req.body["domain"];
  const limitUsers2 = req.body["limit-users"] === "on";
  const usersLimit = parseInt(String(req.body["users-limit"])) || 0;
  const invite = req.body["invite"] === "on";
  if (!ArticlesHelper.isDomainRegistered(domainName)) {
    res.status(404);
    res.send("Invalid domain");
    return;
  }
  if (limitUsers2 && usersLimit < 3) {
    res.status(404);
    res.send("Invalid users limit");
    return;
  }
  const rules = ArticlesHelper.createRules(domainName, req.body);
  const oldRoom = RoomsManager.getUserRoom(user.id);
  const newRoom = RoomsManager.createRoom(user, domainName, rules, limitUsers2 ? usersLimit : 0);
  if (oldRoom) {
    RoomsManager.removeUserFromRoom(oldRoom, user.id);
    if (invite && oldRoom.currentArticle != -1)
      RoomsManager.inviteToNewRoom(oldRoom, user, newRoom);
  }
  res.redirect("/room");
});
router2.get("/room", (req, res) => {
  const { user } = req.session;
  const room = RoomsManager.getUserRoom(user.id);
  if (room == null) {
    console.log(`[${req.path}]`, user.nick, "-> Not in a room");
    res.redirect("/");
    return;
  }
  res.type("text/html");
  res.send(render(
    /* @__PURE__ */ jsx(Room, { room, user })
  ));
});
router2.post("/join", async (req, res) => {
  const code = req.body["code"];
  const id4 = String(code || "").split("/").pop();
  if (!id4) {
    console.log(`[${req.path}]`, req.session.user.nick, "-> Invalid code:", code);
    res.redirect("/");
    return;
  }
  res.redirect("/join/" + id4);
});
router2.get("/join/:id", (req, res) => {
  const { user } = req.session;
  const currentRoom = RoomsManager.getUserRoom(user.id);
  const roomId = req.params.id;
  if (currentRoom) {
    if (currentRoom.id == roomId) {
      res.redirect("/room");
      return;
    }
    RoomsManager.removeUserFromRoom(currentRoom, user.id);
  }
  const room = RoomsManager.getRoom(roomId);
  if (!room) {
    console.log(`[${req.path}]`, user.nick, "-> No room with id:", roomId);
    res.redirect("/");
    return;
  }
  if (room.kicked.includes(user.id)) {
    res.redirect("/");
    return;
  }
  RoomsManager.addUserToRoom(room, user);
  res.redirect("/room");
});
router2.get("/suggestions", async (req, res) => {
  const { user } = req.session;
  const room = RoomsManager.getUserRoom(user.id);
  if (!room) {
    console.log(`[${req.path}]`, user.nick, "-> Not in a room");
    res.redirect("/");
    return;
  }
  const articleInfos = await ArticlesHelper.getRandomArticles(
    room.domainName,
    ArticlesPerRequest,
    room.rules
  );
  res.type("text/html");
  res.send(render(
    articleInfos.map(
      (info) => /* @__PURE__ */ jsx(SuggestionsListItem, { ...info })
    )
  ));
});
router2.post("/kick", (req, res) => {
  const { user } = req.session;
  const room = RoomsManager.getUserRoom(user.id);
  if (!room) {
    console.log(`[${req.path}]`, user.nick, "-> Not in a room");
    res.redirect("/");
    return;
  }
  if (user.id !== room.guesserId) {
    console.log(`[${req.path}]`, user.nick, "-> Only the guesser can kick");
    res.redirect("/");
    return;
  }
  const kickId = String(req.query["id"]) || "";
  if (!RoomsManager.isUserInRoom(room, kickId)) {
    console.log(`[${req.path}]`, user.nick, "-> User not found");
    res.redirect("/");
    return;
  }
  RoomsManager.kickUserFromRoom(room, kickId);
  res.status(200);
});
router2.post("/submit", async (req, res) => {
  const { user } = req.session;
  const room = RoomsManager.getUserRoom(user.id);
  if (!room) {
    console.log(`[${req.path}]`, user.nick, "-> Not in a room");
    res.redirect("/");
    return;
  }
  if (room.articles.find((article2) => article2.userId == user.id))
    throw new Error("Already submitted an article");
  const link = req.body["link"];
  if (!link)
    throw new Error("Link can't be empty");
  const article = await ArticlesHelper.getArticle(room.domainName, link);
  RoomsManager.addArticleToUserInRoom(room, user.id, article);
  res.type("text/html");
  res.send(render(
    /* @__PURE__ */ jsx(ArticleSubmitted, { room, article })
  ));
});
router2.post("/leave", (req, res) => {
  const { user } = req.session;
  const room = RoomsManager.getUserRoom(user.id);
  if (!room) {
    console.log(`[${req.path}]`, user.nick, "-> Not in a room");
    res.redirect("/");
    return;
  }
  RoomsManager.removeUserFromRoom(room, user.id);
  res.redirect("/");
});
router2.post("/start", (req, res) => {
  const { user } = req.session;
  const room = RoomsManager.getUserRoom(user.id);
  if (!room) {
    console.log(`[${req.path}]`, user.nick, "-> Not in a room");
    res.redirect("/");
    return;
  }
  RoomsManager.startRoom(user.id, room);
  const article = room.articles[room.currentArticle];
  res.type("text/html");
  res.send(render(
    /* @__PURE__ */ jsx(RoomStarted, { article, room })
  ));
});

// src/main.ts
import express from "express";
import cookieParser from "cookie-parser";
import "express-async-errors";
var port = parseInt(env("PORT", "3001"));
var app = express();
app.use((error, req, res, next) => {
  console.error(`[${req.path}] Error:`, error);
  res.status(500);
  res.send("Something went wrong!");
  next();
});
app.use(cookieParser());
app.use(router2);
app.use(EventSender.router);
app.use(express.static("static"));
app.listen(port, () => console.log("Listening on port", port));
//# sourceMappingURL=main.js.map
