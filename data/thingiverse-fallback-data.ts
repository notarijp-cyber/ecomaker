/**
 * Dati di fallback per Thingiverse da utilizzare quando l'API non è disponibile
 */

import { ThingiverseModel, ThingiverseFile } from "../server/thingiverse";
import { getTranslations, translateModelData, Language, detectBrowserLanguage } from './translations';

export const fallbackModels: Record<string, ThingiverseModel[]> = {
  "bottle": [
    {
      id: 2765317,
      name: "Bottle Lamp / Lampada da Bottiglia",
      thumbnail: "https://cdn.thingiverse.com/renders/fa/51/4e/95/99/b7d9c8d349055d370f955de0d910eb88_preview_featured.jpg",
      url: "https://api.thingiverse.com/things/2765317",
      public_url: "https://www.thingiverse.com/thing:2765317",
      creator: {
        name: "Simone Fontana",
        thumbnail: "https://cdn.thingiverse.com/site/img/default/avatar/avatar_default_thumb_medium.jpg",
        url: "https://api.thingiverse.com/users/SimoneFontana"
      },
      added: "2017-12-30T19:46:51+00:00",
      modified: "2019-01-02T19:28:38+00:00",
      description: "A simple bottle lamp with a E14 socket. Just print the adapter and install it in a empty bottle with a E14 socket and a LED lamp. Una semplice lampada da bottiglia con un attacco E14. Stampate l'adattatore e installatelo in una bottiglia vuota con una presa E14 e una lampadina LED.",
      instructions: "Print the adapter with PLA or any other material, 20% infill is enough. Then insert it in the bottle, take care to secure the lamp and that it doesn't reach high temperature or you risk to damage the lamp.\n\nStampate l'adattatore in PLA o altro materiale, 20% di riempimento è sufficiente. Poi inseritelo nella bottiglia, assicuratevi di fissare la lampada e che non raggiunga alte temperature o rischiate di danneggiare la lampada.",
      license: "Creative Commons - Attribution",
      files_count: 1,
      like_count: 135,
      download_count: 3500,
      view_count: 9700,
      make_count: 12,
      tags: ["bottle", "lamp", "recycling", "upcycling", "E14", "LED"],
      is_featured: false,
      is_published: true,
      is_wip: false,
      categories: ["household", "decor"],
      file_formats: ["STL"]
    },
    {
      id: 3565150,
      name: "Lampada da Bottiglia di Vino / Wine Bottle Lamp",
      thumbnail: "https://cdn.thingiverse.com/renders/0e/c5/92/56/c6/e1aae19211474632f8760f276b9c069f_preview_featured.jpg",
      url: "https://api.thingiverse.com/things/3565150",
      public_url: "https://www.thingiverse.com/thing:3565150",
      creator: {
        name: "Marco Vallauri",
        thumbnail: "https://cdn.thingiverse.com/site/img/default/avatar/avatar_default_thumb_medium.jpg",
        url: "https://api.thingiverse.com/users/MarcoVallauri"
      },
      added: "2019-05-01T15:22:10+00:00",
      modified: "2019-05-01T15:22:10+00:00",
      description: "This is a simple lamp adapter that fits into a wine bottle. It's a great way to recycle and create a unique decoration for your home or garden. You'll need a standard E14 socket, a LED bulb (to avoid heat issues), and some basic wiring skills.",
      instructions: "Print with 20% infill. Clean any supports. Insert the E14 socket and secure with glue if needed. Thread the wire and connect to a power plug. Test before final assembly. Insert into a clean, dry wine bottle.",
      license: "Creative Commons - Attribution - Non-Commercial",
      files_count: 2,
      like_count: 86,
      download_count: 1250,
      view_count: 4300,
      make_count: 7,
      tags: ["bottle", "wine", "lamp", "upcycling", "recycling", "decoration"],
      is_featured: false,
      is_published: true,
      is_wip: false,
      categories: ["household", "decor"],
      file_formats: ["STL", "OBJ"]
    }
  ],
  "plastic": [
    {
      id: 4218906,
      name: "Plastic Bottle Recycling Tools",
      thumbnail: "https://cdn.thingiverse.com/renders/a2/b5/45/77/c4/afa8f5afe688345872d12f1c7a916591_preview_featured.jpg",
      url: "https://api.thingiverse.com/things/4218906",
      public_url: "https://www.thingiverse.com/thing:4218906",
      creator: {
        name: "ECO Makers",
        thumbnail: "https://cdn.thingiverse.com/site/img/default/avatar/avatar_default_thumb_medium.jpg",
        url: "https://api.thingiverse.com/users/EcoMakers"
      },
      added: "2020-04-12T14:28:22+00:00",
      modified: "2020-04-12T14:28:22+00:00",
      description: "Set of tools to help recycle plastic bottles. Includes a bottle cutter to create plastic strings, a cap opener, and a flattener to create plastic sheets that can be used for other projects. Great for environmental education and craft projects.",
      instructions: "Print all parts with 20-25% infill. The bottle cutter requires assembly with a standard razor blade (be careful!). Use the guides to cut even strips or create sheets from PET bottles. Check YouTube for tutorials on how to use these tools for various creative projects.",
      license: "Creative Commons - Attribution",
      files_count: 5,
      like_count: 245,
      download_count: 5780,
      view_count: 12400,
      make_count: 32,
      tags: ["recycling", "plastic", "bottle", "PET", "tools", "upcycling", "education", "environmental"],
      is_featured: true,
      is_published: true,
      is_wip: false,
      categories: ["tools", "education"],
      file_formats: ["STL", "STEP"]
    },
    {
      id: 3456789,
      name: "Plastic Bottle Planter",
      thumbnail: "https://cdn.thingiverse.com/renders/b7/34/88/99/45/d56c778dd2dbaf3f7ea954a0c65ff86c_preview_featured.jpg",
      url: "https://api.thingiverse.com/things/3456789",
      public_url: "https://www.thingiverse.com/thing:3456789",
      creator: {
        name: "GreenDesigner",
        thumbnail: "https://cdn.thingiverse.com/site/img/default/avatar/avatar_default_thumb_medium.jpg",
        url: "https://api.thingiverse.com/users/GreenDesigner"
      },
      added: "2019-08-15T10:45:30+00:00",
      modified: "2019-08-15T10:45:30+00:00",
      description: "Transform plastic bottles into beautiful planters! This adapter fits standard 500ml and 1L PET bottles and turns them into a self-watering planter. Perfect for herbs, small plants, or starting seedlings.",
      instructions: "Print with 15% infill. Cut the bottom off a clean plastic bottle. Attach the adapter to the bottle's threaded end. Fill the reservoir with water and the top section with soil. Plants will draw water through the wick as needed.",
      license: "Creative Commons - Attribution - Share Alike",
      files_count: 3,
      like_count: 189,
      download_count: 4200,
      view_count: 9850,
      make_count: 25,
      tags: ["recycling", "planter", "gardening", "bottle", "plastic", "self-watering", "sustainable"],
      is_featured: false,
      is_published: true,
      is_wip: false,
      categories: ["garden", "household"],
      file_formats: ["STL", "OBJ"]
    }
  ],
  "recycle": [
    {
      id: 2569563,
      name: "Bottle Cap Recycling Bin",
      thumbnail: "https://cdn.thingiverse.com/renders/c3/d5/54/e9/fc/5f40fec3a9f8d7c699cf093375fd9b11_preview_featured.jpg",
      url: "https://api.thingiverse.com/things/2569563",
      public_url: "https://www.thingiverse.com/thing:2569563",
      creator: {
        name: "Recycling Initiatives",
        thumbnail: "https://cdn.thingiverse.com/site/img/default/avatar/avatar_default_thumb_medium.jpg",
        url: "https://api.thingiverse.com/users/RecyclingInitiatives"
      },
      added: "2018-09-30T08:12:47+00:00",
      modified: "2018-09-30T08:12:47+00:00",
      description: "A small recycling bin designed to collect plastic bottle caps for recycling programs. Many recycling centers accept caps separately from bottles, and this container helps sort them at home. The design includes recycling symbols and can be customized with different colors.",
      instructions: "Print with 15% infill and no supports. The lid fits snugly onto the container. Place in your kitchen or wherever you consume bottled beverages. When full, take to your local recycling center that accepts plastic caps, or find a charity program that collects caps for fundraising.",
      license: "Creative Commons - Attribution",
      files_count: 2,
      like_count: 120,
      download_count: 2700,
      view_count: 6500,
      make_count: 18,
      tags: ["recycling", "bottle", "cap", "bin", "container", "environment", "plastic"],
      is_featured: false,
      is_published: true,
      is_wip: false,
      categories: ["household", "organization"],
      file_formats: ["STL"]
    },
    {
      id: 3987425,
      name: "Plastic Shredder for Recycling",
      thumbnail: "https://cdn.thingiverse.com/renders/d7/a5/e1/c6/9a/a56c72e37da215d4c58fe32889f13a5b_preview_featured.jpg",
      url: "https://api.thingiverse.com/things/3987425",
      public_url: "https://www.thingiverse.com/thing:3987425",
      creator: {
        name: "PreciousPlastic",
        thumbnail: "https://cdn.thingiverse.com/site/img/default/avatar/avatar_default_thumb_medium.jpg",
        url: "https://api.thingiverse.com/users/PreciousPlastic"
      },
      added: "2020-01-18T16:33:21+00:00",
      modified: "2020-01-18T16:33:21+00:00",
      description: "A small-scale plastic shredder for home recycling projects. This design allows you to shred plastic bottles, containers, and other recyclables into small pieces that can be melted and molded into new objects. Part of a DIY plastic recycling system for makers.",
      instructions: "This is an advanced project requiring mechanical assembly. Print the parts with high infill (50%+). You'll need to add metal blades, a motor, and follow the wiring diagram. Full assembly instructions are included in the documentation PDF. Always exercise caution when operating the shredder and never insert your hands into the machine.",
      license: "Creative Commons - Attribution - Share Alike",
      files_count: 12,
      like_count: 358,
      download_count: 8900,
      view_count: 22700,
      make_count: 45,
      tags: ["recycling", "plastic", "shredder", "machine", "sustainability", "precious plastic", "upcycling"],
      is_featured: true,
      is_published: true,
      is_wip: false,
      categories: ["tools", "machines"],
      file_formats: ["STL", "STEP", "PDF", "DXF"]
    }
  ],
  "upcycle": [
    {
      id: 3654789,
      name: "Upcycled Plastic Bottle Chandelier",
      thumbnail: "https://cdn.thingiverse.com/renders/f5/e7/a2/c4/9b/d7a5e8a2b5c41fc6b7f45a9b86d23a5b_preview_featured.jpg",
      url: "https://api.thingiverse.com/things/3654789",
      public_url: "https://www.thingiverse.com/thing:3654789",
      creator: {
        name: "CreativeUpcycler",
        thumbnail: "https://cdn.thingiverse.com/site/img/default/avatar/avatar_default_thumb_medium.jpg",
        url: "https://api.thingiverse.com/users/CreativeUpcycler"
      },
      added: "2019-11-05T13:42:18+00:00",
      modified: "2019-11-05T13:42:18+00:00",
      description: "Turn plastic bottles into an elegant chandelier! This design includes connectors and a central hub to arrange bottles in a circular pattern. Cut the bottles into decorative shapes, attach LED string lights, and create a stunning lighting fixture from waste materials.",
      instructions: "Print the hub and connectors with 25% infill. Clean and prepare plastic bottles by removing labels and cutting into desired shapes (templates included). Attach bottles to connectors, then attach connectors to the central hub. Install LED string lights through the center and distribute through the bottles. Hang using sturdy ceiling hooks.",
      license: "Creative Commons - Attribution",
      files_count: 5,
      like_count: 221,
      download_count: 3750,
      view_count: 9100,
      make_count: 15,
      tags: ["upcycling", "chandelier", "lighting", "bottle", "plastic", "decoration", "recycling"],
      is_featured: false,
      is_published: true,
      is_wip: false,
      categories: ["home", "art"],
      file_formats: ["STL", "PDF"]
    },
    {
      id: 4123456,
      name: "Upcycled Plastic Bottle Drip Irrigation System",
      thumbnail: "https://cdn.thingiverse.com/renders/a8/b6/c7/d5/e9/f7e6d5c4b3a291b8c7d6e5f4a3b2c1d0_preview_featured.jpg",
      url: "https://api.thingiverse.com/things/4123456",
      public_url: "https://www.thingiverse.com/thing:4123456",
      creator: {
        name: "GardenInnovator",
        thumbnail: "https://cdn.thingiverse.com/site/img/default/avatar/avatar_default_thumb_medium.jpg",
        url: "https://api.thingiverse.com/users/GardenInnovator"
      },
      added: "2020-03-10T09:15:47+00:00",
      modified: "2020-03-10T09:15:47+00:00",
      description: "A sustainable drip irrigation system made from upcycled plastic bottles. This design includes connectors, drippers, and distribution components that help you create a water-efficient garden system using waste materials. Perfect for home gardens and educational projects.",
      instructions: "Print connectors and components with 30% infill for durability. Clean bottles thoroughly. Drill small holes in bottle caps according to the template. Assemble the system following the diagram, connecting bottles with the printed components. Test water flow before final installation in your garden. Adjust dripper holes as needed for your specific plants.",
      license: "Creative Commons - Attribution - Share Alike",
      files_count: 8,
      like_count: 278,
      download_count: 5120,
      view_count: 13400,
      make_count: 34,
      tags: ["upcycling", "irrigation", "gardening", "bottle", "water", "sustainable", "recycling"],
      is_featured: true,
      is_published: true,
      is_wip: false,
      categories: ["garden", "education"],
      file_formats: ["STL", "PDF", "DXF"]
    }
  ]
};

export const fallbackFiles: Record<number, ThingiverseFile[]> = {
  2765317: [
    {
      id: 4559008,
      name: "bottle_lamp_adapter.stl",
      size: 79544,
      url: "https://api.thingiverse.com/files/4559008",
      download_url: "https://cdn.thingiverse.com/assets/6c/9a/07/e8/3f/bottle_lamp_adapter.stl",
      thumbnail: "https://cdn.thingiverse.com/renders/fa/51/4e/95/99/b7d9c8d349055d370f955de0d910eb88_preview_tiny.jpg",
      default_image: "https://cdn.thingiverse.com/renders/fa/51/4e/95/99/b7d9c8d349055d370f955de0d910eb88_preview_small.jpg",
      date: "2017-12-30T19:46:51+00:00",
      formatted_size: "77.7 KB",
      download_count: 3250
    }
  ],
  3565150: [
    {
      id: 6089734,
      name: "wine_bottle_lamp_adapter.stl",
      size: 102456,
      url: "https://api.thingiverse.com/files/6089734",
      download_url: "https://cdn.thingiverse.com/assets/a2/b5/c7/d8/e9/wine_bottle_lamp_adapter.stl",
      thumbnail: "https://cdn.thingiverse.com/renders/0e/c5/92/56/c6/e1aae19211474632f8760f276b9c069f_preview_tiny.jpg",
      default_image: "https://cdn.thingiverse.com/renders/0e/c5/92/56/c6/e1aae19211474632f8760f276b9c069f_preview_small.jpg",
      date: "2019-05-01T15:22:10+00:00",
      formatted_size: "100.1 KB",
      download_count: 1120
    },
    {
      id: 6089735,
      name: "wine_bottle_lamp_adapter.obj",
      size: 98234,
      url: "https://api.thingiverse.com/files/6089735",
      download_url: "https://cdn.thingiverse.com/assets/f1/e2/d3/c4/b5/wine_bottle_lamp_adapter.obj",
      thumbnail: "https://cdn.thingiverse.com/renders/0e/c5/92/56/c6/e1aae19211474632f8760f276b9c069f_preview_tiny.jpg",
      default_image: "https://cdn.thingiverse.com/renders/0e/c5/92/56/c6/e1aae19211474632f8760f276b9c069f_preview_small.jpg",
      date: "2019-05-01T15:22:10+00:00",
      formatted_size: "95.9 KB",
      download_count: 845
    }
  ],
  4218906: [
    {
      id: 7234152,
      name: "bottle_cutter_main.stl",
      size: 156720,
      url: "https://api.thingiverse.com/files/7234152",
      download_url: "https://cdn.thingiverse.com/assets/7a/8b/9c/0d/1e/bottle_cutter_main.stl",
      thumbnail: "https://cdn.thingiverse.com/renders/a2/b5/45/77/c4/afa8f5afe688345872d12f1c7a916591_preview_tiny.jpg",
      default_image: "https://cdn.thingiverse.com/renders/a2/b5/45/77/c4/afa8f5afe688345872d12f1c7a916591_preview_small.jpg",
      date: "2020-04-12T14:28:22+00:00",
      formatted_size: "153.0 KB",
      download_count: 4520
    },
    {
      id: 7234153,
      name: "blade_holder.stl",
      size: 45680,
      url: "https://api.thingiverse.com/files/7234153",
      download_url: "https://cdn.thingiverse.com/assets/2f/3e/4d/5c/6b/blade_holder.stl",
      thumbnail: "https://cdn.thingiverse.com/renders/a2/b5/45/77/c4/afa8f5afe688345872d12f1c7a916591_preview_tiny.jpg",
      default_image: "https://cdn.thingiverse.com/renders/a2/b5/45/77/c4/afa8f5afe688345872d12f1c7a916591_preview_small.jpg",
      date: "2020-04-12T14:28:22+00:00",
      formatted_size: "44.6 KB",
      download_count: 4385
    }
  ]
};

/**
 * Cerca modelli nel dataset locale di fallback
 * @param keywords - Parole chiave per la ricerca
 * @returns Modelli corrispondenti alle parole chiave
 */
export function searchFallbackModels(
  keywords: string[], 
  lang: Language = 'it'
): {
  total: number;
  hits: ThingiverseModel[];
} {
  // Traduci i termini di ricerca se necessario
  const searchTermMapping: Record<string, string> = {
    // Italiano => Inglese
    'bottiglia': 'bottle',
    'plastica': 'plastic',
    'riciclo': 'recycle',
    'riuso': 'upcycle',
    'lampada': 'lamp',
    'giardino': 'garden',
    'decorazione': 'decor',
    'strumenti': 'tools',
    
    // Inglese => Italiano
    'bottle': 'bottiglia',
    'plastic': 'plastica',
    'recycle': 'riciclo',
    'upcycle': 'riuso',
    'lamp': 'lampada',
    'garden': 'giardino',
    'decor': 'decorazione',
    'tools': 'strumenti'
  };
  
  // Espandi i termini di ricerca con le loro traduzioni
  let expandedTerms = [...keywords.map(term => term.toLowerCase())];
  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    if (searchTermMapping[lowerKeyword] && !expandedTerms.includes(searchTermMapping[lowerKeyword])) {
      expandedTerms.push(searchTermMapping[lowerKeyword]);
    }
  });
  
  // Cerca corrispondenze nei dati di fallback
  const results: ThingiverseModel[] = [];
  
  for (const term of expandedTerms) {
    // Cerca corrispondenze dirette nelle chiavi
    if (fallbackModels[term]) {
      for (const model of fallbackModels[term]) {
        // Traduci il modello se necessario
        const translatedModel = translateModelData({...model}, lang);
        // Evita duplicati
        if (!results.some(item => item.id === translatedModel.id)) {
          results.push(translatedModel);
        }
      }
      continue;
    }
    
    // Cerca corrispondenze parziali nei dati
    Object.values(fallbackModels).forEach(models => {
      models.forEach(model => {
        // Verifica se il termine è presente nel nome, descrizione o tags
        const nameMatch = model.name.toLowerCase().includes(term);
        const descMatch = model.description.toLowerCase().includes(term);
        const tagsMatch = model.tags.some(tag => tag.toLowerCase().includes(term));
        
        if (nameMatch || descMatch || tagsMatch) {
          // Traduci il modello se necessario
          const translatedModel = translateModelData({...model}, lang);
          // Evita duplicati
          if (!results.some(item => item.id === translatedModel.id)) {
            results.push(translatedModel);
          }
        }
      });
    });
  }
  
  return {
    total: results.length,
    hits: results
  };
}

/**
 * Ottiene i dettagli di un modello dal dataset locale di fallback
 * @param thingId - ID del modello da recuperare
 * @returns Dettagli del modello corrispondente all'ID
 */
export function getFallbackThingDetails(thingId: number, lang: Language = 'it'): ThingiverseModel | null {
  // Cerca il modello in tutti i dati di fallback
  for (const models of Object.values(fallbackModels)) {
    const model = models.find(m => m.id === thingId);
    if (model) {
      // Traduci il modello se necessario
      return translateModelData({...model}, lang);
    }
  }
  
  return null;
}

/**
 * Ottiene i file associati a un modello dal dataset locale di fallback
 * @param thingId - ID del modello
 * @returns File associati al modello
 */
export function getFallbackThingFiles(thingId: number): ThingiverseFile[] | null {
  return fallbackFiles[thingId] || null;
}