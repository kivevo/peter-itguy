/**
 * Comprehensive Kenya Administrative Boundaries Dataset
 * Covers all 47 Counties, their Constituencies (Sub-Counties), and Wards.
 * Senior-level structured dataset with search, SLA mapping & formatting helpers.
 */

export interface WardInfo {
  name: string;
  isTechHub?: boolean; // Major commercial/office district
}

export interface ConstituencyInfo {
  name: string;
  wards: string[];
}

export interface CountyInfo {
  code: string;
  name: string;
  capital: string;
  region: "Nairobi Metro" | "Central" | "Coast" | "Rift Valley" | "Western" | "Nyanza" | "Eastern" | "North Eastern";
  dispatchSla: "Immediate (<45 Mins)" | "Same-Day (<2 Hrs)" | "Next-Day / Scheduled" | "Remote Diagnostic / Scheduled";
  constituencies: ConstituencyInfo[];
}

export const KENYA_COUNTIES: CountyInfo[] = [
  // 047 - NAIROBI CITY
  {
    code: "047",
    name: "Nairobi City",
    capital: "Nairobi",
    region: "Nairobi Metro",
    dispatchSla: "Immediate (<45 Mins)",
    constituencies: [
      {
        name: "Westlands",
        wards: [
          "Parklands / Highridge",
          "Kitisuru",
          "Karura / Muthaiga",
          "Kangemi",
          "Mountain View",
          "Westlands Central / The Mirage",
        ],
      },
      {
        name: "Starehe",
        wards: [
          "Nairobi Central (CBD)",
          "Ngara",
          "Pangani",
          "Ziwani / Kariokor",
          "Landi Mawe",
          "Nairobi South / South B",
        ],
      },
      {
        name: "Dagoretti North",
        wards: [
          "Kilimani / Hurlingham",
          "Kileleshwa",
          "Kawangware",
          "Gatina",
          "Kabiro",
        ],
      },
      {
        name: "Dagoretti South",
        wards: [
          "Mutu-ini",
          "Ng'ando",
          "Riruta / Satellite",
          "Uthiru / Ruthimitu",
          "Waithaka",
        ],
      },
      {
        name: "Lang'ata",
        wards: [
          "Karen",
          "South C",
          "Nairobi West",
          "Nyayo Highrise",
          "Mugumo-ini",
        ],
      },
      {
        name: "Kibra",
        wards: [
          "Woodley / Kenyatta Golf Course",
          "Laini Saba",
          "Lindi",
          "Makina",
          "Sarang'ombe",
        ],
      },
      {
        name: "Roysambu",
        wards: [
          "Roysambu / TRM Mall",
          "Garden Estate",
          "Kahawa West",
          "Zimmerman",
          "Githurai 44",
          "Kahawa Sukari Boundary",
        ],
      },
      {
        name: "Kasarani",
        wards: [
          "Clay City",
          "Mwiki",
          "Kasarani",
          "Njiru",
          "Ruai / Kamulu",
        ],
      },
      {
        name: "Ruaraka",
        wards: [
          "Baba Dogo / Industrial Hub",
          "Utalii",
          "Mathare North",
          "Lucky Summer",
          "Korogocho",
        ],
      },
      {
        name: "Embakasi South",
        wards: [
          "Imara Daima",
          "Kwa Njenga",
          "Kwa Reuben",
          "Pipeline",
          "Kware",
        ],
      },
      {
        name: "Embakasi North",
        wards: [
          "Kariobangi North",
          "Dandora Area I",
          "Dandora Area II",
          "Dandora Area III",
          "Dandora Area IV",
        ],
      },
      {
        name: "Embakasi Central",
        wards: [
          "Kayole North",
          "Kayole Central",
          "Kayole South",
          "Komarock",
          "Matopeni / Spring Valley",
        ],
      },
      {
        name: "Embakasi East",
        wards: [
          "Upper Savanna",
          "Lower Savanna",
          "Embakasi / Airport Hub",
          "Utawala",
          "Mihango",
        ],
      },
      {
        name: "Embakasi West",
        wards: [
          "Umoja I",
          "Umoja II",
          "Mowlem",
          "Kariobangi South",
        ],
      },
      {
        name: "Makadara",
        wards: [
          "Viwandani (Industrial Area Enterprise Rd)",
          "Maringo / Hamza",
          "Harambee",
          "Makongeni",
        ],
      },
      {
        name: "Kamukunji",
        wards: [
          "Eastleigh North",
          "Eastleigh South",
          "Airbase",
          "California",
          "Pumwani",
        ],
      },
      {
        name: "Mathare",
        wards: [
          "Hospital",
          "Mabatini",
          "Huruma",
          "Ngei",
          "Mlango Kubwa",
          "Kiamaiko",
        ],
      },
    ],
  },

  // 022 - KIAMBU
  {
    code: "022",
    name: "Kiambu",
    capital: "Kiambu",
    region: "Nairobi Metro",
    dispatchSla: "Same-Day (<2 Hrs)",
    constituencies: [
      {
        name: "Ruiru",
        wards: [
          "Kahawa Sukari",
          "Kahawa Wendani",
          "Biashara (Ruiru Town)",
          "Gitothua",
          "Gatongora",
          "Kiuu",
          "Mwiki",
          "Mwihoko",
        ],
      },
      {
        name: "Thika Town",
        wards: [
          "Township (Thika CBD)",
          "Kamenu",
          "Hospital",
          "Gatuanyaga",
          "Ngoliba",
        ],
      },
      {
        name: "Kiambaa",
        wards: [
          "Karuri / Banana",
          "Ndenderu",
          "Cianda",
          "Muchatha",
          "Kihara",
        ],
      },
      {
        name: "Kikuyu",
        wards: [
          "Kikuyu Town",
          "Kinoo",
          "Sigona",
          "Karai",
          "Nachu",
        ],
      },
      {
        name: "Kabete",
        wards: [
          "Gitaru",
          "Muguga",
          "Nyadhuna",
          "Kabete",
          "Uthiru",
        ],
      },
      {
        name: "Kiambu Town",
        wards: [
          "Township",
          "Ndumberi",
          "Riabai",
          "Ting'ang'a",
        ],
      },
      {
        name: "Juja",
        wards: [
          "Juja Town / JKUAT",
          "Murera",
          "Theta",
          "Witeithie",
          "Kalimoni",
        ],
      },
      {
        name: "Limuru",
        wards: [
          "Limuru Central",
          "Bibirioni",
          "Limuru East",
          "Ngecha / Tigoni",
          "Ndeiya",
        ],
      },
      {
        name: "Githunguri",
        wards: ["Githunguri", "Githiga", "Ikinu", "Ngewa", "Komothai"],
      },
      {
        name: "Lari",
        wards: ["Kijabe", "Nyanduma", "Kamburu", "Lari", "Kirenga"],
      },
      {
        name: "Gatundu South",
        wards: ["Kiamwangi", "Kiganjo", "Ndarugu", "Ngenda"],
      },
      {
        name: "Gatundu North",
        wards: ["Gituamba", "Githobokoni", "Chania", "Mang'u"],
      },
    ],
  },

  // 016 - MACHAKOS
  {
    code: "016",
    name: "Machakos",
    capital: "Machakos",
    region: "Nairobi Metro",
    dispatchSla: "Same-Day (<2 Hrs)",
    constituencies: [
      {
        name: "Mavoko (Athi River / Syokimau)",
        wards: [
          "Syokimau / Mulolongo",
          "Athi River Town",
          "Kinanie",
          "Muthwani / Katani",
        ],
      },
      {
        name: "Machakos Town",
        wards: [
          "Machakos Central",
          "Muvuti / Kiima-Kimwe",
          "Mumbuni North",
          "Mutituni",
          "Ngelani",
          "Kalama",
        ],
      },
      {
        name: "Kangundo",
        wards: ["Kangundo Central", "Kangundo North", "Kangundo East", "Kangundo West"],
      },
      {
        name: "Matungulu",
        wards: ["Tala", "Matungulu North", "Matungulu East", "Matungulu West", "Kyeleni"],
      },
      {
        name: "Kathiani",
        wards: ["Mitaboni", "Kathiani Central", "Upper Kaewa/Iveti", "Lower Kaewa/Kaani"],
      },
      {
        name: "Yatta",
        wards: ["Ndalani", "Matuu", "Kithimani", "Ikombe", "Katangi"],
      },
      {
        name: "Mwala",
        wards: ["Mbiuni", "Makutano/Mwala", "Masii", "Muthetheni", "Wamunyu", "Kibauni"],
      },
      {
        name: "Masinga",
        wards: ["Kivaa", "Masinga Central", "Ekalakala", "Muthesya", "Ndithini"],
      },
    ],
  },

  // 034 - KAJIADO
  {
    code: "034",
    name: "Kajiado",
    capital: "Kajiado",
    region: "Nairobi Metro",
    dispatchSla: "Same-Day (<2 Hrs)",
    constituencies: [
      {
        name: "Kajiado North (Rongai / Ngong)",
        wards: [
          "Ongata Rongai",
          "Nkaimurunya",
          "Ngong",
          "Olkeri",
          "Oloolua",
        ],
      },
      {
        name: "Kajiado East (Kitengela)",
        wards: [
          "Kitengela Town",
          "Oloosirkon / Sholinke",
          "Kaputiei North",
          "Kenyawa-Poka",
          "Imaroro",
        ],
      },
      {
        name: "Kajiado West",
        wards: ["Keekonyokie", "Iloodokilani", "Magadi", "Ewuaso Oonkidong'i", "Mosiro"],
      },
      {
        name: "Kajiado Central",
        wards: ["Purko", "Ildamat", "Dalalekutuk", "Matapato North", "Matapato South"],
      },
      {
        name: "Kajiado South",
        wards: ["Entonet/Lenkisim", "Mbirikani/Eselenkei", "Kuku", "Rombo", "Kimana"],
      },
    ],
  },

  // 001 - MOMBASA
  {
    code: "001",
    name: "Mombasa",
    capital: "Mombasa",
    region: "Coast",
    dispatchSla: "Same-Day (<2 Hrs)",
    constituencies: [
      {
        name: "Mvita (Mombasa Island/CBD)",
        wards: ["Mji wa Kale / Makadara", "Tudor", "Tononoka", "Shimanzi / Ganjoni", "Majengo"],
      },
      {
        name: "Nyali",
        wards: ["Frere Town", "Ziwa La Ng'ombe", "Mkomani", "Kongowea", "Kadzandani"],
      },
      {
        name: "Changamwe",
        wards: ["Port Reitz", "Kipevu", "Airport", "Changamwe", "Chaani"],
      },
      {
        name: "Jomvu",
        wards: ["Jomvu Kuu", "Miritini", "Mikindani"],
      },
      {
        name: "Kisauni",
        wards: ["Bamburi", "Mtopanga", "Magogoni", "Shanzu", "Mjambere", "Junda", "Mwakirunge"],
      },
      {
        name: "Likoni",
        wards: ["Mtongwe", "Shika Adabu", "Bofu", "Likoni", "Timbwani"],
      },
    ],
  },

  // 032 - NAKURU
  {
    code: "032",
    name: "Nakuru",
    capital: "Nakuru",
    region: "Rift Valley",
    dispatchSla: "Same-Day (<2 Hrs)",
    constituencies: [
      {
        name: "Nakuru Town East",
        wards: ["Biashara (Nakuru CBD)", "Kivumbini", "Flamingo", "Menengai", "Nakuru East"],
      },
      {
        name: "Nakuru Town West",
        wards: ["Barut", "London", "Kaptembwo", "Kapkures", "Rhoda", "Shaabab"],
      },
      {
        name: "Naivasha",
        wards: ["Biashara (Naivasha Town)", "Hell's Gate", "Lake View", "Mai Mahiu", "Olkaria", "Naivasha East", "Viwandani"],
      },
      {
        name: "Gilgil",
        wards: ["Gilgil", "Elementaita", "Mbaruk/Eburu", "Malewa West", "Murindat"],
      },
      {
        name: "Njoro",
        wards: ["Njoro", "Mau Narok", "Mauche", "Kihingo", "Nesuit", "Lare"],
      },
      {
        name: "Rongai",
        wards: ["Menengai West", "Soin", "Visoi", "Mosop", "Solai"],
      },
      {
        name: "Bahati",
        wards: ["Dundori", "Kabatini", "Kiamaina", "Lanet/Umoja", "Bahati"],
      },
      {
        name: "Molo",
        wards: ["Mariashoni", "Elburgon", "Turi", "Molo"],
      },
    ],
  },

  // 042 - KISUMU
  {
    code: "042",
    name: "Kisumu",
    capital: "Kisumu",
    region: "Nyanza",
    dispatchSla: "Same-Day (<2 Hrs)",
    constituencies: [
      {
        name: "Kisumu Central",
        wards: ["Railways", "Migosi", "Shaurimoyo Kaloleni", "Market Milimani", "Kondele", "Nyalenda A"],
      },
      {
        name: "Kisumu East",
        wards: ["Kajulu", "Kolwa East", "Manyatta B", "Nyando", "Kolwa Central"],
      },
      {
        name: "Kisumu West",
        wards: ["South West Kisumu", "Central Kisumu", "Kisumu North", "West Kisumu", "North West Kisumu"],
      },
      {
        name: "Nyando",
        wards: ["East Kano/Wawidhi", "Awasi/Onjiko", "Ahero", "Kabonyo/Kanyagwal", "Kobura"],
      },
      {
        name: "Muhoroni",
        wards: ["Miwani", "Ombeyi", "Masogo/Nyang'oma", "Chemelil", "Muhoroni/Koru"],
      },
      {
        name: "Seme",
        wards: ["West Seme", "Central Seme", "East Seme", "North Seme"],
      },
      {
        name: "Nyakach",
        wards: ["South West Nyakach", "North Nyakach", "Central Nyakach", "West Nyakach", "South East Nyakach"],
      },
    ],
  },

  // 027 - UASIN GISHU (ELDORET)
  {
    code: "027",
    name: "Uasin Gishu",
    capital: "Eldoret",
    region: "Rift Valley",
    dispatchSla: "Same-Day (<2 Hrs)",
    constituencies: [
      {
        name: "Turbo",
        wards: ["Ngenyilel", "Tapsagoi", "Kamagut", "Kiplombe", "Kapsaos", "Huruma (Eldoret)"],
      },
      {
        name: "Ainabkoi",
        wards: ["Kapsoya", "Kaptagat", "Ainabkoi/Olare"],
      },
      {
        name: "Kapseret",
        wards: ["Simat/Kapseret", "Kipkenyo", "Ngeria", "Megun", "Langas"],
      },
      {
        name: "Kesses",
        wards: ["Racecourse", "Cheptiret/Kipchamo", "Tulwet/Chuiyat", "Tarakwa"],
      },
      {
        name: "Moiben",
        wards: ["Moiben", "Kimumu", "Sergoit", "Karuna/Meibeki", "Tembelio"],
      },
      {
        name: "Soy",
        wards: ["Moi's Bridge", "Kapkures", "Ziwa", "Segero/Barsombe", "Kipsomba", "Soy", "Kuinet/Kapsuswa"],
      },
    ],
  },

  // CENTRAL COUNTIES
  {
    code: "019",
    name: "Nyeri",
    capital: "Nyeri",
    region: "Central",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Nyeri Town", wards: ["Rware (CBD)", "Kiganjo/Mathari", "Ruring'u", "Gatitu/Muruguru", "Kamakwa/Mukaro"] },
      { name: "Tetu", wards: ["Dedan Kimathi", "Wamagana", "Aguthi-Gaaki"] },
      { name: "Kieni", wards: ["Mweiga", "Naromoru/Kiamathaga", "Gakawa", "Thegu River", "Mwiyogo/Endarasha"] },
      { name: "Mathira", wards: ["Ruguru", "Magutu", "Kirimukuyu", "Konyu", "Karatina Town"] },
      { name: "Othaya", wards: ["Mahiga", "Iria-ini", "Chinga", "Karima"] },
      { name: "Mukurweini", wards: ["Gikondi", "Rugi", "Mukurwe-ini West", "Mukurwe-ini Central"] },
    ],
  },
  {
    code: "020",
    name: "Kirinyaga",
    capital: "Kerugoya",
    region: "Central",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Kirinyaga Central", wards: ["Kerugoya", "Mutira", "Kanyekini", "Inoi"] },
      { name: "Ndia", wards: ["Mukure", "Kiine", "Kariti"] },
      { name: "Gichugu", wards: ["Kabare", "Baragwi", "Njukiini", "Ngariama", "Karumandi"] },
      { name: "Mwea", wards: ["Mutithi", "Kangai", "Wamumu", "Nyangati", "Murinduko", "Gathigiriri", "Teberu", "Thiba"] },
    ],
  },
  {
    code: "021",
    name: "Murang'a",
    capital: "Murang'a",
    region: "Central",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Kiharu", wards: ["Township (Murang'a CBD)", "Mbiri", "Mugoiri", "Murarandia", "Gaturi", "Kahuro"] },
      { name: "Maragua", wards: ["Kimorori/Wempa", "Makuyu", "Kambiti", "Kamahuha", "Ichagaki", "Nginda"] },
      { name: "Kandara", wards: ["Ng'araria", "Muruka", "Kagundu-ini", "Gaichanjiru", "Ithiru", "Ruchu"] },
      { name: "Gatanga", wards: ["Kariara", "Gatanga", "Kakuzi/Mitubiri", "Mugumo-ini", "Kihumbu-ini"] },
      { name: "Kigumo", wards: ["Kahumbu", "Muthithi", "Kigumo", "Kangari", "Kinyona"] },
      { name: "Kangema", wards: ["Kanyenya-ini", "Muguru", "Rwathia"] },
      { name: "Mathioya", wards: ["Gitugi", "Kiru", "Kamachamu"] },
    ],
  },
  {
    code: "018",
    name: "Nyandarua",
    capital: "Ol Kalou",
    region: "Central",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Ol Kalou", wards: ["Karau", "Kanjuiri Ridge", "Mirangine", "Kaimbaga", "Rurii"] },
      { name: "Kinangop", wards: ["Engineer", "Gathara", "North Kinangop", "Murungaru", "Njabini/Kiburu", "Magumu", "Nyakio", "Githabai"] },
      { name: "Kipipiri", wards: ["Wanjohi", "Kipipiri", "Geta", "Githioro"] },
      { name: "Ndaragwa", wards: ["Leshau/Pondo", "Kiriita", "Central", "Shamata"] },
      { name: "Ol Joro Orok", wards: ["Gathanji", "Gatimu", "Weru", "Charagita"] },
    ],
  },

  // EASTERN COUNTIES
  {
    code: "012",
    name: "Meru",
    capital: "Meru",
    region: "Eastern",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Imenti North", wards: ["Municipality (Meru CBD)", "Ntima East", "Ntima West", "Nyaki West", "Nyaki East"] },
      { name: "Imenti South", wards: ["Mitunguu", "Igoji East", "Igoji West", "Abogeta East", "Abogeta West", "Nkuene"] },
      { name: "Imenti Central", wards: ["Mwanganthia", "Abothuguchi Central", "Abothuguchi West", "Kiagu", "Kibirichia"] },
      { name: "Buuri", wards: ["Timau", "Kisima", "Kiirua/Ruaki", "Ruiri/Rwarera", "Kibirichia"] },
      { name: "Tigania West", wards: ["Athwana", "Akithi", "Kianjai", "Nkomo", "Mbeu"] },
      { name: "Tigania East", wards: ["Thangatha", "Mikinduri", "Kiguchwa", "Muthara", "Karama"] },
      { name: "Igembe South", wards: ["Maua", "Kiegoi/Antubochiu", "Athiru Gaiti", "Akachiu", "Kanuni"] },
      { name: "Igembe Central", wards: ["Akirang'ondu", "Athiru Ruujine", "Igembe East", "Njia", "Kangeta"] },
      { name: "Igembe North", wards: ["Antuambui", "Ntunene", "Antubetwe Kiongo", "Naathu", "Amwathi"] },
    ],
  },
  {
    code: "014",
    name: "Embu",
    capital: "Embu",
    region: "Eastern",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Manyatta", wards: ["Kirimari (Embu CBD)", "Gaturi South", "Nginda", "Mbeti North", "Kiriari", "Ruguru/Ngandori"] },
      { name: "Runyenjes", wards: ["Runyenjes Central", "Gaturi North", "Kagaari South", "Kagaari North", "Kyeni North", "Kyeni South"] },
      { name: "Mbeere South", wards: ["Mwea", "Makima", "Mbeti South", "Mavuria", "Kiambere"] },
      { name: "Mbeere North", wards: ["Nthawa", "Muminji", "Evurore"] },
    ],
  },
  {
    code: "015",
    name: "Kitui",
    capital: "Kitui",
    region: "Eastern",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Kitui Central", wards: ["Township (Kitui CBD)", "Miambani", "Kyangwithya West", "Kyangwithya East", "Mulango"] },
      { name: "Kitui West", wards: ["Mutonguni", "Kauwi", "Matinyani", "Kwa Mutonga/Kithumula"] },
      { name: "Kitui Rural", wards: ["Kisasi", "Mbitini", "Kwavonza/Yatta", "Kanyangi"] },
      { name: "Kitui East", wards: ["Zombe/Mwitika", "Chuluni", "Nzambani", "Voo/Kyamatu", "Endau/Malalani", "Mutito/Kaliku"] },
      { name: "Kitui South", wards: ["Ikanga/Kyatune", "Mutomo", "Mutha", "Ikutha", "Kanziko", "Athi"] },
      { name: "Mwingi Central", wards: ["Central", "Kivou", "Nguni", "Nuu", "Mui", "Waita"] },
      { name: "Mwingi North", wards: ["Ngomeni", "Kyuso", "Mumoni", "Tseikuru", "Tharaka"] },
      { name: "Mwingi West", wards: ["Kyome/Thaana", "Nguutani", "Migwani", "Kiomo/Kyethani"] },
    ],
  },
  {
    code: "017",
    name: "Makueni",
    capital: "Wote",
    region: "Eastern",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Makueni", wards: ["Wote (CBD)", "Muvau/Kikuumini", "Mavindini", "Kitise/Kithuki", "Kathonzweni", "Nzaui/Kilili/Kalamba", "Mbitini"] },
      { name: "Kibwezi West", wards: ["Makindu", "Nguumo", "Kikumbulyu North", "Kikumbulyu South", "Nguu/Masumba", "Emali/Mulala"] },
      { name: "Kibwezi East", wards: ["Masongaleni", "Mtito Andei", "Thange", "Ivingoni/Nzambani"] },
      { name: "Kilome", wards: ["Kiima Kiu/Kalanzoni", "Mukaa", "Kasikeu"] },
      { name: "Kaiti", wards: ["Ukia", "Kee", "Kilungu", "Ilima"] },
      { name: "Mbooni", wards: ["Tulimani", "Mbooni", "Kithungo/Kitundu", "Kiteta/Kisau", "Waia-Kako", "Kalawa"] },
    ],
  },
  {
    code: "013",
    name: "Tharaka-Nithi",
    capital: "Kathwana",
    region: "Eastern",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Chuka/Igambang'ombe", wards: ["Mariani", "Karingani", "Magumoni", "Mugwe", "Igambang'ombe"] },
      { name: "Maara", wards: ["Mitheru", "Muthambi", "Mwimbi", "Ganga", "Chogoria"] },
      { name: "Tharaka", wards: ["Gatunga", "Mukothima", "Nkondi", "Chiakariga", "Marimanti"] },
    ],
  },
  {
    code: "011",
    name: "Isiolo",
    capital: "Isiolo",
    region: "Eastern",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Isiolo North", wards: ["Wabera", "Bulla Pesa", "Chari", "Cherab", "Ngaremara", "Burat", "Oldo/Nyiro"] },
      { name: "Isiolo South", wards: ["Garbatulla", "Kinna", "Sericho"] },
    ],
  },
  {
    code: "010",
    name: "Marsabit",
    capital: "Marsabit",
    region: "Eastern",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Saku", wards: ["Sagante/Jaldesa", "Karare", "Marsabit Central"] },
      { name: "Laisamis", wards: ["Loiyangalani", "Kargi/South Horr", "Korr/Ngurunit", "Logo Logo", "Laisamis"] },
      { name: "North Horr", wards: ["Dukana", "Maikona", "Turbi", "North Horr", "Illeret"] },
      { name: "Moyale", wards: ["Moyale Township", "Uran", "Obbu", "Golbo", "Heillu/Manyatta", "Sololo"] },
    ],
  },

  // COAST COUNTIES
  {
    code: "003",
    name: "Kilifi",
    capital: "Kilifi",
    region: "Coast",
    dispatchSla: "Same-Day (<2 Hrs)",
    constituencies: [
      { name: "Kilifi North", wards: ["Tezo", "Sokoni", "Kibarani", "Dabaso", "Matsangoni", "Watamu", "Mnarani"] },
      { name: "Kilifi South", wards: ["Junju", "Mwarakaya", "Shimo la Tewa", "Chasimba", "Mtepeni"] },
      { name: "Malindi", wards: ["Shella", "Ganda", "Malindi Town", "Kakuyuni", "Jilore"] },
      { name: "Magarini", wards: ["Marafa", "Magarini", "Gongoni", "Adu", "Garashi", "Sabaki"] },
      { name: "Kaloleni", wards: ["Mariakani", "Kayafungo", "Kaloleni", "Mwanamwinga"] },
      { name: "Rabai", wards: ["Mwawesa", "Ruruma", "Kambe/Ribe", "Rabai/Kisurutini"] },
      { name: "Ganze", wards: ["Ganze", "Bamba", "Jaribuni", "Sokoke"] },
    ],
  },
  {
    code: "002",
    name: "Kwale",
    capital: "Kwale",
    region: "Coast",
    dispatchSla: "Same-Day (<2 Hrs)",
    constituencies: [
      { name: "Matuga", wards: ["Tsimba Golini", "Waa", "Tiwi", "Kubu", "Mkongani"] },
      { name: "Msambweni", wards: ["Gombato Bongwe", "Ukunda (Diani)", "Kinondo", "Ramisi"] },
      { name: "Lunga Lunga", wards: ["Pongwe/Kikoneni", "Dzombo", "Mwereni", "Vanga"] },
      { name: "Kinango", wards: ["Ndavaya", "Puma", "Kinango", "Mackinnon Road", "Chengoni/Samburu", "Mwavumbo", "Kasemeni"] },
    ],
  },
  {
    code: "006",
    name: "Taita Taveta",
    capital: "Mwatate",
    region: "Coast",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Voi", wards: ["Mbololo", "Sagalla", "Kaloleni", "Marungu", "Ngolia", "Kasigau"] },
      { name: "Wundanyi", wards: ["Wundanyi/Mbale", "Werugha", "Wumingu/Kishushe", "Mwanda/Mgange"] },
      { name: "Mwatate", wards: ["Ronge", "Mwatate", "Bura", "Chawia", "Wusi/Kishamba"] },
      { name: "Taveta", wards: ["Chala", "Mahoo", "Mboghoni", "Mata", "Bomeni"] },
    ],
  },
  {
    code: "004",
    name: "Tana River",
    capital: "Hola",
    region: "Coast",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Galole", wards: ["Wayu", "Chewani", "Mikinduni", "Kinakomba"] },
      { name: "Bura", wards: ["Chewele", "Hirimani", "Bangale", "Sala", "Madogo"] },
      { name: "Garsen", wards: ["Kipini East", "Garsen South", "Kipini West", "Garsen Central", "Garsen North", "Garsen West"] },
    ],
  },
  {
    code: "005",
    name: "Lamu",
    capital: "Lamu",
    region: "Coast",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Lamu West", wards: ["Shella", "Mkomani", "Hindi", "Mkunumbi", "Hongwe", "Witu", "Bahari"] },
      { name: "Lamu East", wards: ["Faza", "Kiunga", "Basuba"] },
    ],
  },

  // RIFT VALLEY COUNTIES
  {
    code: "031",
    name: "Laikipia",
    capital: "Rumuruti",
    region: "Rift Valley",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Laikipia East (Nanyuki)", wards: ["Nanyuki (CBD)", "Ngobit", "Tigithi", "Thingithu", "Umande"] },
      { name: "Laikipia West (Nyahururu)", wards: ["Ol-Moran", "Rumuruti Township", "Githiga", "Marmanet", "Igwamiti", "Salama"] },
      { name: "Laikipia North", wards: ["Sosian", "Segera", "Mugogodo West", "Mugogodo East"] },
    ],
  },
  {
    code: "033",
    name: "Narok",
    capital: "Narok",
    region: "Rift Valley",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Narok North", wards: ["Olpusimoru", "Olokurto", "Narok Town (CBD)", "Nkareta", "Olorropil", "Melili"] },
      { name: "Narok South", wards: ["Majimoto/Naroosura", "Ololulung'a", "Melelo", "Loita", "Sogoo", "Sagamian"] },
      { name: "Narok East", wards: ["Mosiro", "Ildamat", "Keekonyokie", "Suswa"] },
      { name: "Narok West", wards: ["Ilmotiok", "Mara", "Siana", "Naikarra"] },
      { name: "Kilgoris", wards: ["Kilgoris Central", "Keyian", "Angata Barikoi", "Shankoe", "Kimintet", "Lolgorian"] },
      { name: "Emurua Dikirr", wards: ["Ilkerin", "Ololmasani", "Mogondo", "Kapsasian"] },
    ],
  },
  {
    code: "035",
    name: "Kericho",
    capital: "Kericho",
    region: "Rift Valley",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Ainamoi", wards: ["Kipchebor", "Kapsaos", "Kipchimchim", "Ainamoi", "Kapsoit", "Kapkugerwet"] },
      { name: "Belgut", wards: ["Waldai", "Kabianga", "Cheptororiet/Seretut", "Chaik", "Kapsuser"] },
      { name: "Bureti", wards: ["Kisiara", "Tebesonik", "Cheboin", "Chemosot", "Litein", "Roret", "Cheplanget"] },
      { name: "Kipkelion East", wards: ["Londiani", "Sigowet", "Kedowa/Kimugul", "Chepseon"] },
      { name: "Kipkelion West", wards: ["Kunyet", "Kipkelion", "Chilchila", "Kamassian"] },
      { name: "Sigowet/Soin", wards: ["Sigowet", "Kaplelartet", "Soliat", "Soin"] },
    ],
  },
  {
    code: "036",
    name: "Bomet",
    capital: "Bomet",
    region: "Rift Valley",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Bomet Central", wards: ["Silibwet Township", "Ndaraweta", "Singorwet", "Chesoen", "Mutarakwa"] },
      { name: "Bomet East", wards: ["Merigi", "Kembu", "Longisa", "Kipreres", "Chemaner"] },
      { name: "Chepalungu", wards: ["Kong'asis", "Nyangores", "Sigor", "Chebunyo", "Siongiroi"] },
      { name: "Sotik", wards: ["Ndanai/Abosi", "Chemagel", "Kipsonoi", "Kapletundo", "Rongena/Manaret"] },
      { name: "Konoin", wards: ["Chepchabas", "Kimulot", "Mogogosiek", "Boito", "Embomos"] },
    ],
  },
  {
    code: "029",
    name: "Nandi",
    capital: "Kapsabet",
    region: "Rift Valley",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Emgwen", wards: ["Kapsabet (CBD)", "Chepkumia", "Kilibwoni", "Kapkangani"] },
      { name: "Chesumei", wards: ["Chemundu/Kapng'etuny", "Kosirai", "Lelmokwo/Ngechek", "Kaptel/Kamoiywo", "Kiptuya"] },
      { name: "Nandi Hills", wards: ["Nandi Hills", "Chepkunyuk", "Ol'lessos", "Kapchorua"] },
      { name: "Mosop", wards: ["Kipkaren", "Kurgung/Surungai", "Kabiyet", "Ndangila", "Kabisaga", "Sangalo/Kebulonik"] },
      { name: "Aldai", wards: ["Maraba", "Terik", "Kemeloi-Maraba", "Kobujoi", "Kaptumo-Kaboi", "Koyo-Ndurio"] },
      { name: "Tindiret", wards: ["Songhor/Soba", "Tindiret", "Chemelil/Chemase", "Kapsiman"] },
    ],
  },
  {
    code: "026",
    name: "Trans Nzoia",
    capital: "Kitale",
    region: "Rift Valley",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Kwanza", wards: ["Kapomboi", "Kwanza", "Keiyo", "Bidii"] },
      { name: "Endebess", wards: ["Endebess", "Matumbei", "Chepchoina"] },
      { name: "Saboti", wards: ["Kinyoro", "Matisi", "Tuwani", "Saboti", "Machewa"] },
      { name: "Kiminini", wards: ["Kiminini", "Waitaluk", "Sirende", "Hospital (Kitale CBD)", "Sikhendu", "Nabiswa"] },
      { name: "Cherangany", wards: ["Sinyerere", "Makutano", "Kaplamai", "Motosiet", "Cherangany/Suwerwa", "Chepsiro/Kiptoror", "Sitatunga"] },
    ],
  },
  {
    code: "030",
    name: "Baringo",
    capital: "Kabarnet",
    region: "Rift Valley",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Baringo Central", wards: ["Kabarnet (CBD)", "Sacho", "Tenges", "Ewalel Chapchap", "Kapropita"] },
      { name: "Baringo North", wards: ["Barwessa", "Kabartonjo", "Saimo/Kipsaraman", "Saimo/Soi", "Bartabwa"] },
      { name: "Baringo South", wards: ["Marigat", "Ilchamus", "Mochongoi", "Mukutani"] },
      { name: "Eldama Ravine", wards: ["Lembus", "Lembus Kwen", "Ravine", "Mumberes/Maji Mazuri", "Lembus/Pekerra"] },
      { name: "Mogotio", wards: ["Mogotio", "Emining", "Kisanana"] },
      { name: "Tiaty", wards: ["Tirioko", "Kolowa", "Ribkwo", "Silale", "Tangulbei/Korossi", "Loyamorok"] },
    ],
  },
  {
    code: "028",
    name: "Elgeyo-Marakwet",
    capital: "Iten",
    region: "Rift Valley",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Keiyo North", wards: ["Iten (CBD)", "Emsoo", "Kamariny", "Kapchemutwa", "Tambach"] },
      { name: "Keiyo South", wards: ["Kaptarakwa", "Chepkorio", "Soy North", "Soy South", "Kabiemit", "Metkei"] },
      { name: "Marakwet West", wards: ["Lelan", "Sengwer", "Cherang'any/Chebororwa", "Moiben/Kuserwo", "Kapsowar", "Arror"] },
      { name: "Marakwet East", wards: ["Kapyego", "Sambirir", "Endo", "Embobut/Embulot"] },
    ],
  },
  {
    code: "023",
    name: "Turkana",
    capital: "Lodwar",
    region: "Rift Valley",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Turkana Central", wards: ["Lodwar Township", "Kanamkemer", "Kalokol", "Kerio Delta", "Kang'atotha"] },
      { name: "Turkana West (Kakuma)", wards: ["Kakuma", "Lopur", "Letea", "Songot", "Kalobeyei", "Lokichoggio", "Nanaam"] },
      { name: "Turkana East", wards: ["Kapedo/Napeitom", "Katilia", "Lokori/Kochodin"] },
      { name: "Turkana North", wards: ["Kaeris", "Lake Zone", "Lapur", "Kaaleng/Kaikor", "Kibish", "Nakalale"] },
      { name: "Turkana South", wards: ["Lokichar", "Kwatela", "Katilu", "Lobokat", "Kaputir"] },
      { name: "Loima", wards: ["Kotaruk/Lobei", "Turkwel", "Loima", "Lokiriama/Lorengippi"] },
    ],
  },
  {
    code: "024",
    name: "West Pokot",
    capital: "Kapenguria",
    region: "Rift Valley",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Kapenguria", wards: ["Kapenguria (CBD)", "Mnagei", "Siyoi", "Riwo", "Endugh", "Sook"] },
      { name: "Sigor", wards: ["Sekerr", "Masool", "Lomut", "Weiwei"] },
      { name: "Kacheliba", wards: ["Suam", "Kodich", "Kasei", "Kapchok", "Kiwawa", "Alale"] },
      { name: "Pokot South", wards: ["Chepareria", "Batei", "Lelan", "Tapach"] },
    ],
  },
  {
    code: "025",
    name: "Samburu",
    capital: "Maralal",
    region: "Rift Valley",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Samburu West", wards: ["Maralal (CBD)", "Lodokejek", "Suguta Marmar", "Poro", "Loosuk"] },
      { name: "Samburu North", wards: ["El-Barta", "Nachola", "Ndoto", "Nyiro", "Angata Nanyokie", "Baawa"] },
      { name: "Samburu East", wards: ["Waso", "Wamba West", "Wamba East", "Wamba North"] },
    ],
  },

  // WESTERN COUNTIES
  {
    code: "037",
    name: "Kakamega",
    capital: "Kakamega",
    region: "Western",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Lurambi", wards: ["Sheywe (Kakamega CBD)", "Mahiakalo", "Shirere", "Ingotse-Mathia", "Shinoyi-Shikomari-Esumeyia", "Butsotso East", "Butsotso South", "Butsotso Central"] },
      { name: "Mumias West", wards: ["Mumias Central", "Mumias North", "Etenje", "Musanda"] },
      { name: "Mumias East", wards: ["Lusheya/Lubinu", "Malaha/Isongo/Makunga", "East Wanga"] },
      { name: "Matungu", wards: ["Koyonzo", "Kholera", "Khalaba", "Mayoni", "Namamali"] },
      { name: "Butere", wards: ["Marama West", "Marama Central", "Marenyo-Shianda", "Marama North", "Marama South"] },
      { name: "Khwisero", wards: ["Kisa North", "Kisa East", "Kisa West", "Kisa Central"] },
      { name: "Shinyalu", wards: ["Isukha North", "Isukha Central", "Isukha South", "Isukha East", "Isukha West", "Murhanda"] },
      { name: "Ikolomani", wards: ["Idakho South", "Idakho East", "Idakho North", "Idakho Central"] },
      { name: "Malava", wards: ["West Kabras", "Chemuche", "East Kabras", "South Kabras", "Manda-Shivanga", "Shirugu-Mugai"] },
      { name: "Navakholo", wards: ["Ingotse-Mathia", "Shinoyi-Shikomari", "Bunyala West", "Bunyala Central", "Bunyala East"] },
      { name: "Lugari", wards: ["Mautuma", "Lugari", "Lumakanda", "Chekalini", "Chevaywa", "Lwandeti"] },
      { name: "Likuyani", wards: ["Likuyani", "Sango", "Kongoni", "Nzoia", "Sinoko"] },
    ],
  },
  {
    code: "039",
    name: "Bungoma",
    capital: "Bungoma",
    region: "Western",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Kanduyi", wards: ["Township (Bungoma CBD)", "Bukembe West", "Bukembe East", "Sang'alo", "Musikoma", "Khalaba", "Mtu-Ini"] },
      { name: "Webuye East", wards: ["Mihuu", "Ndivisi", "Maraka"] },
      { name: "Webuye West", wards: ["Sitikho", "Matulo", "Bokoli"] },
      { name: "Sirisia", wards: ["Namwwela", "Malakisi/South Kulisiru", "Lwandanyi"] },
      { name: "Kabuchai", wards: ["Luhya", "West Nalondo", "Central Namwamba", "Mukuyuni", "Chwele/Kabuchai"] },
      { name: "Kimilili", wards: ["Kimilili", "Kibingei", "Maeni", "Kamukuywa"] },
      { name: "Tongaren", wards: ["Mbakalo", "Naitiri/Kabuyefwe", "Milima", "Ndalu", "Tongaren", "Soysambu/Mitua"] },
      { name: "Bumula", wards: ["Bumula", "Khasoko", "Kabula", "Kimaeti", "South Bukusu", "Siboti"] },
      { name: "Mount Elgon", wards: ["Cheptais", "Chesikaki", "Chepyuk", "Kapkateny", "Kaptama", "Elgon"] },
    ],
  },
  {
    code: "038",
    name: "Vihiga",
    capital: "Mbale",
    region: "Western",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Vihiga", wards: ["Lugaga-Wamuluma (Mbale CBD)", "South Maragoli", "Central Maragoli", "Mungoma"] },
      { name: "Sabatia", wards: ["Lyaduywa/Izava", "West Sabatia", "Chavakali", "North Maragoli", "Wodanga", "Busali"] },
      { name: "Hamisi", wards: ["Shiru", "Gisambai", "Shamakhokho", "Banja", "Muhudu", "Tambua", "Jepkoyai"] },
      { name: "Luanda", wards: ["Luanda Township", "Wemilabi", "Mwibona", "Luanda South", "Emabungo"] },
      { name: "Emuhaya", wards: ["North East Bunyore", "Central Bunyore", "West Bunyore"] },
    ],
  },
  {
    code: "040",
    name: "Busia",
    capital: "Busia",
    region: "Western",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Matayos", wards: ["Burumba (Busia CBD)", "Mayenje", "Matayos South", "Busibwabo", "Bukhayo West"] },
      { name: "Teso North", wards: ["Malaba Central", "Malaba North", "Malaba South", "Ang'urai South", "Ang'urai North", "Ang'urai East"] },
      { name: "Teso South", wards: ["Amukura West", "Amukura East", "Amukura Central", "Chakoi South", "Chakoi North", "Ang'orom"] },
      { name: "Nambale", wards: ["Nambale Township", "Bukhayo North/Waltsi", "Bukhayo East", "Bukhayo Central"] },
      { name: "Butula", wards: ["Marachi West", "Marachi Central", "Marachi East", "Marachi North", "Elugulu", "Kingandole"] },
      { name: "Funyula", wards: ["Namboboto Nambuku", "Nangina", "Ageng'a Nanguba", "Bwiri"] },
      { name: "Budalangi", wards: ["Bunyala Central", "Bunyala North", "Bunyala West", "Bunyala South"] },
    ],
  },

  // NYANZA COUNTIES
  {
    code: "045",
    name: "Kisii",
    capital: "Kisii",
    region: "Nyanza",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Kitutu Chache South", wards: ["Bogeka", "Nyakoe", "Kitutu Central (Kisii CBD)", "Nyatieko", "Daraja Mbili"] },
      { name: "Kitutu Chache North", wards: ["Monyerero", "Sensi", "Marani", "Kegogi"] },
      { name: "Nyaribari Chache", wards: ["Bobaracho", "Kisii Central", "Keumbu", "Kiogoro", "Birongo", "Ibeno"] },
      { name: "Nyaribari Masaba", wards: ["Ichuni", "Nyamasibi", "Masimba", "Gesusu", "Kiamokama"] },
      { name: "Bonchari", wards: ["Bomariba", "Bogiakumu", "Bomorenda", "Riana"] },
      { name: "South Mugirango", wards: ["Bogetenga", "Borabu/Chitago", "Moticho", "Getenga", "Tabaka", "Boikanga"] },
      { name: "Bomachoge Borabu", wards: ["Bombaba Borabu", "Boochi Borabu", "Bokimonge", "Magenche"] },
      { name: "Bomachoge Chache", wards: ["Majoge Basi", "Boochi/Tendere", "Bosoti/Sengera"] },
      { name: "Bobasi", wards: ["Masige West", "Masige East", "Bobasi Central", "Nyacheki", "Bassi Bogetaorio", "Bobasi Chache", "Sameta/Mokwerero", "Bobasi/Boitangare"] },
    ],
  },
  {
    code: "046",
    name: "Nyamira",
    capital: "Nyamira",
    region: "Nyanza",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "West Mugirango", wards: ["Nyamira Township", "Bogichora", "Bosamaro", "Bonyamatuta", "Township"] },
      { name: "North Mugirango", wards: ["Itibo", "Bomwagamo", "Bokeira", "Magwagwa", "Ekerenyo"] },
      { name: "Kitutu Masaba", wards: ["Rigoma", "Gachuba", "Kemera", "Magombo", "Manga", "Gesima"] },
      { name: "Borabu", wards: ["Mekenene", "Kiabonyoru", "Esise", "Nyansiongo"] },
    ],
  },
  {
    code: "041",
    name: "Siaya",
    capital: "Siaya",
    region: "Nyanza",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Alego Usonga", wards: ["Siaya Township", "North Alego", "South East Alego", "West Alego", "Central Alego", "Usonga"] },
      { name: "Gem", wards: ["North Gem", "West Gem", "Central Gem", "Yala Township", "East Gem", "South Gem"] },
      { name: "Ugenya", wards: ["West Ugenya", "Ukwala", "North Ugenya", "East Ugenya"] },
      { name: "Ugunja", wards: ["Sidindi", "Sigomere", "Ugunja"] },
      { name: "Bondo", wards: ["Yimbo West", "Central Sakwa", "South Sakwa", "Yimbo East", "West Sakwa", "Bondo Township"] },
      { name: "Rarieda", wards: ["East Asembo", "West Asembo", "North Uyoma", "South Uyoma", "West Uyoma"] },
    ],
  },
  {
    code: "043",
    name: "Homa Bay",
    capital: "Homa Bay",
    region: "Nyanza",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Homa Bay Town", wards: ["Homa Bay Central", "Homa Bay Arujo", "Homa Bay West", "Homa Bay East"] },
      { name: "Rangwe", wards: ["West Gem", "East Gem", "Kagan", "Kochia"] },
      { name: "Ndhiwa", wards: ["Kwabwai", "Kanyadoto", "Kanyikela", "Kabuoch North", "Kabuoch South/Pala", "Kanyamwa Kologi", "Kanyamwa Kosewe"] },
      { name: "Mbita", wards: ["Mfangano Island", "Rusinga Island", "Kasgunga", "Gembe", "Lambwe"] },
      { name: "Suba", wards: ["Gwassi South", "Gwassi North", "Kaksingri West", "Ruma Kaksingri East"] },
      { name: "Karachuonyo", wards: ["West Karachuonyo", "North Karachuonyo", "Central", "Kanyaluo", "Kibiri", "Wangchieng", "Kendu Bay Town"] },
      { name: "Kasipul", wards: ["West Kasipul", "South Kasipul", "Central Kasipul", "East Kamagak", "West Kamagak"] },
      { name: "Kabondo Kasipul", wards: ["Kabondo East", "Kabondo West", "Kokwanyo/Kakelo", "Kojwach"] },
    ],
  },
  {
    code: "044",
    name: "Migori",
    capital: "Migori",
    region: "Nyanza",
    dispatchSla: "Next-Day / Scheduled",
    constituencies: [
      { name: "Suna East", wards: ["God Jope", "Suna Central (Migori CBD)", "Kakrao", "Kwa"] },
      { name: "Suna West", wards: ["Wiga", "Wasweta II", "Ragana-Oruba", "Wasimbete"] },
      { name: "Rongo", wards: ["North Kamagambo", "Central Kamagambo", "East Kamagambo", "South Kamagambo"] },
      { name: "Awendo", wards: ["North Sakwa", "South Sakwa", "West Sakwa", "Central Sakwa"] },
      { name: "Uriri", wards: ["West Kanyamkago", "North Kanyamkago", "Central Kanyamkago", "South Kanyamkago", "East Kanyamkago"] },
      { name: "Nyatike", wards: ["Kachieng'", "Kanyasa", "North Kadem", "Macalder/Kanyarwanda", "Kaler", "Got Kachola", "Muhuru"] },
      { name: "Kuria West", wards: ["Bukira East", "Bukira Central/Ikerege", "Isibania", "Makerero", "Masaba", "Tagare", "Nyamosense/Komosoko"] },
      { name: "Kuria East", wards: ["Gokeharaka/Getambwega", "Ntimaru West", "Ntimaru East", "Nyabasi East", "Nyabasi West"] },
    ],
  },

  // NORTH EASTERN COUNTIES
  {
    code: "007",
    name: "Garissa",
    capital: "Garissa",
    region: "North Eastern",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Garissa Township", wards: ["Waberi", "Galbet", "Township (CBD)", "Iftin"] },
      { name: "Fafi", wards: ["Bura", "Dekaharia", "Jarajila", "Fafi", "Nanighi"] },
      { name: "Dadaab", wards: ["Dertu", "Dadaab", "Labasigale", "Damajale", "Liboi", "Abakaile"] },
      { name: "Balambala", wards: ["Balambala", "Danyere", "Jarajara", "Saka", "Sankuri"] },
      { name: "Lagdera", wards: ["Modogashe", "Benane", "Goreale", "Maalamin", "Sabena", "Baraki"] },
      { name: "Ijara", wards: ["Hulugho", "Sangailu", "Ijara", "Masalani"] },
    ],
  },
  {
    code: "008",
    name: "Wajir",
    capital: "Wajir",
    region: "North Eastern",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Wajir East", wards: ["Wagberi", "Township (CBD)", "Barwago", "Khorof/Harar"] },
      { name: "Wajir West", wards: ["Arbajahan", "Hadado/Athibohol", "Ademasajida", "Ganyure/Wagalla"] },
      { name: "Wajir North", wards: ["Gurar", "Bute", "Korondile", "Malkagufu", "Batalu", "Danaba", "Godoma"] },
      { name: "Wajir South", wards: ["Benane", "Burder", "Dadajabula", "Habaswein", "Lagboghol South", "Ibrahim Ure", "Diif"] },
      { name: "Tarbaj", wards: ["Elben", "Sarman", "Tarbaj", "Wargadud"] },
      { name: "Eldas", wards: ["Eldas", "Anole", "Elnur/Tula Tula", "Lakoley South/Basir"] },
    ],
  },
  {
    code: "009",
    name: "Mandera",
    capital: "Mandera",
    region: "North Eastern",
    dispatchSla: "Remote Diagnostic / Scheduled",
    constituencies: [
      { name: "Mandera East", wards: ["Township (CBD)", "Neboi", "Khalalio", "Libehia", "Arabia"] },
      { name: "Mandera West", wards: ["Takaba South", "Takaba", "Lagsure", "Dandu", "Gither"] },
      { name: "Mandera North", wards: ["Rhamu", "Rhamu Dimtu", "Ashabito", "Guticha", "Marothile"] },
      { name: "Mandera South", wards: ["Wargadud", "Kutulo", "Elwak South", "Elwak North", "Shimbir Fatuma"] },
      { name: "Banissa", wards: ["Banissa", "Derkhale", "Guba", "Malkamari", "Kiliwehiri"] },
      { name: "Lafey", wards: ["Sala", "Fino", "Lafey", "Waranqara", "Alango Gof"] },
    ],
  },
];

// Quick Lookup Maps for O(1) Access
export const COUNTY_BY_CODE = new Map(KENYA_COUNTIES.map((c) => [c.code, c]));
export const COUNTY_BY_NAME = new Map(KENYA_COUNTIES.map((c) => [c.name.toLowerCase(), c]));

/**
 * Format structured location into standardized text string
 */
export function formatLocationString(
  countyName: string,
  constituencyName?: string,
  wardName?: string,
  buildingOrStreet?: string
): string {
  const parts: string[] = [];
  if (buildingOrStreet && buildingOrStreet.trim()) {
    parts.push(buildingOrStreet.trim());
  }
  if (wardName && wardName.trim()) {
    parts.push(wardName.trim());
  }
  if (constituencyName && constituencyName.trim()) {
    parts.push(constituencyName.trim());
  }
  if (countyName && countyName.trim()) {
    parts.push(countyName.includes("County") ? countyName.trim() : `${countyName.trim()} County`);
  }
  return parts.join(", ") || "Nairobi, Kenya";
}

/**
 * Get estimated SLA based on county & constituency
 */
export function getEstimatedDispatchSLA(countyName: string, constituencyName?: string): {
  badge: string;
  color: string;
  responseTime: string;
} {
  const normalized = countyName.toLowerCase();
  if (normalized.includes("nairobi")) {
    if (constituencyName && ["Westlands", "Starehe", "Dagoretti North", "Lang'ata"].includes(constituencyName)) {
      return {
        badge: "⚡ Nairobi Core SLA: < 45 Mins On-Site",
        color: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
        responseTime: "Under 45 minutes direct on-site arrival",
      };
    }
    return {
      badge: "⚡ Nairobi Metro: Same-Day On-Site (< 90 Mins)",
      color: "text-teal-700 dark:text-teal-300 bg-teal-500/10 border-teal-500/20",
      responseTime: "Same-day on-site visit or 15-min remote fix",
    };
  }

  if (normalized.includes("kiambu") || normalized.includes("machakos") || normalized.includes("kajiado")) {
    return {
      badge: "🚀 Nairobi Metropolitan: Same-Day On-Site",
      color: "text-sky-700 dark:text-sky-300 bg-sky-500/10 border-sky-500/20",
      responseTime: "Same-day on-site dispatch across metropolitan area",
    };
  }

  if (normalized.includes("mombasa") || normalized.includes("nakuru") || normalized.includes("kisumu") || normalized.includes("uasin gishu")) {
    return {
      badge: "🏢 Major Commercial Hub: 15-Min Remote + Scheduled On-Site",
      color: "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20",
      responseTime: "Immediate 15-min remote triage • Scheduled on-site visits",
    };
  }

  return {
    badge: "🌐 Countrywide: 15-Min Remote Diagnostic & Cloud Support",
    color: "text-purple-700 dark:text-purple-300 bg-purple-500/10 border-purple-500/20",
    responseTime: "Immediate remote connection countrywide • Project site visits",
  };
}
