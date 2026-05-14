export const landingFeatures = [
  "Kratke misije",
  "Bodovi i bedževi",
  "Dnevni izazovi",
  "Sigurno okruženje",
];

export const howItWorks = [
  {
    number: "01",
    title: "Izaberi misiju",
    text: "Biraj između disciplina kao što su lozinke, phishing i privatnost.",
    icon: "◎",
  },
  {
    number: "02",
    title: "Donosi odluke",
    text: "Analiziraj situaciju i odaberi najsigurniju reakciju.",
    icon: "▣",
  },
  {
    number: "03",
    title: "Dobij feedback",
    text: "Sistem objašnjava zašto je odgovor siguran ili rizičan.",
    icon: "✦",
  },
  {
    number: "04",
    title: "Napreduj",
    text: "Osvajaj bodove, bedževe i otključavaj nove nivoe.",
    icon: "⌁",
  },
];

export const disciplines = [
  {
    category: "LOZINKE & 2FA",
    title: "Password Base",
    text: "Nauči kako da kreiraš jake lozinke, koristiš password manager i uključiš 2FA.",
    icon: "⌘",
  },
  {
    category: "SUMNJIVI MAILOVI",
    title: "Phishing Harbor",
    text: "Prepoznaj phishing emailove, lažne login stranice i sumnjive linkove.",
    icon: "✉",
  },
  {
    category: "PRIVATNOST ONLINE",
    title: "Privacy Zone",
    text: "Zaštiti privatnost na društvenim mrežama i kontroliši šta dijeliš.",
    icon: "◉",
  },
  {
    category: "ZARAŽENI FAJLOVI",
    title: "Malware Lab",
    text: "Prepoznaj sumnjive priloge, USB uređaje i lažne aplikacije.",
    icon: "⚠",
  },
  {
    category: "MANIPULACIJA",
    title: "Social Engineering Street",
    text: "Prepoznaj manipulaciju, lažne pozive i psihološke prevare.",
    icon: "⌬",
  },
  {
    category: "ZAVRŠNI IZAZOV",
    title: "Final Cyber Challenge",
    text: "Kombinovani scenariji koji povezuju sve naučene oblasti.",
    icon: "▣",
  },
];

export const dashboardPreview = [
  {
    title: "Nastavi misiju",
    text: "Vrati se na posljednji nezavršeni quest i završi ga u par minuta.",
    label: "ACTIVE",
  },
  {
    title: "Dnevni izazov",
    text: "Kratki zadatak koji se mijenja svaki dan i gradi streak.",
    label: "TODAY",
  },
  {
    title: "Preporučeno za tebe",
    text: "Scenario iz oblasti gdje korisnik najviše griješi.",
    label: "SMART",
  },
  {
    title: "Mapa nivoa",
    text: "Pregled svih zona, questova i zaključanih oblasti.",
    label: "MAP",
  },
];

export const missions = [
  {
    id: "password-base-01",
    discipline: "Password Base",
    title: "Password Checkpoint",
    difficulty: "easy",
    points: 50,
    status: "available",
    summary: "Provjeri da li je lozinka dovoljno jaka i da li je 2FA uključen.",
  },
  {
    id: "phishing-harbor-01",
    discipline: "Phishing Harbor",
    title: "Fake Login Dock",
    difficulty: "medium",
    points: 70,
    status: "in-progress",
    summary: "Analiziraj email i odluči da li je link legitiman ili opasan.",
  },
  {
    id: "privacy-zone-01",
    discipline: "Privacy Zone",
    title: "Social Profile Lock",
    difficulty: "easy",
    points: 45,
    status: "completed",
    summary: "Podesi privatnost profila i smanji dijeljenje ličnih podataka.",
  },
];

export const userProgress = {
  profile: {
    username: "Bojan",
    status: "Junior Defender",
    level: 7,
    streak: 12,
  },
  stats: {
    points: 1240,
    xpToNextLevel: 68,
    badges: 8,
  },
  recommended: {
    title: "Phishing Harbor",
    summary:
      "Prepoznaj lažnu login stranicu prije nego što uneseš podatke.",
  },
  dailyChallenge: {
    title: "Screenshot fraud",
    summary:
      "Odluči da li je poruka pokušaj prevare ili legitimna obavijest.",
  },
};
