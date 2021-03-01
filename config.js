import localConfig from './localConfig.js'
const config = {
  DEBUG: localConfig.DEBUG,
  developmentENV: localConfig.developmentENV || 'stg',
  showTahuTextInput: localConfig.showTahu || false,
  codePushDev: localConfig.codePushDev || false,
  codePushProd: localConfig.codePushProd || false,
  smartlookEnableRecord: localConfig.smartlookEnableRecord || true,
  // codepushKey: localConfig.codepushKey || {},
  companyCode: localConfig.companyCode || 'ODI',
  defaultMailto: 'help@ruparupa.com',
  defaultPhone: '021-2967 0706',
  momentLocale: 'id',
  environment: 'mobile',
  targetVisitor: 'human',
  enablePopup: false,
  enableGosend: true,
  enableSocialLogin: false,
  enablePointRedeem: false,
  enableWishList: true,
  desktopBrandSplitted: 20,
  mobileBrandSplitted: 8,
  paymentURL: 'https://payment.ruparupa.com/checkout',
  baseURL: 'https://www.ruparupa.com/',
  baseURLmobile: localConfig.baseUrl || 'https://m.ruparupa.com/',
  apiURL: 'https://wapi.ruparupa.com/',
  tahuURL: 'https://gideon.ruparupa.com/wapi',
  geoURL: 'https://get.geojs.io',
  reviewRatingURL: 'https://wapi.ruparupa.com/wapi-review',
  returnRefundUrl: 'https://wapi.ruparupa.com/wapi-backend',

  // STAGING CONFIG
  stgPaymentURL: localConfig.paymentMultistaging || 'https://payment.stg.ruparupa.io/checkout',
  stgApiURL: localConfig.multistaging || 'https://automate.wapi.ruparupastg.my.id/',
  // stgApiURL: 'https://wapi.stg.ruparupa.io/new-retail/',
  stgTahuURL: 'https://gideon.ruparupa.com/wapi',
  stgReviewRatingURL: 'https://aceapps.oms.ruparupastg.my.id/wapi-review',
  stgProject: localConfig.projectName || '',
  stgReturnRefundUrl: localConfig.returnRefundUrl || 'https://return.wapi.ruparupastg.my.id/wapi-backend', // yang lama -> 'https://wapi.stg.ruparupa.io/wapi-backend',

  // DEV CONFIG
  // Edit your self if you want to use dev 2 or dev 1
  devPaymentURL: 'https://payment.dev.ruparupa.io/checkout',
  devApiURL: 'https://wapi.dev.ruparupa.io/',
  devReturnRefundURL: 'https://www.dev.ruparupa.io/wapi-backend/oms/',
  // devApiURL: 'http://www.dev.ruparupa.io/wapi-backend',
  // stgTahuURL: 'https://gideon.ruparupa.com/wapi',

  imageRR: 'https://res.cloudinary.com/ruparupa-com/image/upload/',
  imageURL: 'https://res.cloudinary.com/ruparupa-com/image/upload/',
  imageAceURL: 'https://res.cloudinary.com/acehardware/image/upload/',
  imageInformaURL: 'https://res.cloudinary.com/homecenterindonesia/image/upload/',
  freeShippingCategory: ``,
  assetsIconURL: 'https://res.cloudinary.com/ruparupa-com/image/upload/v1524213684/',
  redeemPointDouble: '2018-05-06 23:59:59',
  // mPulseScript: `var SOASTA={};!function(){if(!window.BOOMR||!window.BOOMR.version){var e,t,n,o=document.createElement("iframe"),a=window;a.addEventListener?a.addEventListener("load",i,!1):a.attachEvent&&a.attachEvent("onload",i),o.src="javascript:false",o.title="",o.role="presentation",(o.frameElement||o).style.cssText="width:0;height:0;border:0;display:none;",(n=document.getElementsByTagName("script")[0]).parentNode.insertBefore(o,n);try{t=o.contentWindow.document}catch(n){e=document.domain,o.src="javascript:var d=document.open();d.domain='"+e+"';void(0);",t=o.contentWindow.document}t.open()._l=function(){var t=this.createElement("script");e&&(this.domain=e),t.id="boomr-if-as",t.src="https://s.go-mpulse.net/boomerang/HTN99-DXGNW-Q549T-NZAUR-T8C93",BOOMR_lstart=(new Date).getTime(),this.body.appendChild(t)},t.write('<body onload="document._l();">'),t.close()}function i(e){a.BOOMR_onload=e&&e.timeStamp||(new Date).getTime()}}();`,
  expressDeliveryCookies: 'expressDelivery',
  freshChatAppId: '1b98ea63-11b4-475b-a253-24b0fad86297',
  freshChatAppKey: '08c8ff1d-fa5b-47f3-b2ec-ad357ec2fbf5',
  googleMapApiKey: 'AIzaSyDyL_wc9BmJLFEZcxDtPfOMZFRv0JY7UqE',
  googleMapsServerApiKey: 'AIzaSyBigeLAO-T9iWYt5k08-D9znSh4M7wtTkQ',
  returnURL: 'https://m.ruparupa.com/faq-pengembalian',

  // Package Names
  packageNameAndroid: 'com.mobileappruparupa',
  packageNameIos: 'com.ruparupa.ios',
  // Version Prod
  versionAndroid: '1.7.7',
  versionIos: '1.6.7',
  versionCodePushAndroid: 'v34',
  versionCodePushIos: 'v18',
  // Version Stg
  versionStgAndroid: '1.7.4t',
  versionStgIos: '1.7.4t',

  freshServerApiAndroid: 'AAAA6yhmM7w:APA91bHE37mdevkNsBjkDxxG8jhrKkl9DygAqxBhO9An1E6HHhDeXu2cMWNS3QL_aEPxA_K-jyI9uUM-cnuUKEHRFx4TtGDYVo9xRTkQvF2Puw8DqGW-kKLKzh1H3Yc6JrZwxahMUpPI',
  freshServerApiIos: '',
  otpKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMGM0MjFmOTYtZmVkYS00MGZhLTlmOTktNTRhOThiY2IxMTE2IiwiaWF0IjoxNTcxMzY1ODM0LCJpc3MiOiJ3YXBpLnJ1cGFydXBhIn0.jdPYQ4zSTzLdatp8D9mUN4fXM020fvw6cXNChUv0qhQ',
  deviceTokenURL: 'https://wapi.backend.ruparupa.io',
  urlTnc: 'https://m.ruparupa.com/terms-conditions',
  urlPrivacyPolicy: 'https://m.ruparupa.com/privacy-policy',
  newRetailDynamicLink: 'https://ruparupamobileapp.page.link/newretail?id=',
  cryptoSecretKey: 'kembangan328',
  apiKeyAlgolia: 'efe322021b2e5b82b3c47aa3d2b339cf',
  apiIndexAlgolia: 'C5NGUDQKQ0',
  apiKeyAlgoliaStg: '63993a232641bd89caef09501fb5ab32',
  apiIndexAlgoliaStg: 'testing7RY7475GY3',
  smartlookApiKey: '6807578e1ea89b896994ce3edc1965ad83d97ee0',

  // Feedback Info
  feedbackUrl: 'https://sentry.io/api/0/projects/ruparupa/ruparupa/user-feedback',
  feedbackBearer: '53984e0a1e334e979419140df5e8eedb3d9742413cf543968ba5f6b07d223c5d'
}

export default config
