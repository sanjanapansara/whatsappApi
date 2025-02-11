import i18next from "i18next";
import { initReactI18next } from "react-i18next";

//import eng from "./util/lang/en";
//import pt from "./util/lang/pt";

import langData from "./util/lang/langData.json";


// the translations
const resources = {
  // en: {
  //   translation: eng,
  // },
  // pt: {
  //   translation: pt,
  // },
};


langData.forEach((o) => {
  Object.keys(o).forEach((key) => {
    var langCode, langKey, langKeyVal;
    if (key !== "key") {
      langCode = key;
      langKey = o.key;
      langKeyVal = o[key];
      if (resources[langCode] === undefined) {
        resources[langCode] = {
          translation: {},
        };
      }
      resources[langCode].translation[langKey] = langKeyVal;
    }
  });
});

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    debug: false,
    lng: "en", // if you"re using a language detector, do not define the lng option
    fallbackLng: "en",
    //keySeparator: false,
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export default i18next;
