#!/usr/bin/env node
// Seeds public.recipes with the Meso First starter set. Run after supabase/setup.sql.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.");
  console.error("Run with: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... pnpm seed");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const ing = (qty, name_en, name_sr, perishable) => ({ qty, name_en, name_sr, perishable });
const step = (en, sr) => ({ en, sr });

const recipes = [
  // ---- BEEF ----
  {
    meat: "beef",
    name_en: "Seared Steak with Chimichurri",
    name_sr: "Pečeni biftek sa čimičurijem",
    protein: 42, calories: 540, time_min: 25,
    ingredients: [
      ing("300g", "ribeye steak", "biftek (ribaj)", true),
      ing("2 cloves", "garlic", "beli luk", true),
      ing("1 bunch", "parsley", "peršun", true),
      ing("2 tbsp", "olive oil", "maslinovo ulje", false),
      ing("1 tbsp", "red wine vinegar", "vinsko sirće", false),
      ing("1 tsp", "salt", "so", false),
      ing("1 tsp", "black pepper", "crni biber", false),
      ing("1/2 tsp", "chili flakes", "pahuljice čilija", false),
    ],
    steps: [
      step("Bring the steak to room temperature and season generously with salt and pepper.", "Ostavi biftek da dostigne soba temperaturu i posoli/pobiberi obilno."),
      step("Sear in a hot pan 3-4 minutes per side for medium-rare, then rest 5 minutes.", "Prži na jakoj vatri 3-4 minuta sa svake strane za srednje pečeno, zatim odmori 5 minuta."),
      step("Finely chop garlic and parsley, mix with oil, vinegar and chili flakes for the chimichurri.", "Sitno iseckaj beli luk i peršun, pomešaj sa uljem, sirćetom i čilijem za čimičuri."),
      step("Slice the steak against the grain and spoon the chimichurri over the top.", "Iseci biftek popreko vlakana i prelij čimičurijem."),
    ],
  },
  {
    meat: "beef",
    name_en: "Beef & Pepper Stir-fry",
    name_sr: "Govedina sa paprikom, vok",
    protein: 38, calories: 480, time_min: 20,
    ingredients: [
      ing("280g", "beef strips", "govedina (trakice)", true),
      ing("2", "bell peppers", "paprike", true),
      ing("1", "onion", "crni luk", true),
      ing("2 cloves", "garlic", "beli luk", true),
      ing("3 tbsp", "soy sauce", "soja sos", false),
      ing("1 tbsp", "cornstarch", "gustin", false),
      ing("2 tbsp", "vegetable oil", "biljno ulje", false),
    ],
    steps: [
      step("Toss beef strips in cornstarch and a splash of soy sauce.", "Uvaljaj trakice govedine u gustin i malo soja sosa."),
      step("Sear the beef in hot oil until browned, then set aside.", "Isprži govedinu na jakom ulju dok ne porumeni, pa odloži."),
      step("Stir-fry peppers, onion and garlic until just tender.", "Proprži paprike, luk i beli luk dok ne omekšaju."),
      step("Return the beef to the pan with remaining soy sauce and toss to coat.", "Vrati govedinu u tiganj sa preostalim soja sosom i promešaj."),
    ],
  },
  {
    meat: "beef",
    name_en: "Slow-Cooked Beef Stew",
    name_sr: "Govedji paprikaš",
    protein: 40, calories: 560, time_min: 120,
    ingredients: [
      ing("400g", "beef chuck", "goveđe pleće", true),
      ing("2", "carrots", "šargarepe", true),
      ing("2", "potatoes", "krompiri", true),
      ing("1", "onion", "crni luk", true),
      ing("2 tbsp", "tomato paste", "pelat", false),
      ing("500ml", "beef stock", "goveđa supa", false),
      ing("1 tsp", "paprika", "aleva paprika", false),
      ing("2", "bay leaves", "lorberov list", false),
    ],
    steps: [
      step("Cube the beef and brown it in batches in a heavy pot.", "Iseci govedinu na kocke i proprži u serijama u dubljem loncu."),
      step("Add chopped onion and cook until soft, then stir in tomato paste and paprika.", "Dodaj seckani luk i kuvaj dok ne omekša, zatim umešaj pelat i papriku."),
      step("Pour in the stock, add bay leaves, and simmer covered for 90 minutes.", "Sipaj supu, dodaj lorber, i kuvaj poklopljeno 90 minuta."),
      step("Add carrots and potatoes and cook another 25 minutes until tender.", "Dodaj šargarepu i krompir i kuvaj još 25 minuta dok ne omekšaju."),
    ],
  },
  {
    meat: "beef",
    name_en: "Beef Meatballs in Tomato Sauce",
    name_sr: "Ćufte od govedine u paradajz sosu",
    protein: 36, calories: 500, time_min: 40,
    ingredients: [
      ing("350g", "ground beef", "mlevena govedina", true),
      ing("1", "egg", "jaje", true),
      ing("1", "onion", "crni luk", true),
      ing("400g", "crushed tomatoes", "seckani paradajz", true),
      ing("1/2 cup", "breadcrumbs", "prezle", false),
      ing("2 cloves", "garlic", "beli luk", true),
      ing("1 tsp", "oregano", "origano", false),
      ing("2 tbsp", "olive oil", "maslinovo ulje", false),
    ],
    steps: [
      step("Mix ground beef with egg, breadcrumbs, half the garlic and salt; form into balls.", "Pomešaj mlevenu govedinu sa jajetom, prezlama, pola belog luka i soli; oblikuj kuglice."),
      step("Brown the meatballs in olive oil on all sides, then remove.", "Proprži ćufte na maslinovom ulju sa svih strana, pa izvadi."),
      step("Sauté onion and remaining garlic, add crushed tomatoes and oregano, simmer 5 minutes.", "Prodinstiraj luk i preostali beli luk, dodaj paradajz i origano, krčkaj 5 minuta."),
      step("Return meatballs to the sauce and simmer 20 minutes until cooked through.", "Vrati ćufte u sos i krčkaj 20 minuta dok se ne skuvaju."),
    ],
  },
  // ---- CHICKEN ----
  {
    meat: "chicken",
    name_en: "Lemon Herb Grilled Chicken",
    name_sr: "Piletina sa limunom i začinskim biljem, roštilj",
    protein: 44, calories: 420, time_min: 25,
    ingredients: [
      ing("300g", "chicken breast", "pileća prsa", true),
      ing("1", "lemon", "limun", true),
      ing("2 cloves", "garlic", "beli luk", true),
      ing("1 sprig", "rosemary", "ruzmarin", true),
      ing("2 tbsp", "olive oil", "maslinovo ulje", false),
      ing("1 tsp", "salt", "so", false),
    ],
    steps: [
      step("Butterfly the chicken breast for even cooking.", "Preseci pileća prsa po sredini za ravnomerno pečenje."),
      step("Marinate in lemon juice, minced garlic, chopped rosemary, oil and salt for 15 minutes.", "Marini u limunovom soku, seckanom belom luku, ruzmarinu, ulju i soli 15 minuta."),
      step("Grill 5-6 minutes per side until cooked through and lightly charred.", "Peci na roštilju 5-6 minuta sa svake strane dok se ne skuva i lako zapeče."),
      step("Rest 3 minutes, then slice and serve.", "Odmori 3 minuta, iseci i posluži."),
    ],
  },
  {
    meat: "chicken",
    name_en: "Chicken & Chickpea Curry",
    name_sr: "Piletina sa slanutkom u kariju",
    protein: 40, calories: 520, time_min: 35,
    ingredients: [
      ing("300g", "chicken thigh", "pileći batak (bez kosti)", true),
      ing("1 can", "chickpeas", "slanutak", false),
      ing("400ml", "coconut milk", "kokosovo mleko", false),
      ing("1", "onion", "crni luk", true),
      ing("2 tbsp", "curry powder", "kari prah", false),
      ing("2 cloves", "garlic", "beli luk", true),
      ing("1 thumb", "ginger", "đumbir", true),
    ],
    steps: [
      step("Sauté chopped onion, garlic and ginger until fragrant.", "Prodinstiraj seckani luk, beli luk i đumbir dok ne zamiriše."),
      step("Add curry powder and toast for 30 seconds, then add cubed chicken.", "Dodaj kari prah i proprži 30 sekundi, zatim dodaj isečenu piletinu na kocke."),
      step("Pour in coconut milk and simmer 15 minutes until chicken is cooked.", "Sipaj kokosovo mleko i krčkaj 15 minuta dok se piletina ne skuva."),
      step("Stir in drained chickpeas and simmer 5 more minutes.", "Umešaj oceđeni slanutak i krčkaj još 5 minuta."),
    ],
  },
  {
    meat: "chicken",
    name_en: "Baked Chicken Thighs with Root Veg",
    name_sr: "Pečeni pileći bataci sa korenastim povrćem",
    protein: 38, calories: 490, time_min: 50,
    ingredients: [
      ing("4", "chicken thighs", "pileći bataci", true),
      ing("2", "carrots", "šargarepe", true),
      ing("2", "potatoes", "krompiri", true),
      ing("1", "red onion", "crveni luk", true),
      ing("2 tbsp", "olive oil", "maslinovo ulje", false),
      ing("1 tsp", "thyme", "majčina dušica", false),
      ing("1 tsp", "paprika", "aleva paprika", false),
    ],
    steps: [
      step("Preheat oven to 200°C. Chop carrots, potatoes and onion into chunks.", "Zagrej rernu na 200°C. Iseci šargarepu, krompir i luk na komade."),
      step("Toss vegetables and chicken thighs with oil, thyme and paprika on a sheet pan.", "Promešaj povrće i batake sa uljem, majčinom dušicom i paprikom na tepsiji."),
      step("Roast 40 minutes, turning once, until chicken skin is crisp and veg is tender.", "Peci 40 minuta, okrenuvši jednom, dok koža ne postane hrskava a povrće meko."),
    ],
  },
  {
    meat: "chicken",
    name_en: "Chicken Fajita Bowl",
    name_sr: "Fahita činija sa piletinom",
    protein: 41, calories: 460, time_min: 25,
    ingredients: [
      ing("300g", "chicken breast", "pileća prsa", true),
      ing("2", "bell peppers", "paprike", true),
      ing("1", "onion", "crni luk", true),
      ing("1 cup", "cooked rice", "kuvani pirinač", false),
      ing("1 tbsp", "cumin", "kim", false),
      ing("1 tsp", "chili powder", "čili prah", false),
      ing("2 tbsp", "olive oil", "maslinovo ulje", false),
      ing("1", "lime", "limeta", true),
    ],
    steps: [
      step("Slice chicken and vegetables into strips.", "Iseci piletinu i povrće na trakice."),
      step("Toss chicken with cumin, chili powder and half the oil.", "Uvaljaj piletinu u kim, čili prah i pola ulja."),
      step("Sear chicken in a hot pan until cooked, remove, then sear peppers and onion in remaining oil.", "Isprži piletinu na jakoj vatri dok se ne skuva, izvadi, pa isprži papriku i luk u preostalom ulju."),
      step("Serve over rice with a squeeze of lime.", "Posluži preko pirinča sa limetom."),
    ],
  },
  // ---- FISH ----
  {
    meat: "fish",
    name_en: "Pan-Seared Salmon with Dill",
    name_sr: "Losos na tiganju sa koprom",
    protein: 38, calories: 460, time_min: 18,
    ingredients: [
      ing("280g", "salmon fillet", "file lososa", true),
      ing("1 bunch", "dill", "kopar", true),
      ing("1", "lemon", "limun", true),
      ing("2 tbsp", "butter", "puter", false),
      ing("1 tsp", "salt", "so", false),
    ],
    steps: [
      step("Pat the salmon dry and season with salt.", "Osuši losos i posoli."),
      step("Sear skin-side down in butter over medium-high heat for 4-5 minutes.", "Prži sa kožom nadole na puteru na srednje jakoj vatri 4-5 minuta."),
      step("Flip and cook 2-3 minutes more, basting with butter.", "Okreni i kuvaj još 2-3 minuta, prelivajući puterom."),
      step("Finish with chopped dill and a squeeze of lemon.", "Završi sa seckanim koprom i limunom."),
    ],
  },
  {
    meat: "fish",
    name_en: "Baked Cod with Cherry Tomatoes",
    name_sr: "Pečeni bakalar sa čeri paradajzom",
    protein: 34, calories: 380, time_min: 25,
    ingredients: [
      ing("280g", "cod fillet", "file bakalara", true),
      ing("200g", "cherry tomatoes", "čeri paradajz", true),
      ing("2 cloves", "garlic", "beli luk", true),
      ing("2 tbsp", "olive oil", "maslinovo ulje", false),
      ing("1 tsp", "oregano", "origano", false),
    ],
    steps: [
      step("Preheat oven to 200°C. Place cod in a baking dish.", "Zagrej rernu na 200°C. Stavi bakalar u tepsiju."),
      step("Scatter halved cherry tomatoes and sliced garlic around the fish.", "Rasporedi prepolovljeni čeri paradajz i seckani beli luk oko ribe."),
      step("Drizzle with oil, sprinkle oregano, and bake 15-18 minutes until fish flakes easily.", "Prelij uljem, pospi origanom, i peci 15-18 minuta dok se riba lako ne raspada."),
    ],
  },
  {
    meat: "fish",
    name_en: "Grilled Trout with Lemon",
    name_sr: "Pastrmka na žaru sa limunom",
    protein: 36, calories: 410, time_min: 20,
    ingredients: [
      ing("1 whole", "trout", "pastrmka", true),
      ing("1", "lemon", "limun", true),
      ing("2 sprigs", "thyme", "majčina dušica", true),
      ing("2 tbsp", "olive oil", "maslinovo ulje", false),
      ing("1 tsp", "salt", "so", false),
    ],
    steps: [
      step("Score the trout skin and season inside and out with salt.", "Zaseci kožu pastrmke i posoli iznutra i spolja."),
      step("Stuff the cavity with lemon slices and thyme.", "Napuni unutrašnjost listićima limuna i majčinom dušicom."),
      step("Brush with oil and grill 6-7 minutes per side until skin is crisp.", "Premaži uljem i peci na žaru 6-7 minuta sa svake strane dok koža ne postane hrskava."),
    ],
  },
  {
    meat: "fish",
    name_en: "Tuna & White Bean Salad",
    name_sr: "Salata od tune i belog pasulja",
    protein: 34, calories: 390, time_min: 10,
    ingredients: [
      ing("2 cans", "tuna in oil", "tuna u ulju", false),
      ing("1 can", "white beans", "beli pasulj", false),
      ing("1/2", "red onion", "crveni luk", true),
      ing("1 handful", "parsley", "peršun", true),
      ing("2 tbsp", "olive oil", "maslinovo ulje", false),
      ing("1", "lemon", "limun", true),
    ],
    steps: [
      step("Drain tuna and beans and combine in a bowl.", "Ocedi tunu i pasulj i pomešaj u činiji."),
      step("Thinly slice red onion and chop parsley, add to the bowl.", "Tanko iseci crveni luk i iseckaj peršun, dodaj u činiju."),
      step("Dress with olive oil and lemon juice, toss and season to taste.", "Začini maslinovim uljem i limunovim sokom, promešaj i dosoli po ukusu."),
    ],
  },
  // ---- LAMB ----
  {
    meat: "lamb",
    name_en: "Grilled Lamb Chops with Mint",
    name_sr: "Jagnjeći kotleti sa nanom, na žaru",
    protein: 39, calories: 520, time_min: 20,
    ingredients: [
      ing("4", "lamb chops", "jagnjeći kotleti", true),
      ing("1 bunch", "mint", "nana", true),
      ing("2 cloves", "garlic", "beli luk", true),
      ing("2 tbsp", "olive oil", "maslinovo ulje", false),
      ing("1 tsp", "salt", "so", false),
    ],
    steps: [
      step("Rub the chops with crushed garlic, half the mint (chopped), oil and salt.", "Natrljaj kotlete zgnječenim belim lukom, pola nane (iseckano), uljem i solju."),
      step("Let marinate at room temperature for 15 minutes.", "Ostavi da se marinira na sobnoj temperaturi 15 minuta."),
      step("Grill 3-4 minutes per side for medium, then rest 5 minutes.", "Peci na žaru 3-4 minuta sa svake strane za srednje pečeno, pa odmori 5 minuta."),
      step("Scatter remaining fresh mint over the top before serving.", "Pospi preostalom svežom nanom pre serviranja."),
    ],
  },
  {
    meat: "lamb",
    name_en: "Lamb & Spinach Curry",
    name_sr: "Jagnjetina sa spanaćem u kariju",
    protein: 37, calories: 540, time_min: 60,
    ingredients: [
      ing("350g", "lamb shoulder", "jagnjeće pleće", true),
      ing("200g", "spinach", "spanać", true),
      ing("1", "onion", "crni luk", true),
      ing("400g", "crushed tomatoes", "seckani paradajz", true),
      ing("2 tbsp", "curry powder", "kari prah", false),
      ing("2 cloves", "garlic", "beli luk", true),
      ing("1 thumb", "ginger", "đumbir", true),
    ],
    steps: [
      step("Brown cubed lamb in a pot, then set aside.", "Proprži jagnjetinu iseckanu na kocke u loncu, pa odloži."),
      step("Sauté onion, garlic and ginger, then stir in curry powder.", "Prodinstiraj luk, beli luk i đumbir, zatim umešaj kari prah."),
      step("Add tomatoes and lamb back in, cover and simmer 40 minutes until tender.", "Dodaj paradajz i vrati jagnjetinu, poklopi i krčkaj 40 minuta dok ne omekša."),
      step("Stir in spinach at the end and cook until wilted.", "Umešaj spanać na kraju i kuvaj dok ne uvene."),
    ],
  },
  {
    meat: "lamb",
    name_en: "Slow-Roasted Lamb Shoulder",
    name_sr: "Sporo pečeno jagnjeće pleće",
    protein: 42, calories: 600, time_min: 180,
    ingredients: [
      ing("800g", "lamb shoulder", "jagnjeće pleće", true),
      ing("4 cloves", "garlic", "beli luk", true),
      ing("2 sprigs", "rosemary", "ruzmarin", true),
      ing("2 tbsp", "olive oil", "maslinovo ulje", false),
      ing("1 tsp", "salt", "so", false),
    ],
    steps: [
      step("Preheat oven to 150°C. Cut small slits in the lamb and insert garlic slivers and rosemary.", "Zagrej rernu na 150°C. Napravi mali zaseke u jagnjetini i ubaci listiće belog luka i ruzmarin."),
      step("Rub with oil and salt, cover with foil.", "Natrljaj uljem i solju, pokrij folijom."),
      step("Roast 2.5-3 hours until the meat pulls apart easily.", "Peci 2.5-3 sata dok se meso lako ne raspada."),
      step("Rest 10 minutes, uncovered, before shredding.", "Odmori 10 minuta, otkriveno, pre kidanja."),
    ],
  },
  {
    meat: "lamb",
    name_en: "Lamb Kofta with Yogurt Sauce",
    name_sr: "Jagnjeća ćufta sa jogurt sosom",
    protein: 35, calories: 480, time_min: 30,
    ingredients: [
      ing("350g", "ground lamb", "mleveno jagnjeće meso", true),
      ing("1", "onion", "crni luk", true),
      ing("1 tsp", "cumin", "kim", false),
      ing("1 tsp", "paprika", "aleva paprika", false),
      ing("200g", "yogurt", "jogurt", true),
      ing("1 clove", "garlic", "beli luk", true),
      ing("1 handful", "parsley", "peršun", true),
    ],
    steps: [
      step("Mix ground lamb with grated onion, cumin, paprika and salt; shape onto skewers.", "Pomešaj mleveno jagnjeće meso sa rendanim lukom, kimom, paprikom i solju; oblikuj na ražnjiće."),
      step("Grill or pan-sear 3-4 minutes per side until browned through.", "Peci na žaru ili tiganju 3-4 minuta sa svake strane dok ne porumeni."),
      step("Mix yogurt with crushed garlic and chopped parsley for the sauce.", "Pomešaj jogurt sa zgnječenim belim lukom i seckanim peršunom za sos."),
      step("Serve the kofta with the yogurt sauce on the side.", "Posluži ćufte sa jogurt sosom sa strane."),
    ],
  },
  // ---- BREAKFAST (no meat) ----
  {
    meat: null,
    name_en: "Greek Yogurt & Berry Bowl",
    name_sr: "Grčki jogurt sa bobičastim voćem",
    protein: 24, calories: 320, time_min: 5,
    ingredients: [
      ing("250g", "Greek yogurt", "grčki jogurt", true),
      ing("100g", "mixed berries", "mešano bobičasto voće", true),
      ing("2 tbsp", "honey", "med", false),
      ing("2 tbsp", "granola", "granola", false),
    ],
    steps: [
      step("Spoon yogurt into a bowl.", "Sipaj jogurt u činiju."),
      step("Top with berries, a drizzle of honey and granola.", "Prelij bobičastim voćem, medom i granolom."),
    ],
  },
  {
    meat: null,
    name_en: "Veggie Scrambled Eggs",
    name_sr: "Kajgana sa povrćem",
    protein: 22, calories: 340, time_min: 12,
    ingredients: [
      ing("3", "eggs", "jaja", true),
      ing("1/2", "bell pepper", "paprika", true),
      ing("1 handful", "spinach", "spanać", true),
      ing("30g", "feta cheese", "feta sir", true),
      ing("1 tbsp", "butter", "puter", false),
    ],
    steps: [
      step("Dice pepper and sauté in butter until softened.", "Iseckaj papriku na kockice i proprži na puteru dok ne omekša."),
      step("Add spinach and cook until wilted.", "Dodaj spanać i kuvaj dok ne uvene."),
      step("Whisk eggs, pour into the pan and scramble gently over low heat.", "Umuti jaja, sipaj u tiganj i lagano mešaj na tihoj vatri."),
      step("Crumble feta over the top just before serving.", "Izmrviti fetu preko kajgane pre serviranja."),
    ],
  },
  {
    meat: null,
    name_en: "Protein Oats with Peanut Butter",
    name_sr: "Proteinska ovsena kaša sa puterom od kikirikija",
    protein: 26, calories: 420, time_min: 8,
    ingredients: [
      ing("60g", "rolled oats", "ovsene pahuljice", false),
      ing("1 scoop", "protein powder", "protein u prahu", false),
      ing("250ml", "milk", "mleko", true),
      ing("1 tbsp", "peanut butter", "puter od kikirikija", false),
      ing("1/2", "banana", "banana", true),
    ],
    steps: [
      step("Simmer oats in milk over medium heat for 5 minutes, stirring often.", "Krčkaj ovsene pahuljice u mleku na srednjoj vatri 5 minuta, često mešajući."),
      step("Off heat, stir in protein powder until smooth.", "Skini sa vatre i umešaj protein u prahu dok se ne sjedini."),
      step("Top with peanut butter and sliced banana.", "Prelij puterom od kikirikija i iseckanom bananom."),
    ],
  },
  {
    meat: null,
    name_en: "Cottage Cheese & Tomato Toast",
    name_sr: "Tost sa svežim sirom i paradajzom",
    protein: 23, calories: 310, time_min: 8,
    ingredients: [
      ing("2 slices", "sourdough bread", "kiselo testo hleb", false),
      ing("150g", "cottage cheese", "svež sir", true),
      ing("1", "tomato", "paradajz", true),
      ing("1 tsp", "olive oil", "maslinovo ulje", false),
      ing("1 pinch", "black pepper", "crni biber", false),
    ],
    steps: [
      step("Toast the bread slices.", "Ispeci kriške hleba."),
      step("Spread cottage cheese generously over each slice.", "Namaži svežim sirom obilno svaku krišku."),
      step("Top with sliced tomato, a drizzle of oil and black pepper.", "Prelij isečenim paradajzom, uljem i crnim biberom."),
    ],
  },
];

const { data, error } = await sb.from("recipes").insert(recipes).select("id");
if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}
console.log(`Seeded ${data.length} recipes.`);
