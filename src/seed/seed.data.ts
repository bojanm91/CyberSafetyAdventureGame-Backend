export const DISCIPLINES_DATA = [
  {
    name: "Password Base",
    slug: "password-base",
    description: "Nauči kako da kreiraš jake lozinke, koristiš password manager i uključiš 2FA.",
    icon: "⌘",
    colorClass: "from-cyan/20 to-cyan/5 border-cyan/25",
    order: 1,
  },
  {
    name: "Phishing Harbor",
    slug: "phishing-harbor",
    description: "Prepoznaj phishing emailove, lažne login stranice i sumnjive linkove.",
    icon: "✉",
    colorClass: "from-violet/20 to-violet/5 border-violet/25",
    order: 2,
  },
  {
    name: "Privacy Zone",
    slug: "privacy-zone",
    description: "Zaštiti privatnost na društvenim mrežama i kontroliši šta dijeliš.",
    icon: "◉",
    colorClass: "from-green/20 to-green/5 border-green/25",
    order: 3,
  },
  {
    name: "Malware Lab",
    slug: "malware-lab",
    description: "Prepoznaj sumnjive priloge, USB uređaje i lažne aplikacije.",
    icon: "⚠",
    colorClass: "from-rose/20 to-rose/5 border-rose/25",
    order: 4,
  },
  {
    name: "Social Engineering Street",
    slug: "social-engineering",
    description: "Prepoznaj manipulaciju, lažne pozive i psihološke prevare.",
    icon: "⌬",
    colorClass: "from-amber/20 to-amber/5 border-amber/25",
    order: 5,
  },
  {
    name: "Final Cyber Challenge",
    slug: "final-challenge",
    description: "Kombinovani scenariji koji povezuju sve naučene oblasti.",
    icon: "▣",
    colorClass: "from-fuchsia/20 to-fuchsia/5 border-fuchsia/25",
    order: 6,
  },
];

export const QUESTS_DATA = [
  // ─── PASSWORD BASE ───────────────────────────────────────────────────────────
  {
    disciplineSlug: "password-base",
    title: "Koja lozinka je najsigurnija?",
    difficulty: "easy" as const,
    basePoints: 50,
    questType: "multiple_choice" as const,
    orderInDiscipline: 1,
    scenario:
      "Korisnik kreira nalog za novi online servis koji čuva važne finansijske dokumente. Servis traži da postavi sigurnu lozinku. U ponudi je pet opcija lozinki.",
    taskText: "Izaberi najbezbjedniju lozinku.",
    hintText:
      "Dužina lozinke je često važnija od nasumičnog dodavanja jednog simbola.",
    feedbackCorrect:
      "Dobra lozinka treba da bude duga, jedinstvena i teško pogodiva. Fraze koje kombinuju više nepovezanih riječi sa brojevima i simbolima su gotovo nemoguće za pogoditi, čak i pri brutalnom napadu. Izbjegavaj imena, gradove, godine i česte šablone poput 'P@ssword!'.",
    miniConclusion:
      "Duga passphrase sa kombinacijom nepovezanih riječi, brojeva i simbola je uvijek jača od kratke 'kompleksne' lozinke.",
    options: [
      { text: "marko123", isCorrect: false, explanation: "Ime i broj su jedna od prvih kombinacija koje napadači pokušavaju.", order: 1 },
      { text: "Podgorica2024", isCorrect: false, explanation: "Grad i godina su predvidivi i lako se pogađaju.", order: 2 },
      { text: "P@ssword!", isCorrect: false, explanation: "Ovaj šablon je toliko čest da je uključen u sve liste za napad.", order: 3 },
      { text: "Rijeka-Kamen-73!Plava", isCorrect: true, explanation: "Duga, nepovezana fraza sa simbolima i brojevima - idealna lozinka.", order: 4 },
      { text: "123456789", isCorrect: false, explanation: "Najčešće korišćena lozinka na svijetu - prva na listi svakog napadača.", order: 5 },
    ],
  },
  {
    disciplineSlug: "password-base",
    title: "Podešavanje dvofaktorske autentifikacije",
    difficulty: "easy" as const,
    basePoints: 50,
    questType: "multiple_choice" as const,
    orderInDiscipline: 2,
    scenario:
      "Aplikacija za email nudi korisničku opciju uključivanja dvofaktorske autentifikacije (2FA) kako bi dodatno zaštitio nalog. Korisnik razmišlja šta je pametno uraditi.",
    taskText: "Koji izbor je najbezbjedniji za zaštitu naloga?",
    hintText: "Ako neko sazna lozinku, šta ga još može zaustaviti?",
    feedbackCorrect:
      "Dvofaktorska autentifikacija dodaje drugi sloj zaštite. Čak i ako napadač nekako dođe do lozinke, bez fizičkog pristupa tvom uređaju ne može pristupiti nalogu. Autentifikator aplikacije (poput Google ili Microsoft Authenticator) su sigurnije od SMS kodova.",
    miniConclusion:
      "2FA je jedna od najvažnijih mjera zaštite - uvijek je uključi gdje god je dostupna.",
    options: [
      { text: "Ostaviti samo lozinku jer je lakše zapamtiti", isCorrect: false, explanation: "Lozinka sama po sebi nije dovoljna zaštita - može biti ukradena ili pogođena.", order: 1 },
      { text: "Uključiti 2FA preko autentifikator aplikacije", isCorrect: true, explanation: "Autentifikator aplikacija je najsigurniji oblik 2FA - generiše jednokratne kodove bez interneta.", order: 2 },
      { text: "Koristiti istu lozinku na svim nalozima jer je lako zapamtiti", isCorrect: false, explanation: "Ako jedan nalog bude kompromitovan, svi ostali su odmah u opasnosti.", order: 3 },
      { text: "Poslati 2FA kod prijatelju ako zatreba pomoć", isCorrect: false, explanation: "Nikad ne dijeli 2FA kodove - smisao im je da samo ti imaš pristup.", order: 4 },
    ],
  },

  // ─── PHISHING HARBOR ────────────────────────────────────────────────────────
  {
    disciplineSlug: "phishing-harbor",
    title: "Sumnjivi email od banke",
    difficulty: "medium" as const,
    basePoints: 70,
    questType: "decision" as const,
    orderInDiscipline: 1,
    scenario:
      "Korisniku stiže email od adrese 'support@bankovni-sistem-secure.net' sa naslovom 'HITNO: Vaš nalog je privremeno suspendovan'. Tekst glasi: 'Poštovani korisniče, zbog sigurnosne provjere Vaš nalog će biti blokiran za 2 sata. Kliknite ovdje i unesite podatke kartice kako biste potvrdili identitet.'",
    taskText: "Šta je najsigurnija reakcija na ovu situaciju?",
    hintText:
      "Obrati pažnju na hitnost poruke, adresu pošiljaoca i zahtjev za unos osjetljivih podataka.",
    feedbackCorrect:
      "Phishing poruke gotovo uvijek koriste pritisak i hitnost kako bi korisnik reagovao brzo bez razmišljanja. Legitimna banka nikad ne traži da unosiš podatke kartice preko linka iz emaila. Pravi email banke dolazi sa zvaničnog domena, nikad sa domena poput 'bankovni-sistem-secure.net'.",
    miniConclusion:
      "Sumnjivim emailovima nikad ne klikaj na linkove - idi direktno na zvanični sajt upisivanjem adrese u browser.",
    options: [
      { text: "Odmah kliknuti link jer poruka izgleda hitno i banka ne bi slala lažne emailove", isCorrect: false, explanation: "Upravo na to napadači računaju - hitnost i lažni autoritet su osnova phishinga.", order: 1 },
      { text: "Odgovoriti na email i tražiti objašnjenje od banke", isCorrect: false, explanation: "Odgovaranjem potvrđuješ napadaču da je adresa aktivna - i dalje si u opasnosti.", order: 2 },
      { text: "Ne klikati link, provjeriti adresu pošiljaoca i pristupiti banci direktno upisivanjem zvaničnog URL-a", isCorrect: true, explanation: "Ovo je jedina sigurna reakcija - ignoriši link, provjeri pošiljaoca i idi direktno na sajt banke.", order: 3 },
      { text: "Proslijediti email prijatelju da provjeri da li je lažan", isCorrect: false, explanation: "Prosljeđivanje širi potencijalnu phishing poruku i ne rješava problem.", order: 4 },
    ],
  },
  {
    disciplineSlug: "phishing-harbor",
    title: "Lažna login stranica",
    difficulty: "medium" as const,
    basePoints: 75,
    questType: "spot_danger" as const,
    orderInDiscipline: 2,
    scenario:
      "Korisnik klikne na link iz emaila i otvori se stranica koja izgleda identično kao PayPal. URL u browseru je 'paypaI-security-login.com' (slovo l je zamijenjeno velikim I). Stranica traži da uneseš email, lozinku i broj kreditne kartice 'radi verifikacije'.",
    taskText: "Koji elementi na ovoj stranici su jasni znakovi prevare?",
    hintText:
      "Ne gledaj samo logo i dizajn. Provjeri URL adresu i vrstu podataka koji se traže.",
    feedbackCorrect:
      "Napadači često kopiraju izgled poznatih servisa do savršenstva. Prava provjera uvijek počinje od URL adrese - 'paypaI-security-login.com' nije PayPal. Osim toga, PayPal nikad ne traži broj kartice na login stranici. Hitan ton je još jedan upozoravajući znak.",
    miniConclusion:
      "Uvijek provjeri URL - jedan zamijenjeni karakter može biti gotovo nevidljiv. I legitimni servisi nikad ne traže sve podatke odjednom.",
    options: [
      { text: "Samo URL nije zvaničan, ali stranica izgleda legitimno", isCorrect: false, explanation: "Lažni URL je dovoljan razlog da napustiš stranicu odmah - izgled dizajna ne znači ništa.", order: 1 },
      { text: "Samo ton poruke je hitan, sve ostalo je ok", isCorrect: false, explanation: "Hitan ton je sign, ali nije jedini problem - URL i traženje kartice su ozbiljniji.", order: 2 },
      { text: "URL nije zvaničan i dizajn samo kopira PayPal", isCorrect: false, explanation: "Ovo je tačno ali nepotpuno - traženje podataka kartice uz lozinku je dodatan alarm.", order: 3 },
      { text: "URL adresa, traženje podataka kartice uz lozinku i hitan ton su sumnjivi", isCorrect: true, explanation: "Tačno - sva tri elementa zajedno su nedvosmislen znak phishing napada.", order: 4 },
    ],
  },
  {
    disciplineSlug: "phishing-harbor",
    title: "Sumnjivi QR kod u restoranu",
    difficulty: "medium" as const,
    basePoints: 70,
    questType: "spot_danger" as const,
    orderInDiscipline: 3,
    scenario:
      "U restoranu korisnik primjećuje QR kod zalijepljen fizički preko originalnog QR koda na meniju. Skenira ga i otvara se stranica koja traži Google login 'kako bi se pregledao meni i rezervisao sto'.",
    taskText: "Koji znakovi ukazuju na to da je ovo phishing napad?",
    hintText: "QR kod je samo drugi oblik linka - tretirati ga jednako oprezno kao i svaki drugi link.",
    feedbackCorrect:
      "QR phishing je sve češći i veoma efikasan jer su ljudi navikli da skeniraju QR kodove bez razmišljanja. Fizički nalijepljen kod je već sumnjiv. Meni restorana ne zahtijeva Google login - to je jasan znak da je cilj krađa naloga. Skraćeni ili nepoznati URL je treći alarm.",
    miniConclusion:
      "QR kod = link. Uvijek provjeri kuda vodi i da li je zahtjev logičan u datom kontekstu.",
    options: [
      { text: "Samo to što QR traži login je sumnjivo", isCorrect: false, explanation: "Tačno ali nepotpuno - fizički nalijepljeni kod i nepoznat URL su jednako važni znakovi.", order: 1 },
      { text: "Samo to što je QR nalijepljen fizički je sumnjivo", isCorrect: false, explanation: "Jeste sumnjivo, ali pravi alarm je kombinacija svih faktora zajedno.", order: 2 },
      { text: "Samo nepoznat URL je sumnjiv", isCorrect: false, explanation: "Nepoznat URL je alarm, ali nije jedini problem.", order: 3 },
      { text: "Sve: fizički nalijepljeni QR, zahtjev za login koji nije potreban za meni i nepoznat URL", isCorrect: true, explanation: "Sve tri komponente zajedno su jasni dokaz phishing napada.", order: 4 },
    ],
  },

  // ─── PRIVACY ZONE ───────────────────────────────────────────────────────────
  {
    disciplineSlug: "privacy-zone",
    title: "Avionska karta na Instagramu",
    difficulty: "easy" as const,
    basePoints: 45,
    questType: "risk_assessment" as const,
    orderInDiscipline: 1,
    scenario:
      "Korisnik se sprema za putovanje i želi da objavi fotografiju avionske karte na Instagram story kako bi podijelio uzbuđenje sa pratiocima.",
    taskText: "Koji je najveći sigurnosni rizik objavljivanja avionske karte na Instagram story?",
    hintText: "Razmisli koji konkretni podaci se nalaze na avionskoj karti, osim datuma i destinacije.",
    feedbackCorrect:
      "Avionska karta sadrži ime i prezime, broj leta, sjedište, kod rezervacije i bar kod koji može otkriti broj Frequent Flyer programa. Kod rezervacije može biti iskorišćen da neko pristupi tvojoj rezervaciji, promijeni sjedište ili čak otkaže let. Story traje 24 sata ali može biti screenshotovan u sekundi.",
    miniConclusion:
      "Osjetljive podatke zamaži ili sakrij prije objave - vrijedi za karte, račune, dokumente i sve što ima jedinstvene kodove.",
    options: [
      { text: "Nema rizika - story traje samo 24 sata pa podaci nestanu", isCorrect: false, explanation: "Story može biti screenshotovan odmah - trajanje nije relevantno za sigurnost.", order: 1 },
      { text: "Na karti se nalaze lični podaci i kod rezervacije koji mogu biti zloupotrijebljeni", isCorrect: true, explanation: "Kod rezervacije može otvoriti pristup cijeloj rezervaciji i personalnim podacima.", order: 2 },
      { text: "Rizik postoji samo ako je Instagram profil javan", isCorrect: false, explanation: "Pratici također mogu screenshotovati - ni privatni profil ne garantuje sigurnost.", order: 3 },
      { text: "Nema problema ako se prekrije samo lice na selfiju sa kartom", isCorrect: false, explanation: "Lice nije problem - problem su kodovi i podaci na samoj karti.", order: 4 },
    ],
  },
  {
    disciplineSlug: "privacy-zone",
    title: "Javni Wi-Fi u kafiću",
    difficulty: "easy" as const,
    basePoints: 50,
    questType: "decision" as const,
    orderInDiscipline: 2,
    scenario:
      "Korisnik sjedi u kafiću i hitno treba da provjeri stanje na bankovnom računu i napravi uplatu. Vidi otvorenu Wi-Fi mrežu pod imenom 'Kafic_Free_WiFi' bez lozinke.",
    taskText: "Šta je najsigurnije uraditi u ovoj situaciji?",
    hintText: "Razmisli ko bi mogao biti 'između' tebe i interneta na otvorenoj mreži bez lozinke.",
    feedbackCorrect:
      "Na otvorenim javnim mrežama saobraćaj može biti presretnut napadima poput 'man-in-the-middle'. Čak i HTTPS nije uvijek garancija ako je mreža kompromitovana. Za osjetljive aktivnosti poput internet bankarstva uvijek koristi mobilne podatke ili sigurnu kućnu mrežu. VPN je dobra opcija ako moraš koristiti javni Wi-Fi.",
    miniConclusion:
      "Javni Wi-Fi nije za internet bankarstvo i osjetljive naloge - koristi mobilne podatke ili VPN.",
    options: [
      { text: "Prijaviti se normalno - mreža ima ime kafića pa je sigurno zvanična", isCorrect: false, explanation: "Svako može nazvati Wi-Fi mrežu kako želi - ime ne garantuje sigurnost.", order: 1 },
      { text: "Sačekati sigurniju mrežu ili koristiti mobilne podatke/VPN", isCorrect: true, explanation: "Mobilni podaci ili VPN su jedine sigurne opcije za osjetljive aktivnosti.", order: 2 },
      { text: "Podijeliti lozinku sa browserom da se brže poveže", isCorrect: false, explanation: "Ovo ne povećava sigurnost - problem je u samoj mreži, ne u browseru.", order: 3 },
      { text: "Isključiti antivirus da mreža radi brže", isCorrect: false, explanation: "Isključivanje antivirusa dodatno povećava rizik i ne pomaže brzini mreže.", order: 4 },
    ],
  },
  {
    disciplineSlug: "privacy-zone",
    title: "Dozvole mobilne aplikacije",
    difficulty: "easy" as const,
    basePoints: 45,
    questType: "risk_assessment" as const,
    orderInDiscipline: 3,
    scenario:
      "Korisnik preuzima besplatnu aplikaciju za baterijsku lampu sa Play Store-a. Tokom instalacije, aplikacija traži sljedeće dozvole: pristup kontaktima, stalna lokacija, mikrofon i čitanje SMS poruka.",
    taskText: "Kako procjenjuješ nivo rizika ove situacije?",
    hintText: "Uporedi funkciju aplikacije (baterijska lampa) sa listom dozvola koje traži.",
    feedbackCorrect:
      "Aplikacija za baterijsku lampu treba pristup samo kameri/flešu uređaja. Zahtjev za kontakte, lokaciju, mikrofon i SMS poruke nema nikakvo opravdanje za lampicu - ovo su dozvole koje koriste špijunske aplikacije (spyware) za prikupljanje podataka o korisniku. Visok rizik, ne instalirati.",
    miniConclusion:
      "Uvijek provjeri da li dozvole odgovaraju funkciji aplikacije. Daj aplikacijama samo minimalan neophodan pristup.",
    options: [
      { text: "Nizak rizik - sve aplikacije traže neke dozvole", isCorrect: false, explanation: "Nije tačno - postoji velik a razlika između razumnih i pretjeranih dozvola.", order: 1 },
      { text: "Srednji rizik - dozvole su čudne ali aplikacija je na Play Store-u", isCorrect: false, explanation: "Play Store nije savršen filter - maliciozne aplikacije su više puta pronalazile put.", order: 2 },
      { text: "Visok rizik - aplikacija traži dozvole koje nisu potrebne za lampicu", isCorrect: true, explanation: "Dozvole za kontakte, lokaciju, mikrofon i SMS su alarm za potencijalnu špijunažu.", order: 3 },
      { text: "Nema rizika - aplikacija ima 4.5 zvjezdice i milion preuzimanja", isCorrect: false, explanation: "Recenzije i ocjene mogu biti lažne - jedini pouzdan pokazatelj su dozvole.", order: 4 },
    ],
  },
  {
    disciplineSlug: "privacy-zone",
    title: "Dijeljenje dokumenta u cloudu",
    difficulty: "easy" as const,
    basePoints: 50,
    questType: "multiple_choice" as const,
    orderInDiscipline: 4,
    scenario:
      "Korisnik treba da podijeli seminarski rad sa profesorom putem Google Drive linka. Profesor je dao svoju email adresu i traži da pošalješ link.",
    taskText: "Koja opcija dijeljenja je najsigurnija?",
    hintText: "Najsigurnija opcija uvijek daje najmanje privilegija - samo ono što je stvarno potrebno.",
    feedbackCorrect:
      "Princip najmanjih privilegija znači da korisniku daješ samo pristup koji mu je stvarno potreban. Profesor treba da pročita rad - dakle view dozvola je dovoljna. Dijeljenje sa specifičnom email adresom sprječava slučajan pristup bilo ko ima link, a professor ionako nema razloga da uređuje tvoj rad.",
    miniConclusion:
      "Uvijek dijeli sa specifičnom adresom i samo sa dozvolom gledanja - osim ako neko stvarno treba da uređuje.",
    options: [
      { text: "Anyone with the link can edit (svi sa linkom mogu uređivati)", isCorrect: false, explanation: "Ovo daje previše pristupa - svako ko dođe do linka može promijeniti ili obrisati dokument.", order: 1 },
      { text: "Anyone with the link can view (svi sa linkom mogu pregledati)", isCorrect: false, explanation: "Bolje od edit, ali i dalje previše otvoreno - link može biti proslijeđen.", order: 2 },
      { text: "Samo email adresa profesora može pregledati (view)", isCorrect: true, explanation: "Idealno - samo profesor ima pristup, i to samo za gledanje.", order: 3 },
      { text: "Javni link na društvenim mrežama uz zahtjev profesoru da nađe", isCorrect: false, explanation: "Javni link na mrežama znači da svi mogu vidjeti tvoj seminarski rad.", order: 4 },
    ],
  },

  // ─── MALWARE LAB ────────────────────────────────────────────────────────────
  {
    disciplineSlug: "malware-lab",
    title: "Sumnjivi prilog u emailu",
    difficulty: "medium" as const,
    basePoints: 70,
    questType: "decision" as const,
    orderInDiscipline: 1,
    scenario:
      "Korisnik dobija email od adrese 'delivery@courier-fast-rs.net' sa prilogom 'Faktura_2026.exe'. Email kaže: 'Poštovani, vaš paket je spreman za preuzimanje. Preuzmite fakturu klikom na prilog za detalje dostave.'",
    taskText: "Šta treba uraditi sa ovim emailom i prilogom?",
    hintText: "Obrati pažnju na ekstenziju fajla. Šta rade .exe fajlovi?",
    feedbackCorrect:
      "Izvršni fajlovi (.exe) mogu pokrenuti bilo koji kod na računaru. Faktura nikad ne bi trebalo da bude .exe - to bi trebalo biti .pdf ili .docx. Nepoznati pošiljalac, sumnjiva domena i .exe ekstenzija su tri jasna alarma. Čak i ako skeniraš antivirusom, najsigurnija opcija je ignorisati i obrisati ovakav email.",
    miniConclusion:
      ".exe od nepoznatog pošiljaoca = ne otvarati nikad. Legitimne fakture dolaze kao PDF.",
    options: [
      { text: "Otvoriti fajl - vjerovatno je zaista faktura za isporuku", isCorrect: false, explanation: "Otvaranje .exe fajla od nepoznate adrese može odmah zaraziti računar malwareom.", order: 1 },
      { text: "Provjeriti pošiljaoca, ekstenziju fajla i skenirati antivirusom prije ikakve akcije", isCorrect: true, explanation: "Provjera pošiljaoca, ekstenzije i skeniranje su ispravni koraci - ali i uz sve provjere, sumnjivi .exe je bolje obrisati.", order: 2 },
      { text: "Preimenovati fajl iz .exe u .pdf i tada ga otvoriti", isCorrect: false, explanation: "Preime novanje ne mijenja sadržaj fajla - .exe ostaje .exe bez obzira na ekstenziju.", order: 3 },
      { text: "Proslijediti fajl kolegi da on provjeri", isCorrect: false, explanation: "Prosljeđivanjem potencijalnog malwarea ugrožavaš kolegu.", order: 4 },
    ],
  },
  {
    disciplineSlug: "malware-lab",
    title: "Ransomware poruka na ekranu",
    difficulty: "hard" as const,
    basePoints: 100,
    questType: "decision" as const,
    orderInDiscipline: 2,
    scenario:
      "Korisnik uključuje računar i vidi poruku koja pokriva cijeli ekran: 'Vaši fajlovi su šifrovani! Platite 500€ u Bitcoin-u na adresu XXX u roku od 48 sati ili zauvijek gubite sve dokumente, slike i podatke.'",
    taskText: "Koja reakcija je najispravnija u ovoj situaciji?",
    hintText: "Prva reakcija treba spriječiti širenje problema i ne pogoršati situaciju.",
    feedbackCorrect:
      "Plaćanje ransomware-a ne garantuje povratak fajlova i finansira buduće napade. Ispravna reakcija je: isključiti računar iz mreže (ethernet kabel, Wi-Fi) odmah da se spriječi širenje na druge uređaje, ne plaćati otkupninu, provjeriti postoje li backupi, i potražiti stručnu pomoć. Mnogi ransomware tipovi imaju javno dostupne dekriptore.",
    miniConclusion:
      "Kod ransomwarea: izoluj uređaj odmah, ne plaćaj, provjeri backup, traži stručnu pomoć.",
    options: [
      { text: "Odmah platiti otkupninu da se što prije povrate fajlovi", isCorrect: false, explanation: "Plaćanje ne garantuje povrat fajlova i finansira kriminalne grupe.", order: 1 },
      { text: "Isključiti računar iz mreže, ne plaćati i potražiti stručnu pomoć ili backup", isCorrect: true, explanation: "Izolacija sprječava širenje, a stručna pomoć može pronaći dekriptor ili obnoviti backup.", order: 2 },
      { text: "Kontaktirati napadača i pregovarati za niži iznos otkupnine", isCorrect: false, explanation: "Pregovaranje potvrđuje napadaču da si spreman platiti i ne garantuje ništa.", order: 3 },
      { text: "Odmah formatirati hard disk i reinstalirati Windows", isCorrect: false, explanation: "Formatiranje bez provjere backupa znači trajni gubitak svih podataka.", order: 4 },
    ],
  },

  // ─── SOCIAL ENGINEERING ─────────────────────────────────────────────────────
  {
    disciplineSlug: "social-engineering",
    title: "Prijatelj koji traži novac",
    difficulty: "medium" as const,
    basePoints: 70,
    questType: "decision" as const,
    orderInDiscipline: 1,
    scenario:
      "Korisnik dobija Instagram poruku od profila prijatelja koji kaže: 'Hej, ovdje sam vani bez novca, ukraden mi je novčanik. Možeš li mi hitno poslati 50€ na ovaj PayPal? Sutra ću ti vratiti, obećavam.' Profil izgleda kao prijateljev pravi nalog.",
    taskText: "Koja reakcija je najsigurnija?",
    hintText: "Social engineering napadi računaju na hitnost i emocionalni odgovor. Šta ti govori logika?",
    feedbackCorrect:
      "Kompromitovani nalozi na društvenim mrežama se veoma često koriste za ovakve prevare. Napadač preuzme nalog i šalje poruke svim kontaktima računajući na to da će neko reagovati iz prijateljstva ili straha. Uvijek provjeri identitet osobe drugim kanalom - pozivom ili SMS-om na poznati broj - prije slanja novca ili ličnih podataka.",
    miniConclusion:
      "Hitni zahtjevi za novcem ili podacima = uvijek provjeri identitet drugim kanalom.",
    options: [
      { text: "Odmah poslati novac - to je prijatelj u nevolji i svaki trenutak je važan", isCorrect: false, explanation: "Hitnost je glavno oruđe social engineeringa - upravo na to napadači računaju.", order: 1 },
      { text: "Tražiti broj računa i poslati manji iznos kao provjeru", isCorrect: false, explanation: "Čak i manji iznos pomaže napadaču i potvrđuje da si nasjeo na prevaru.", order: 2 },
      { text: "Kontaktirati prijatelja pozivom ili SMS-om na poznati broj da potvrdi", isCorrect: true, explanation: "Jedino siguran korak - provjeri identitet putem kanala koji znaš da je siguran.", order: 3 },
      { text: "Objaviti screenshot poruke na sopstvenom story-u da upozoriš ostale", isCorrect: false, explanation: "Objava bez provjere može biti nepravična ako je zaista u pitanju pravi prijatelj u nevolji.", order: 4 },
    ],
  },
];

export const BADGES_DATA = [
  {
    name: "Password Protector",
    slug: "password-protector",
    description: "Završio/la sve questove iz Password Base discipline.",
    icon: "🔐",
    conditionType: "discipline_complete" as const,
    conditionValue: "password-base",
  },
  {
    name: "Phishing Hunter",
    slug: "phishing-hunter",
    description: "Završio/la sve questove iz Phishing Harbor discipline.",
    icon: "🎣",
    conditionType: "discipline_complete" as const,
    conditionValue: "phishing-harbor",
  },
  {
    name: "Privacy Guardian",
    slug: "privacy-guardian",
    description: "Završio/la sve questove iz Privacy Zone discipline.",
    icon: "🛡️",
    conditionType: "discipline_complete" as const,
    conditionValue: "privacy-zone",
  },
  {
    name: "Malware Defender",
    slug: "malware-defender",
    description: "Završio/la sve questove iz Malware Lab discipline.",
    icon: "🦠",
    conditionType: "discipline_complete" as const,
    conditionValue: "malware-lab",
  },
  {
    name: "Mind Guard",
    slug: "mind-guard",
    description: "Završio/la sve questove iz Social Engineering Street discipline.",
    icon: "🧠",
    conditionType: "discipline_complete" as const,
    conditionValue: "social-engineering",
  },
  {
    name: "No Hint Hero",
    slug: "no-hint-hero",
    description: "Završio/la quest bez korišćenja hinta.",
    icon: "⚡",
    conditionType: "no_hint" as const,
    conditionValue: null,
  },
  {
    name: "Perfect Mission",
    slug: "perfect-mission",
    description: "Završio/la quest sa maksimalnim rezultatom.",
    icon: "🏆",
    conditionType: "perfect_score" as const,
    conditionValue: null,
  },
  {
    name: "Cyber Guardian",
    slug: "cyber-guardian",
    description: "Završio/la sve dostupne questove u igri.",
    icon: "🌐",
    conditionType: "all_complete" as const,
    conditionValue: null,
  },
  {
    name: "First Steps",
    slug: "first-steps",
    description: "Završio/la prvih 5 questova.",
    icon: "👣",
    conditionType: "quests_count" as const,
    conditionValue: "5",
  },
];
