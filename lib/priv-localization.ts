export type PrivLocale = "en" | "es" | "pt" | "hi" | "zh"
export type DisplayCurrency = "USD" | "BRL" | "CLP" | "EUR" | "GBP" | "INR" | "MXN" | "CNY"

export const currencyConfig: Record<DisplayCurrency, { locale: string; rate: number }> = {
  USD: { locale: "en-US", rate: 1 },
  BRL: { locale: "pt-BR", rate: 5.2 },
  CLP: { locale: "es-CL", rate: 950 },
  EUR: { locale: "de-DE", rate: 0.92 },
  GBP: { locale: "en-GB", rate: 0.79 },
  INR: { locale: "hi-IN", rate: 102.55 },
  MXN: { locale: "es-MX", rate: 20.7946 },
  CNY: { locale: "zh-CN", rate: 7.328 },
}

export function resolvePrivLocalization(country?: string, browserLanguage = "en") {
  const language = browserLanguage.toLowerCase()
  const languageRegion = browserLanguage.split("-")[1] || (language.startsWith("hi") ? "IN" : language.startsWith("zh") ? "CN" : "")
  const region = (country || languageRegion).trim().toUpperCase()

  const locale: PrivLocale = region === "IN"
    ? "hi"
    : region === "CN"
      ? "zh"
      : region === "MX"
        ? "es"
        : language.startsWith("pt")
          ? "pt"
          : language.startsWith("es")
            ? "es"
            : "en"

  const currency: DisplayCurrency = region === "BR"
    ? "BRL"
    : region === "CL"
      ? "CLP"
      : ["PT", "ES", "FR", "DE"].includes(region)
        ? "EUR"
        : region === "GB"
          ? "GBP"
          : region === "IN"
            ? "INR"
            : region === "MX"
              ? "MXN"
              : region === "CN"
                ? "CNY"
                : "USD"

  return { locale, currency }
}

export const hindiTranslation = {
  vip: "🎁 💎 पूरा VIP एल्बम ⭐ सबसे ज़्यादा पसंद किया गया ⭐",
  vipDescription: "सभी एल्बम शामिल 🔥",
  basic: "📸 बेसिक पैकेज 🌸",
  basicDescription: "चुनी हुई कुछ तस्वीरें",
  exclusive: "🎬 एक्सक्लूसिव एल्बम 💎",
  exclusiveDescription: "आपके लिए चुनी गई सामग्री",
  flash: "⚡ रात 11 बजे तक विशेष ऑफ़र 🔥 ⏰ ⌛ — पहले 100 लोगों के लिए सीमित 💎",
  vipOffer: "60% छूट वाला VIP पैकेज 💎 🎁 + बोनस",
  firstAlbum: "पहले एल्बम पर विशेष ऑफ़र! 📸",
  daily: "हर दिन नई सामग्री",
  photos: "हर दिन तस्वीरें",
  gift: "एक छोटा-सा उपहार भेजें",
  closeDetails: "पैकेज की जानकारी बंद करें",
  want: "मुझे यह पैकेज चाहिए",
  privateContent: "निजी सामग्री",
  labels: {
    subscribeTo: "पाएँ एक्सेस",
    emailLabel: "ईमेल",
    emailPlaceholder: "you@example.com",
    emailHelp: "आपकी एक्सेस जानकारी इस ईमेल पर भेजी जाएगी।",
    enterEmail: "कृपया मान्य ईमेल दर्ज करें।",
    continue: "भुगतान जारी रखें",
    loading: "लोड हो रहा है…",
    processing: "प्रोसेस हो रहा है…",
    pay: "सुरक्षित भुगतान करें",
    securedBy: "Stripe द्वारा सुरक्षित",
    checkDetails: "भुगतान की जानकारी जाँचें।",
    paymentFailed: "भुगतान विफल हुआ। फिर से कोशिश करें।",
    networkError: "नेटवर्क त्रुटि। फिर से कोशिश करें।",
    somethingWrong: "कुछ गलत हुआ। फिर से कोशिश करें।",
    successTitle: "आपका एक्सेस तैयार है!",
    successBodyPre: "आपका एक्सेस तैयार है। जानकारी के लिए देखें: ",
    successBodyPost: ".",
    done: "हो गया",
    close: "बंद करें",
  },
} as const

export const chineseTranslation = {
  vip: "🎁 💎 VIP 全套相册 ⭐ 人气畅销 ⭐",
  vipDescription: "包含所有相册 🔥",
  basic: "📸 基础套餐 🌸",
  basicDescription: "精选照片",
  exclusive: "🎬 独家相册 💎",
  exclusiveDescription: "为你精选的内容",
  flash: "⚡ 限时优惠，晚上 11 点截止 🔥 ⏰ ⌛ — 前 100 名限量 💎",
  vipOffer: "VIP 套餐 6 折优惠 💎 🎁 + 赠礼",
  firstAlbum: "首个相册特别优惠！📸",
  daily: "每天都有新内容",
  photos: "每日更新照片",
  gift: "送一份小礼物",
  closeDetails: "关闭套餐详情",
  want: "我想要这个套餐",
  privateContent: "私密内容",
  labels: {
    subscribeTo: "获取访问权限：",
    emailLabel: "电子邮箱",
    emailPlaceholder: "you@example.com",
    emailHelp: "访问信息将发送到此邮箱。",
    enterEmail: "请输入有效的电子邮箱。",
    continue: "继续付款",
    loading: "正在加载…",
    processing: "正在处理…",
    pay: "安全付款",
    securedBy: "由 Stripe 提供安全保护",
    checkDetails: "请检查付款信息。",
    paymentFailed: "付款失败，请重试。",
    networkError: "网络错误，请重试。",
    somethingWrong: "出现问题，请重试。",
    successTitle: "已成功开通！",
    successBodyPre: "访问权限已准备好。详情请查看：",
    successBodyPost: "。",
    done: "完成",
    close: "关闭",
  },
} as const

export const localizedUi: Record<PrivLocale, {
  offerFrom: string
  specialOffer: string
  downsellClose: string
  videoAlt: string
  vipAlt: string
  discountLabel: string
  upgradeLabel: string
  exitLabel: string
  basicTitle: string
  exclusiveTitle: string
  exitTitle: string
  vipTitle: string
  basicBody: string
  exclusiveBody: string
  generalBody: string
  regularPrice: string
  todayOnly: string
  save: string
  off: string
  acceptBasic: string
  acceptExclusive: string
  acceptVip: string
}> = {
  en: {
    offerFrom: "From",
    specialOffer: "for a special offer",
    downsellClose: "Close special offer",
    videoAlt: "Exclusive video preview",
    vipAlt: "VIP private offer preview",
    discountLabel: "Your exclusive discount",
    upgradeLabel: "VIP album upgrade",
    exitLabel: "Wait — special exit offer",
    basicTitle: "You unlocked 10 extra videos",
    exclusiveTitle: "Get the VIP album for less",
    exitTitle: "Unlock the VIP album for only",
    vipTitle: "Your VIP discount is ready",
    basicBody: "Enjoy 10 unique bonus videos with your package.",
    exclusiveBody: "You can upgrade to the complete VIP album at a special price.",
    generalBody: "This special price is only available right now.",
    regularPrice: "Regular price",
    todayOnly: "Today only",
    save: "You save",
    off: "OFF",
    acceptBasic: "Yes, unlock 10 bonus videos for",
    acceptExclusive: "Yes, get the VIP album for",
    acceptVip: "Yes, unlock VIP for",
  },
  es: {
    offerFrom: "De",
    specialOffer: "con una oferta especial",
    downsellClose: "Cerrar oferta especial",
    videoAlt: "Vista previa del video exclusivo",
    vipAlt: "Vista previa de la oferta VIP privada",
    discountLabel: "Tu descuento exclusivo",
    upgradeLabel: "Mejora al álbum VIP",
    exitLabel: "Espera: oferta especial de salida",
    basicTitle: "Desbloqueaste 10 videos adicionales",
    exclusiveTitle: "Obtén el álbum VIP por menos",
    exitTitle: "Desbloquea el álbum VIP por solo",
    vipTitle: "Tu descuento VIP está listo",
    basicBody: "Disfruta 10 videos extra únicos con tu paquete.",
    exclusiveBody: "Puedes cambiar al álbum VIP completo por un precio especial.",
    generalBody: "Este precio especial solo está disponible ahora.",
    regularPrice: "Precio regular",
    todayOnly: "Solo hoy",
    save: "Ahorras",
    off: "DE DESCUENTO",
    acceptBasic: "Sí, desbloquear 10 videos extra por",
    acceptExclusive: "Sí, obtener el álbum VIP por",
    acceptVip: "Sí, desbloquear VIP por",
  },
  pt: {
    offerFrom: "De",
    specialOffer: "por uma oferta especial",
    downsellClose: "Fechar oferta especial",
    videoAlt: "Prévia do vídeo exclusivo",
    vipAlt: "Prévia da oferta VIP privada",
    discountLabel: "Seu desconto exclusivo",
    upgradeLabel: "Upgrade do álbum VIP",
    exitLabel: "Espere — oferta especial de saída",
    basicTitle: "Você desbloqueou 10 vídeos extras",
    exclusiveTitle: "Tenha o álbum VIP por menos",
    exitTitle: "Desbloqueie o álbum VIP por apenas",
    vipTitle: "Seu desconto VIP está pronto",
    basicBody: "Aproveite 10 vídeos bônus exclusivos no seu pacote.",
    exclusiveBody: "Você pode fazer upgrade para o álbum VIP completo por um preço especial.",
    generalBody: "Este preço especial está disponível somente agora.",
    regularPrice: "Preço normal",
    todayOnly: "Somente hoje",
    save: "Você economiza",
    off: "DE DESCONTO",
    acceptBasic: "Sim, desbloquear 10 vídeos bônus por",
    acceptExclusive: "Sim, obter o álbum VIP por",
    acceptVip: "Sim, desbloquear VIP por",
  },
  hi: {
    offerFrom: "पहले",
    specialOffer: "खास ऑफ़र में",
    downsellClose: "विशेष ऑफ़र बंद करें",
    videoAlt: "एक्सक्लूसिव वीडियो की झलक",
    vipAlt: "VIP निजी ऑफ़र की झलक",
    discountLabel: "आपकी खास छूट",
    upgradeLabel: "VIP एल्बम में अपग्रेड करें",
    exitLabel: "रुकिए — जाने से पहले खास ऑफ़र",
    basicTitle: "आपने 10 अतिरिक्त वीडियो अनलॉक किए",
    exclusiveTitle: "कम कीमत में VIP एल्बम पाएँ",
    exitTitle: "VIP एल्बम अनलॉक करें, केवल",
    vipTitle: "आपकी VIP छूट तैयार है",
    basicBody: "अपने पैकेज के साथ 10 अनोखे बोनस वीडियो पाएँ।",
    exclusiveBody: "खास कीमत पर पूरे VIP एल्बम में अपग्रेड करें।",
    generalBody: "यह खास कीमत केवल अभी उपलब्ध है।",
    regularPrice: "नियमित कीमत",
    todayOnly: "केवल आज",
    save: "आपकी बचत",
    off: "छूट",
    acceptBasic: "हाँ, 10 बोनस वीडियो अनलॉक करें —",
    acceptExclusive: "हाँ, VIP एल्बम पाएँ —",
    acceptVip: "हाँ, VIP अनलॉक करें —",
  },
  zh: {
    offerFrom: "原价",
    specialOffer: "特别优惠价",
    downsellClose: "关闭特别优惠",
    videoAlt: "独家视频预览",
    vipAlt: "VIP 私享优惠预览",
    discountLabel: "专属折扣",
    upgradeLabel: "升级至 VIP 相册",
    exitLabel: "等等——离开前的特别优惠",
    basicTitle: "已解锁 10 个额外视频",
    exclusiveTitle: "以更优惠的价格获取 VIP 相册",
    exitTitle: "仅需此价格即可解锁 VIP 相册：",
    vipTitle: "你的 VIP 折扣已准备好",
    basicBody: "套餐包含 10 个独家赠送视频。",
    exclusiveBody: "现在可以用特别优惠价升级到完整 VIP 相册。",
    generalBody: "此特别价格仅限现在。",
    regularPrice: "原价",
    todayOnly: "今日特惠",
    save: "立省",
    off: "折",
    acceptBasic: "是，解锁 10 个赠送视频：",
    acceptExclusive: "是，获取 VIP 相册：",
    acceptVip: "是，解锁 VIP：",
  },
}
