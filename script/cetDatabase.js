/**
 * WMSU-Ease CET Database  –  A.Y. 2025-2026
 * 500 applicant records  |  App Nos: 2526-00001 → 2526-00500
 *
 * CET Sub-scores (Percentile Rank 1–99):
 *   EP  = English Proficiency
 *   RC  = Reading Comprehension
 *   SPS = Science Process Skills
 *   QS  = Quantitative Skills
 *   ATS = Abstract Thinking Skills
 *   OAPR = Overall Ability Percentile Rank
 *
 * Extra fields for special programs:
 *   natScore  – Nursing Aptitude Test  (Nursing applicants)
 *   eatScore  – Engineering Aptitude Test (Engineering applicants)
 *
 * type: 'freshman' | 'transferee'
 */

(function () {

  /* ─── Real Filipino surname pool ─────────────────────────────── */
  const SURNAMES = [
    // Common Visayan / Tagalog
    "Reyes","Cruz","Santos","Garcia","Ramos","Torres","Flores","Valdez","Lopez","Gonzalez",
    "Mendoza","Rivera","Aquino","Villanueva","Fernandez","Aguilar","Soriano","Bautista",
    "Dela Cruz","Castillo","Estrada","Navarro","Pascual","Delos Santos","Espinosa",
    "Ocampo","Salazar","Dizon","Manalo","Alcantara","Mercado","Tuazon","Constantino",
    "Sandoval","Villafuerte","Andrade","Padilla","Pangilinan","Sarmiento","Tolentino",
    "Buenaventura","Maglasang","Tagle","Quizon","Capulong","Macaraeg","Cunanan",
    "Poblete","Lim","Tan","Uy","Co","Sy","Go","Chan","Chua","Wong",
    "Magpayo","Macapagal","Bernardo","Concepcion","Velasco","Santiago","De Leon",
    "Guerrero","Domingo","Trinidad","Vidal","Evangelista","Suarez","Herrera",
    "Medina","Molina","Dela Torre","Miranda","Abad","Roman","Baclig","Baluyot",
    "Caballero","Cabrera","Dela Pena","Delgado","Diaz","Esguerra","Felipe",
    "Francisco","Guzman","Hernandez","Jimenez","Luna","Maceda","Madriaga",
    "Magsaysay","Mapua","Marquez","Martinez","Morales","Muñoz","Oliva",
    "Paredes","Perez","Ponce","Recto","Regala","Reyes","Rico","Rodriguez",
    "Romero","Roxas","Ruiz","Serrano","Sierra","Silva","Silvestre","Simon",
    // Muslim / Maranao / Tausug / Maguindanao surnames
    "Datu","Maulana","Abubakar","Hadji","Dimaporo","Sali","Macabago","Alonto",
    "Tomawis","Basman","Pangandaman","Mindalano","Lumabao","Cosain","Guro",
    "Baraguir","Mapupuno","Gandamra","Disomimba","Salic","Anggi","Macmod",
    "Mama","Musa","Omar","Ibrahim","Kakar","Maguid","Piang","Mastura",
    "Midtimbang","Bangcola","Macapaar","Linog","Timbangan","Matanog","Guiani",
    "Sinolinding","Sarip","Sumagayan","Dagarag","Macabalang","Casan","Alauya",
    "Datomanong","Utto","Sulaiman","Balindong","Maruhom","Macarambon","Lucman",
    "Pundato","Macintud","Nawal","Balt","Datudacula","Ampuan","Macalag",
    "Usman","Sinsuat","Udtog","Mangelen","Sali","Palawan","Bansil","Bantuas",
    "Macabanding","Camlian","Dilangalen","Gandamra","Guiamalon","Kudarat",
    "Limbona","Macacua","Macapodi","Macasarte","Macaumbak","Madid","Maguindra",
    "Maharaja","Mangondato","Mantawil","Masacal","Mascud","Matalam","Mindato",
    "Mindalano","Mohamad","Muarip","Mukaram","Mulok","Muslimin","Mutilan",
    "Nalandangan","Nasser","Pacasum","Pandi","Pendatun","Piandao","Picao",
    "Pilimpinas","Poling","Polok","Sabal","Sabdula","Saipudin","Sampaco",
    "Sandigan","Sarip","Sinagka","Sinolinding","Solaiman","Sultan","Tangcal",
    "Tartong","Ticao","Timotan","Tupay","Usman","Utara","Waimar","Yusoph",
  ];

  const FIRST_NAMES_M = [
    // Christian / Tagalog Filipino male
    "Jose","Juan","Carlo","Miguel","Angelo","Rafael","Christian","Mark","Joshua","Kevin",
    "Michael","John","Luis","Gabriel","Ivan","Aaron","Elijah","Nathan","Daniel","Isaac",
    "Leo","Felix","Adrian","Patrick","Jerome","Anthony","Francis","Joseph","Vincent","Allan",
    "Raymond","Rodel","Ronaldo","Ricky","Rommel","Rodolfo","Rico","Roberto","Ramon","Renato",
    "Aldrin","Alvin","Alex","Arnold","Arnel","Arvin","Arjay","Arden","Ardie","Armand",
    "Benny","Bernard","Bryan","Brian","Bruno","Carl","Carlos","Chester","Cris","Danilo",
    "Darwin","Dave","Dennis","Derrick","Donald","Donnie","Edgardo","Eduardo","Edwin","Efren",
    "Emmanuel","Eric","Ernest","Eugene","Evan","Ferdinand","Fortunato","Francis","Frank",
    "Fred","Gelo","George","Gerald","Gerry","Glen","Gregorio","Harold","Hector","Henry",
    "Herbert","Hernando","Homer","Ignacio","Isagani","Isidro","Jame","Jason","Jay","Jayvee",
    "Jeff","Jeffrey","Jennel","Jeric","Jerome","Jerry","Jesse","Jessie","Jimmy","Joel",
    "Joey","Johnny","Jonathan","Jonrel","Jordan","Jorge","Joselito","Jovito","Juanito",
    "Juancho","Jun","Junior","Justin","Karl","Kenneth","Kent","Kevin","Kim","Kyle",
    "Lance","Lawrence","Lem","Leon","Leopoldo","Lester","Loreto","Louis","Lowie","Lyle",
    "Marc","Marco","Mario","Marlon","Marvin","Matt","Maurice","Maximo","Melvin","Mico",
    "Nelson","Nick","Nico","Niño","Noel","Noli","Norman","Oliver","Orlando","Oscar",
    "Ozzy","Paolo","Pedro","Philip","Prince","Ralph","Randy","Raul","Rex","Rey","Rhenz",
    "Ricardo","Ritch","Rob","Robin","Rocky","Roger","Roland","Rolando","Ronald","Ronel",
    "Ronnie","Ronron","Roque","Ross","Roy","Rudy","Ryan","Sam","Sandy","Santiago",
    "Segundo","Sherwin","Siegfried","Silvano","Simon","Sonny","Stefan","Stephen","Steve",
    "Teodoro","Tomas","Tommy","Tony","Ulysses","Vans","Vicente","Victor","Vince","Virgilio",
    "Waldo","Wendell","Wesley","Wilfredo","William","Wilson","Winston","Xander","Xymon",
    // Muslim Filipino male
    "Jamal","Khalid","Rashid","Tariq","Yusuf","Ahmad","Ali","Hassan","Hussein","Omar",
    "Ismail","Ibrahim","Idris","Ramil","Saifullah","Abdulhamid","Nordin","Fahad","Anwar","Zaid",
    "Abdul","Abdullah","Abdurahman","Abubakar","Adel","Aiman","Aladin","Alawi","Aleem",
    "Alfahad","Alhaj","Alhan","Alhasan","Alhussein","Alimudin","Alinor","Alioden","Aliyudin",
    "Aljun","Alkausar","Almohammad","Alnorain","Alqasim","Alsaudi","Alsulthan","Altaher",
    "Alwaleed","Amiruddin","Amjad","Amr","Anas","Ansar","Ansari","Arief","Arif","Ariz",
    "Asadullah","Ashraf","Asif","Ayoub","Azeez","Aziz","Azri","Azzam","Badar","Badrul",
    "Bahauddin","Bakr","Bashir","Bilal","Burhan","Daud","Faisal","Farid","Faruk","Fattah",
    "Fazal","Firdaus","Fuad","Ghani","Ghazali","Hamdan","Hamid","Hamzah","Haris","Harith",
    "Hasan","Hashim","Hazim","Helmi","Hilal","Hilmi","Hisham","Hudaifa","Huzaifa","Ilyas",
    "Imran","Iqbal","Irfan","Isa","Iskandar","Jafar","Jalal","Jalil","Jamil","Jasim",
    "Jibril","Khairy","Khairul","Khairi","Khalil","Khidr","Luqman","Mahdi","Mahfuz","Mahmud",
    "Majid","Malik","Mansur","Marwan","Masum","Minhaj","Mohamad","Mohd","Mubarak","Mubin",
    "Muhamad","Muhammad","Mukhlis","Muktadir","Munir","Murad","Murtaza","Musab","Muslim",
    "Mustofa","Muzammil","Nabil","Nader","Nadzmi","Naim","Nasiruddin","Nasser","Nawawi",
    "Nazim","Nazri","Nizar","Noraiman","Nordin","Norzaidi","Nuh","Nur","Nureddin","Nurhafiz",
  ];

  const FIRST_NAMES_F = [
    // Christian / Tagalog Filipino female
    "Maria","Ana","Rosa","Elena","Luz","Carmen","Cristina","Patricia","Maricel","Marites",
    "Rowena","Rosemarie","Rosalinda","Rosalyn","Rosanna","Rose","Jennifer","Jessica",
    "Michelle","Melissa","Sarah","Hannah","Rachel","Rebecca","Sophia","Isabella",
    "Abby","Abigail","Agnes","Aileen","Aida","Aiza","Alice","Alicia","Alisa","Aliyah",
    "Alma","Almira","Aloha","Amalia","Amanda","Amelie","Amie","Amy","Andrea","Angela",
    "Angeline","Angelique","Angelita","Angie","Anita","Anne","Annette","Ariane","Ariel",
    "Arielle","Arlyn","Armina","Arnelyn","Arnie","Arnielyn","Arnis","Arnisa","Arynne",
    "Ashley","Ate","Aubrey","Audrey","Aurora","Autumn","Ava","Avery","Bea","Beatrice",
    "Bella","Beth","Bianca","Blessy","Blessie","Bridget","Briona","Brix","Callie",
    "Camille","Carla","Carissa","Carmela","Carina","Cara","Carol","Carolina","Caroline",
    "Carrie","Cassandra","Catherine","Cecilia","Celine","Charmaine","Chloe","Christel",
    "Christine","Christy","Ciara","Clara","Clarise","Clarissa","Claryssa","Claytie",
    "Cynthia","Danna","Dawn","Dayna","Deanna","Denise","Diane","Dina","Dione",
    "Dolores","Donna","Dyan","Eden","Edna","Eileen","Elaine","Eleanor","Elisa","Elise",
    "Elizabeth","Ella","Ellen","Elsa","Elva","Emily","Emma","Erica","Erin","Estela",
    "Estelle","Esther","Eva","Eve","Fatima","Felicia","Fiona","Frances","Franchesca",
    "Francine","Freya","Gabrielle","Gail","Gemma","Georgina","Gladys","Glenda","Gloria",
    "Grace","Gracie","Guinevere","Hana","Hannah","Hazel","Heather","Helen","Hope",
    "Ines","Ingrid","Irene","Iris","Isabel","Isabella","Isabelle","Ivy","Jackie","Jacqui",
    "Jade","Jaine","Jamie","Jan","Jane","Janelle","Janet","Janice","Janine","Jasmin",
    "Jasmine","Jayne","Jean","Jeanette","Jeanie","Jemimah","Jenna","Jennie","Jenny",
    "Jessica","Jessa","Jhona","Jhonilyn","Joan","Joana","Joanna","Jocelyn","Joie","Joy",
    "Joyce","Juanita","Judith","Julia","Julie","Juliet","June","Karen","Karissa","Kate",
    "Katelyn","Katherine","Kathleen","Kathryn","Kathy","Kayla","Kezzia","Kim","Kimberley",
    "Kristina","Kristine","Kylie","Laura","Lauren","Layla","Lea","Leah","Leia","Lena",
    "Leonora","Leticia","Lexy","Liezel","Lila","Linda","Lisa","Liza","Lorie","Lorraine",
    "Louise","Luisa","Lydia","Lyka","Lynda","Lyra","Maegan","Magdalena","Maggie","Maia",
    "Maila","Maira","Maisie","Mara","Margret","Maria","Mariane","Maricel","Mariel",
    "Marife","Marika","Marilyn","Marina","Marjorie","Marlen","Marlene","Marlyn","Marni",
    "Maru","Mary","Maya","Mel","Melanie","Melinda","Mercedes","Mhea","Mia","Michelle",
    "Mika","Mikhaela","Mildred","Milla","Mindy","Mira","Miranda","Miriam","Monika",
    "Monique","Nadine","Nathalie","Nica","Nicole","Nina","Noel","Norma","Olivia","Pamela",
    "Patricia","Pauline","Penny","Pinky","Precious","Princess","Priscilla","Rachel",
    "Raquel","Reah","Regina","Rhea","Rhona","Rina","Rita","Rochelle","Roldan","Rowena",
    "Roxanne","Ruby","Ruth","Sabrina","Samantha","Sandra","Sara","Selene","Serena",
    "Sharon","Sheila","Shirley","Stella","Stephanie","Sue","Susan","Susana","Suzanne",
    "Theresa","Tina","Trixie","Vanessa","Veronica","Victoria","Vivian","Wendy","Yasmin",
    "Yvette","Yvonne","Zara","Zoe","Zoey",
    // Muslim Filipino female
    "Fatima","Aisha","Zainab","Maryam","Khadija","Amira","Nadia","Layla","Salma","Hana",
    "Norhanifa","Norhanisa","Norhanida","Norhayati","Norhaizura","Norhafizah",
    "Aisyah","Aliah","Aminah","Amira","Amna","Anisa","Anisah","Arifah","Asma","Azizah",
    "Azreen","Basmah","Bushra","Dina","Farida","Farihah","Faten","Fatimah","Fatin",
    "Fauziah","Hana","Hanim","Hanisah","Hawa","Hayati","Haznah","Humaira","Husna",
    "Iman","Insyirah","Izzah","Jameela","Jamila","Kauthar","Khairiah","Khairunnisa",
    "Khadijah","Khaulah","Latifah","Lina","Lubna","Maisara","Maizura","Mariam",
    "Maryam","Mastura","Mazlinda","Munira","Murni","Nabila","Nadhira","Nadirah",
    "Naimah","Nana","Nashwa","Nasihah","Nasirah","Norfaizah","Norhafiza","Norhaida",
    "Norhaniza","Norhasyimah","Norhayati","Norlaila","Normah","Norshahida","Norzila",
    "Nur","Nura","Nuraini","Nuraishah","Nurashikin","Nurfazira","Nurhaiza","Nurhana",
    "Nurhayati","Nurhidayah","Nurliyana","Nurmalina","Nurseha","Nursyafiqah","Nursyahira",
    "Nurul","Nurulain","Nurulhuda","Nurzahira","Putri","Rabiatul","Rahimah","Raihanah",
    "Ramlah","Raudah","Rawdah","Rohani","Roshana","Ruhaida","Ruqaiyyah","Sabrina",
    "Saidah","Sakina","Sakinah","Salwa","Sariyana","Sazlin","Shahirah","Shahira",
    "Shazlin","Shazwani","Siti","Sofea","Sofiah","Suraya","Syafika","Syafinaz",
    "Syafiqah","Syahirah","Syamimi","Syarafina","Syaza","Syazana","Ummu","Uswah",
    "Wardah","Widad","Yasmin","Yusra","Zainab","Zakiah","Zaleha","Zalina","Zara",
    "Zarith","Zatie","Zawiah","Zubaidah","Zulaika","Zulaikha","Zulfa","Zulfah",
  ];

  const MIDDLE_INITIALS = "ABCDEFGHIJLMNOPRSTV".split("");

  /* ─── Helpers ─────────────────────────────────────────────────── */
  function seededRng(seed) {
    let s = (seed * 1664525 + 1013904223) & 0xffffffff;
    return function () {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 4294967295;
    };
  }

  function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, Math.round(v))); }

  function normalSample(rng, mean, sd) {
    const u1 = rng() || 1e-9, u2 = rng();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * sd;
  }

  function calcOAPR(ep, rc, sps, qs, ats) {
    return clamp(ep * 0.20 + rc * 0.20 + sps * 0.20 + qs * 0.25 + ats * 0.15, 1, 99);
  }

  /* ─── Generate 500 records ────────────────────────────────────── */
  const TOTAL = 500;
  const db = {};

  // Realistic distribution: ~40% high scorers, ~40% mid, ~20% low
  // Simulates a competitive admission pool
  function scoreProfile(rng) {
    const tier = rng();
    if (tier < 0.20) return { mean: 75, sd: 8 };   // top tier
    if (tier < 0.45) return { mean: 62, sd: 9 };   // above average
    if (tier < 0.75) return { mean: 48, sd: 10 };  // average
    return { mean: 32, sd: 9 };                    // below average
  }

  for (let i = 1; i <= TOTAL; i++) {
    const rng = seededRng(i * 179 + 37);

    const appNo  = "2526-" + String(i).padStart(5, "0");
    const isMale = rng() > 0.48;
    const surname    = pick(SURNAMES, rng);
    const firstName  = pick(isMale ? FIRST_NAMES_M : FIRST_NAMES_F, rng);
    const mi         = pick(MIDDLE_INITIALS, rng);
    const type       = rng() < 0.82 ? "freshman" : "transferee";

    const profile = scoreProfile(rng);
    const ep  = clamp(normalSample(rng, profile.mean, profile.sd), 1, 99);
    const rc  = clamp(normalSample(rng, profile.mean - 2, profile.sd), 1, 99);
    const sps = clamp(normalSample(rng, profile.mean + 1, profile.sd), 1, 99);
    const qs  = clamp(normalSample(rng, profile.mean - 3, profile.sd + 2), 1, 99);
    const ats = clamp(normalSample(rng, profile.mean + 2, profile.sd - 1), 1, 99);
    const oapr = calcOAPR(ep, rc, sps, qs, ats);

    // NAT / EAT scores (generated but only relevant for specific courses)
    // Ranges: NAT 200-400, EAT 200-400
    const natScore = clamp(normalSample(rng, 280 + (oapr - 50) * 1.5, 30), 200, 400);
    const eatScore = clamp(normalSample(rng, 270 + (qs - 50) * 1.8, 35), 200, 400);

    db[appNo] = {
      appNo,
      surname,
      firstname: firstName,
      middleinitial: mi,
      name: `${surname}, ${firstName} ${mi}.`,
      type,
      cet: { ep, rc, sps, qs, ats, oapr },
      natScore,   // Nursing Aptitude Test score
      eatScore,   // Engineering Aptitude Test score
    };
  }

  /* ─── Expose globally ─────────────────────────────────────────── */
  window.WMSU_CET_DB = db;

  window.WMSU_lookupApplicant = function (appNo) {
    const k = (appNo || "").trim().toUpperCase();
    return window.WMSU_CET_DB[k] || window.WMSU_CET_DB[(appNo || "").trim()] || null;
  };

  /**
   * Return all 500 records as an array (sorted by appNo)
   */
  window.WMSU_getAllApplicants = function () {
    return Object.values(window.WMSU_CET_DB).sort((a, b) =>
      a.appNo.localeCompare(b.appNo)
    );
  };

})();