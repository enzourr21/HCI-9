/**
 * WMSU-Ease CET Database  –  A.Y. 2025-2026
 * 1000 applicant records  |  App Nos: 2526-00001 → 2526-01000
 *
 * CET Sub-scores (Percentile Rank 1–99):
 *   EP  = English Proficiency
 *   RC  = Reading Comprehension
 *   SPS = Science Process Skills
 *   QS  = Quantitative Skills
 *   ATS = Abstract Thinking Skills
 *   OAPR = Overall Ability Percentile Rank
 *
 * type: 'freshman' | 'transferee'
 */

(function () {

  /* ─── Real Filipino surname pool ─────────────────────────────── */
  const SURNAMES = [
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
    "Paredes","Perez","Ponce","Recto","Regala","Rico","Rodriguez",
    "Romero","Roxas","Ruiz","Serrano","Sierra","Silva","Silvestre","Simon",
    "Datu","Maulana","Abubakar","Hadji","Dimaporo","Sali","Macabago","Alonto",
    "Tomawis","Basman","Pangandaman","Mindalano","Lumabao","Cosain","Guro",
    "Baraguir","Mapupuno","Gandamra","Disomimba","Salic","Anggi","Macmod",
    "Mama","Musa","Omar","Ibrahim","Kakar","Maguid","Piang","Mastura",
    "Midtimbang","Bangcola","Macapaar","Linog","Timbangan","Matanog","Guiani",
    "Sinolinding","Sarip","Sumagayan","Dagarag","Macabalang","Casan","Alauya",
    "Datomanong","Utto","Sulaiman","Balindong","Maruhom","Macarambon","Lucman",
    "Pundato","Macintud","Nawal","Balt","Datudacula","Ampuan","Macalag",
    "Usman","Sinsuat","Udtog","Mangelen","Palawan","Bansil","Bantuas",
    "Macabanding","Camlian","Dilangalen","Guiamalon","Kudarat",
    "Limbona","Macacua","Macapodi","Macasarte","Macaumbak","Madid","Maguindra",
    "Maharaja","Mangondato","Mantawil","Masacal","Mascud","Matalam","Mindato",
    "Mohamad","Muarip","Mukaram","Mulok","Muslimin","Mutilan",
    "Nalandangan","Nasser","Pacasum","Pandi","Pendatun","Piandao","Picao",
    "Poling","Polok","Sabal","Sabdula","Saipudin","Sampaco",
    "Sandigan","Sinagka","Solaiman","Sultan","Tangcal",
    "Tartong","Ticao","Timotan","Tupay","Utara","Waimar","Yusoph",
    "Abella","Ablan","Ablaza","Abrenica","Abrera","Acosta","Adamos","Advincula",
    "Agoncillo","Agsalud","Aguinaldo","Alejandro","Alejo","Almeida","Almodovar",
    "Almonte","Alquiza","Altamirano","Alvarado","Alvarez","Ambrosio","Amores",
    "Anarna","Andal","Angeles","Angulo","Annang","Antonio","Apilado","Apostol",
    "Aquiatan","Aragon","Arcega","Arceo","Arcilla","Arellano","Arenas","Arevalo",
    "Arguelles","Ariola","Arizala","Armas","Arnaldo","Arroyo","Arroyos","Artates",
    "Asas","Asuncion","Austria","Avena","Avila","Ayap","Ayson","Azarcon","Azores",
    "Bacani","Bacarro","Bacasmas","Bacay","Baclayon","Baclig","Bagadiong","Bagano",
    "Bagay","Bagtas","Balaga","Balangue","Balbastro","Balde","Balderas","Ballesta",
    "Balmeo","Balmonte","Balolong","Balones","Balon","Balquin","Baltar","Baluyut",
    "Bancoro","Bandala","Bangate","Banguis","Bantegui","Banusing","Banzuela","Baraceros",
  ];

  const FIRST_NAMES_M = [
    "Jose","Juan","Carlo","Miguel","Angelo","Rafael","Christian","Mark","Joshua","Kevin",
    "Michael","John","Luis","Gabriel","Ivan","Aaron","Elijah","Nathan","Daniel","Isaac",
    "Leo","Felix","Adrian","Patrick","Jerome","Anthony","Francis","Joseph","Vincent","Allan",
    "Raymond","Rodel","Ronaldo","Ricky","Rommel","Rodolfo","Rico","Roberto","Ramon","Renato",
    "Aldrin","Alvin","Alex","Arnold","Arnel","Arvin","Arjay","Arden","Armand",
    "Benny","Bernard","Bryan","Brian","Bruno","Carl","Carlos","Chester","Cris","Danilo",
    "Darwin","Dave","Dennis","Derrick","Donald","Donnie","Edgardo","Eduardo","Edwin","Efren",
    "Emmanuel","Eric","Ernest","Eugene","Evan","Ferdinand","Francis","Frank",
    "Fred","Gelo","George","Gerald","Gerry","Glen","Gregorio","Harold","Hector","Henry",
    "Herbert","Homer","Ignacio","Isagani","Isidro","Jason","Jay","Jayvee",
    "Jeff","Jeffrey","Jeric","Jerome","Jerry","Jesse","Jessie","Jimmy","Joel",
    "Joey","Johnny","Jonathan","Jordan","Jorge","Joselito","Jovito","Juanito",
    "Juancho","Jun","Junior","Justin","Karl","Kenneth","Kent","Kim","Kyle",
    "Lance","Lawrence","Lem","Leon","Leopoldo","Lester","Loreto","Louis","Lyle",
    "Marc","Marco","Mario","Marlon","Marvin","Matt","Maximo","Melvin","Mico",
    "Nelson","Nick","Nico","Niño","Noel","Noli","Norman","Oliver","Orlando","Oscar",
    "Paolo","Pedro","Philip","Prince","Ralph","Randy","Raul","Rex","Rey","Rhenz",
    "Ricardo","Rob","Robin","Rocky","Roger","Roland","Rolando","Ronald","Ronel",
    "Ronnie","Roque","Ross","Roy","Rudy","Ryan","Sam","Sandy","Santiago",
    "Segundo","Sherwin","Siegfried","Simon","Sonny","Stefan","Stephen","Steve",
    "Teodoro","Tomas","Tommy","Tony","Ulysses","Vicente","Victor","Vince","Virgilio",
    "Waldo","Wendell","Wesley","Wilfredo","William","Wilson","Winston","Xander",
    "Jamal","Khalid","Rashid","Tariq","Yusuf","Ahmad","Ali","Hassan","Hussein","Omar",
    "Ismail","Ibrahim","Idris","Ramil","Saifullah","Abdulhamid","Nordin","Fahad","Anwar","Zaid",
    "Abdul","Abdullah","Abdurahman","Abubakar","Adel","Aiman","Aladin","Alawi","Aleem",
    "Alimudin","Aljun","Amiruddin","Amjad","Amr","Anas","Ansar","Arief","Arif",
    "Asadullah","Ashraf","Asif","Ayoub","Aziz","Badar","Badrul",
    "Bahauddin","Bakr","Bashir","Bilal","Burhan","Daud","Faisal","Farid","Faruk",
    "Fazal","Firdaus","Fuad","Ghani","Hamdan","Hamid","Hamzah","Haris","Harith",
    "Hasan","Hashim","Hazim","Hilal","Hisham","Ilyas",
    "Imran","Iqbal","Irfan","Isa","Iskandar","Jafar","Jalal","Jalil","Jamil","Jasim",
    "Jibril","Khairy","Khairul","Khalil","Luqman","Mahdi","Mahmud",
    "Majid","Malik","Mansur","Marwan","Minhaj","Mohamad","Mubarak",
    "Muhammad","Mukhlis","Munir","Murad","Murtaza","Musab","Muslim",
    "Nabil","Nader","Naim","Nasiruddin","Nasser","Nizar","Nordin","Nuh","Nurhafiz",
    "Radzif","Rafiuddin","Rahmatullah","Ridhwan","Ridwan","Riffat","Riyad","Rizal",
    "Rusdan","Sabri","Safwan","Sahril","Saiful","Salahuddin","Salim","Salman",
    "Samir","Samsul","Sanusi","Sarhan","Shafiq","Shahril","Shaiful","Shamir",
    "Shamsudin","Shamsul","Sharif","Shukri","Sidiq","Sufian","Sulhan","Syed",
    "Taufiq","Taufikurrahman","Umar","Usamah","Usep","Uwais","Uzair","Wahid",
    "Walid","Wazir","Yasin","Yazid","Yusri","Zafrullah","Zahid","Zainal","Zubair",
  ];

  const FIRST_NAMES_F = [
    "Maria","Ana","Rosa","Elena","Luz","Carmen","Cristina","Patricia","Maricel","Marites",
    "Rowena","Rosemarie","Rosalinda","Rosalyn","Rosanna","Rose","Jennifer","Jessica",
    "Michelle","Melissa","Sarah","Hannah","Rachel","Rebecca","Sophia","Isabella",
    "Abby","Abigail","Agnes","Aileen","Aida","Aiza","Alice","Alicia","Alisa","Aliyah",
    "Alma","Almira","Amalia","Amanda","Amelie","Amie","Amy","Andrea","Angela",
    "Angeline","Angelique","Angelita","Angie","Anita","Anne","Annette","Ariane","Ariel",
    "Arlyn","Arnelyn","Ashley","Aubrey","Audrey","Aurora","Ava","Avery","Bea","Beatrice",
    "Bella","Beth","Bianca","Blessy","Blessie","Bridget","Callie",
    "Camille","Carla","Carissa","Carmela","Carina","Cara","Carol","Carolina","Caroline",
    "Carrie","Cassandra","Catherine","Cecilia","Celine","Charmaine","Chloe","Christel",
    "Christine","Christy","Ciara","Clara","Clarise","Clarissa",
    "Cynthia","Danna","Dawn","Deanna","Denise","Diane","Dina",
    "Dolores","Donna","Dyan","Eden","Edna","Eileen","Elaine","Eleanor","Elisa","Elise",
    "Elizabeth","Ella","Ellen","Elsa","Emily","Emma","Erica","Erin","Estela",
    "Esther","Eva","Eve","Felicia","Fiona","Frances","Franchesca",
    "Francine","Freya","Gabrielle","Gail","Gemma","Gladys","Glenda","Gloria",
    "Grace","Gracie","Hannah","Hazel","Heather","Helen","Hope",
    "Ines","Irene","Iris","Isabel","Isabella","Isabelle","Ivy","Jackie",
    "Jade","Jamie","Jane","Janelle","Janet","Janice","Janine","Jasmin",
    "Jasmine","Jean","Jeanette","Jemimah","Jenna","Jennie","Jenny",
    "Jessica","Jessa","Joan","Joana","Joanna","Jocelyn","Joy",
    "Joyce","Juanita","Judith","Julia","Julie","Juliet","Karen","Kate",
    "Katelyn","Katherine","Kathleen","Kathryn","Kathy","Kayla","Kim","Kimberley",
    "Kristina","Kristine","Kylie","Laura","Lauren","Layla","Lea","Leah","Lena",
    "Leonora","Leticia","Liezel","Lila","Linda","Lisa","Liza","Lorie","Lorraine",
    "Louise","Luisa","Lydia","Lyka","Lynda","Lyra","Magdalena","Maggie","Maia",
    "Maila","Maira","Mara","Maria","Mariane","Maricel","Mariel",
    "Marife","Marika","Marilyn","Marina","Marjorie","Marlene","Marlyn",
    "Mary","Maya","Melanie","Melinda","Mercedes","Mia","Michelle",
    "Mika","Mikhaela","Mildred","Miranda","Miriam","Monika",
    "Monique","Nadine","Nathalie","Nica","Nicole","Nina","Norma","Olivia","Pamela",
    "Patricia","Pauline","Penny","Pinky","Precious","Princess","Priscilla","Rachel",
    "Raquel","Reah","Regina","Rhea","Rhona","Rina","Rita","Rochelle","Rowena",
    "Roxanne","Ruby","Ruth","Sabrina","Samantha","Sandra","Sara","Serena",
    "Sharon","Sheila","Shirley","Stella","Stephanie","Sue","Susan","Susana",
    "Theresa","Tina","Trixie","Vanessa","Veronica","Victoria","Vivian","Wendy","Yasmin",
    "Yvette","Yvonne","Zara","Zoe","Zoey",
    "Fatima","Aisha","Zainab","Maryam","Khadija","Amira","Nadia","Layla","Salma","Hana",
    "Norhanifa","Norhanisa","Norhanida","Norhayati",
    "Aisyah","Aliah","Aminah","Anisa","Anisah","Arifah","Asma","Azizah",
    "Basmah","Bushra","Dina","Farida","Farihah","Faten","Fatimah","Fatin",
    "Fauziah","Hanim","Hanisah","Hawa","Hayati","Humaira","Husna",
    "Iman","Insyirah","Izzah","Jameela","Jamila","Kauthar","Khairiah","Khairunnisa",
    "Khadijah","Latifah","Lina","Lubna","Maisara","Mariam",
    "Maryam","Mastura","Munira","Nabila","Nadhira","Nadirah",
    "Naimah","Nashwa","Nasihah","Norfaizah","Norhafiza","Norhaida",
    "Norhasyimah","Norlaila","Normah","Norshahida",
    "Nur","Nura","Nuraini","Nuraishah","Nurashikin","Nurfazira","Nurhaiza","Nurhana",
    "Nurhayati","Nurhidayah","Nurliyana","Nurmalina","Nurseha","Nursyafiqah","Nursyahira",
    "Nurul","Nurulain","Nurulhuda","Putri","Rabiatul","Rahimah","Raihanah",
    "Ramlah","Raudah","Rohani","Roshana","Ruhaida","Ruqaiyyah","Sabrina",
    "Saidah","Sakina","Sakinah","Salwa","Shahirah","Shahira",
    "Siti","Sofea","Sofiah","Suraya","Syafika","Syafinaz",
    "Syafiqah","Syahirah","Syamimi","Ummu","Uswah",
    "Wardah","Widad","Yusra","Zainab","Zakiah","Zaleha","Zalina",
    "Zarith","Zawiah","Zubaidah","Zulaika","Zulaikha","Zulfah",
    "Adoracion","Alfonsa","Alizon","Almira","Alona","Alovera","Alsie","Alvie",
    "Amparito","Amparo","Anabelle","Analiza","Analyn","Anarose","Ancel","Ancheta",
    "Andresa","Andreya","Andria","Andriea","Andriela","Andriella","Andrielle",
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

  /* ─── Generate 1000 records ───────────────────────────────────── */
  const TOTAL = 1000;
  const db = {};

  function scoreProfile(rng) {
    const tier = rng();
    if (tier < 0.20) return { mean: 75, sd: 8 };
    if (tier < 0.45) return { mean: 62, sd: 9 };
    if (tier < 0.75) return { mean: 48, sd: 10 };
    return { mean: 32, sd: 9 };
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
      natScore,
      eatScore,
    };
  }

  /* ─── Expose globally ─────────────────────────────────────────── */
  window.WMSU_CET_DB = db;

  window.WMSU_lookupApplicant = function (appNo) {
    const k = (appNo || "").trim().toUpperCase();
    return window.WMSU_CET_DB[k] || window.WMSU_CET_DB[(appNo || "").trim()] || null;
  };

  window.WMSU_getAllApplicants = function () {
    return Object.values(window.WMSU_CET_DB).sort((a, b) =>
      a.appNo.localeCompare(b.appNo)
    );
  };

})();