// =========================================
// CATALOGUE PRODUITS VICTORINOX
// =========================================
// Numéro WhatsApp dédié aux achats
const WHATSAPP_ACHAT = "221784297085";

const catalogueProduits = {
    suisses: [
        {
            nom: "Victorinox Classic SD Rouge",
            reference: "0.6223",
            prix: "13 000 FCFA",
            image: "../photos/0.6223.jpg",
            description: "Le Classic SD est le plus petit couteau suisse emblématique de Victorinox. Compact, léger et pratique, il se glisse facilement dans une poche, un sac ou sur un porte-clés pour vous accompagner partout.",
            caracteristiques: [
                "7 fonctions essentielles",
                "Petite lame en acier inoxydable",
                "Ciseaux de précision",
                "Lime à ongles",
                "Tournevis 2,5 mm",
                "Pincette",
                "Cure-dents",
                "Anneau porte-clés"
            ],
            dimensions: "Longueur 58 mm · Poids 21 g · Fabriqué en Suisse"
        },
        {
            nom: "Victorinox Classic SD Bleu",
            reference: "0.6223.2",
            prix: "13 000 FCFA",
            image: "../photos/0.6223.2.jpg",
            description: "Le Classic SD est le plus petit couteau suisse emblématique de Victorinox. Compact, léger et pratique, il se glisse facilement dans une poche, un sac ou sur un porte-clés pour vous accompagner partout.",
            caracteristiques: [
                "7 fonctions essentielles",
                "Petite lame en acier inoxydable",
                "Ciseaux de précision",
                "Lime à ongles",
                "Tournevis 2,5 mm",
                "Pincette",
                "Cure-dents",
                "Anneau porte-clés"
            ],
            dimensions: "Longueur 58 mm · Poids 21 g · Fabriqué en Suisse"
        },
        {
            nom: "Victorinox Classic SD Noir",
            reference: "0.6223.3",
            prix: "13 000 FCFA",
            image: "../photos/0.6223.3.jpg",
            description: "Le Classic SD est le plus petit couteau suisse emblématique de Victorinox. Compact, léger et pratique, il se glisse facilement dans une poche, un sac ou sur un porte-clés pour vous accompagner partout.",
            caracteristiques: [
                "7 fonctions essentielles",
                "Petite lame en acier inoxydable",
                "Ciseaux de précision",
                "Lime à ongles",
                "Tournevis 2,5 mm",
                "Pincette",
                "Cure-dents",
                "Anneau porte-clés"
            ],
            dimensions: "Longueur 58 mm · Poids 21 g · Fabriqué en Suisse"
        },
        {
            nom: "Victorinox Spartan Transparent Rouge",
            reference: "1.3603.T",
            prix: "20 000 FCFA",
            image: "../photos/1.3603.T.jpg",
            description: "Le Spartan est l'un des couteaux suisses les plus emblématiques de Victorinox. Compact, léger et polyvalent, il réunit les outils essentiels pour vous accompagner au quotidien, en voyage ou lors de vos activités de plein air.",
            caracteristiques: [
                "Grande lame",
                "Petite lame",
                "Tire-bouchon",
                "Ouvre-boîtes",
                "Petit tournevis",
                "Décapsuleur",
                "Grand tournevis",
                "Dénudeur de fil électrique",
                "Poinçon / alène",
                "Anneau porte-clés"
            ],
            dimensions: "Longueur 91 mm · Poids ~59 g · Fabriqué en Suisse · Côtes transparentes élégantes"
        },
        {
            nom: "Victorinox Spartan Transparent Bleu",
            reference: "1.3603.T2",
            prix: "20 000 FCFA",
            image: "../photos/1.3603.T2.jpg",
            description: "Le Spartan est l'un des couteaux suisses les plus emblématiques de Victorinox. Compact, léger et polyvalent, il réunit les outils essentiels pour vous accompagner au quotidien, en voyage ou lors de vos activités de plein air.",
            caracteristiques: [
                "Grande lame",
                "Petite lame",
                "Tire-bouchon",
                "Ouvre-boîtes",
                "Petit tournevis",
                "Décapsuleur",
                "Grand tournevis",
                "Dénudeur de fil électrique",
                "Poinçon / alène",
                "Anneau porte-clés"
            ],
            dimensions: "Longueur 91 mm · Poids ~59 g · Fabriqué en Suisse · Côtes transparentes élégantes"
        },
        {
            nom: "Victorinox Spartan Transparent Argent",
            reference: "1.3603.T7",
            prix: "20 000 FCFA",
            image: "../photos/1.3603.T7.jpg",
            description: "Le Spartan est l'un des couteaux suisses les plus emblématiques de Victorinox. Compact, léger et polyvalent, il réunit les outils essentiels pour vous accompagner au quotidien, en voyage ou lors de vos activités de plein air.",
            caracteristiques: [
                "Grande lame",
                "Petite lame",
                "Tire-bouchon",
                "Ouvre-boîtes",
                "Petit tournevis",
                "Décapsuleur",
                "Grand tournevis",
                "Dénudeur de fil électrique",
                "Poinçon / alène",
                "Anneau porte-clés"
            ],
            dimensions: "Longueur 91 mm · Poids ~59 g · Fabriqué en Suisse · Côtes transparentes élégantes"
        },
        {
            nom: "Victorinox Huntsman Camouflage",
            reference: "1.3713.94",
            prix: "25 000 FCFA",
            image: "../photos/1.3713.94.jpg",
            description: "Les couteaux suisses Victorinox Camouflage sont conçus pour ceux qui recherchent un outil fiable, pratique et durable. Grâce à leur design camouflage unique et leurs multiples fonctions, ils vous accompagnent aussi bien au quotidien que lors de vos activités de plein air.",
            caracteristiques: [
                "Lame en acier inoxydable de haute qualité",
                "Multifonctions pratiques pour un usage quotidien",
                "Design camouflage élégant et original",
                "Fabrication suisse reconnue dans le monde entier",
                "Idéal pour le camping, les voyages, la randonnée et les activités outdoor"
            ]
        },
        {
            nom: "Victorinox Spartan Camouflage",
            reference: "1.3603.94",
            prix: "20 000 FCFA",
            image: "../photos/1.3603.94.jpg",
            description: "Les couteaux suisses Victorinox Camouflage sont conçus pour ceux qui recherchent un outil fiable, pratique et durable. Grâce à leur design camouflage unique et leurs multiples fonctions, ils vous accompagnent aussi bien au quotidien que lors de vos activités de plein air.",
            caracteristiques: [
                "Lame en acier inoxydable de haute qualité",
                "Multifonctions pratiques pour un usage quotidien",
                "Design camouflage élégant et original",
                "Fabrication suisse reconnue dans le monde entier",
                "Idéal pour le camping, les voyages, la randonnée et les activités outdoor"
            ]
        },
        {
            nom: "Victorinox Climber Gold — Édition Limitée 2016",
            reference: "1.3703.T88",
            prix: "40 000 FCFA",
            image: "../photos/1.3703.T88.jpg",
            images: [
                "../photos/1.3703.T88.jpg",
                "../photos/climber-gold-coffret.jpg",
                "../photos/climber-gold-edition.jpg"
            ],
            description: "Le Victorinox Climber Gold Limited Edition 2016 est un couteau suisse collector créé pour célébrer les Jeux Olympiques de Rio 2016. Basé sur le Climber classique 91 mm, il se distingue par ses plaquettes transparentes à effet or 24 carats, qui lui donnent un aspect doré unique et luxueux. Il combine design premium et fonctionnalité complète, fidèle à la gamme Victorinox.",
            caracteristiques: [
                "Édition limitée 2016 (Jeux Olympiques de Rio) 🏅",
                "Plaquettes transparentes avec effet or 24 carats ✨",
                "Base : modèle Climber 91 mm",
                "Environ 14 fonctions intégrées (lames, ciseaux, ouvre-boîtes, tire-bouchon…)",
                "Série limitée (environ 20 000 pièces)",
                "Livré en coffret collector (selon version)",
                "Fabriqué en Suisse 🇨🇭"
            ]
        },
        {
            nom: "Victorinox Evolution S54",
            reference: "2.5393.SE",
            prix: "100 000 FCFA",
            image: "../photos/2.5393.SE.jpg",
            description: "Conçu pour les aventuriers et les amateurs d'outils multifonctions, l'Evolution S54 est l'un des modèles les plus complets de Victorinox. Grâce à ses 32 fonctions intégrées, il est prêt à relever tous les défis du quotidien comme des activités en plein air.",
            caracteristiques: [
                "Grande lame verrouillable",
                "Scie à bois",
                "Scie à métal",
                "Pince multifonction",
                "Ciseaux",
                "Boussole rotative",
                "Loupe",
                "Tire-bouchon",
                "Ouvre-boîtes",
                "Décapsuleur",
                "Tournevis Phillips",
                "Lime à ongles",
                "Poinçon / alène",
                "Pincette et cure-dents"
            ],
            dimensions: "Longueur 85 mm · Poids ~221 g · 32 fonctions intégrées · Boussole et loupe incluses · Fabrication suisse"
        },
        {
            nom: "Victorinox EvoWood 14",
            reference: "2.3901.63",
            prix: "30 000 FCFA",
            image: "../photos/2.3901.63.jpg",
            description: "L'EvoWood 14 marie l'élégance du bois de noyer à la robustesse légendaire de Victorinox. Compact et raffiné, ce couteau suisse multifonctions est aussi beau que pratique pour un usage quotidien.",
            caracteristiques: [
                "Grande lame",
                "Petite lame",
                "Ciseaux",
                "Tire-bouchon",
                "Ouvre-boîtes et décapsuleur",
                "Tournevis",
                "Poinçon / alène",
                "Anneau porte-clés"
            ],
            dimensions: "Manche en bois de noyer (Walnut) · Fabriqué en Suisse"
        },
        {
            nom: "Victorinox Evolution S557 Wood",
            reference: "2.5221.S63",
            prix: "35 000 FCFA",
            image: "../photos/2.5221.S63.jpg",
            description: "L'Evolution S557 Wood est un couteau suisse haut de gamme qui associe l'élégance du bois de noyer à la qualité légendaire de Victorinox. Conçu pour les amateurs d'outils multifonctions, il est aussi beau que pratique.",
            caracteristiques: [
                "19 fonctions intégrées",
                "Grande lame verrouillable",
                "Pince multifonction",
                "Coupe-fil",
                "Ciseaux à micro-denture",
                "Tournevis cruciforme",
                "Ouvre-boîtes et décapsuleur",
                "Tire-bouchon",
                "Lime à ongles",
                "Poinçon / alène",
                "Clé universelle M3, M4 et M5"
            ],
            dimensions: "Longueur 85 mm · Poids 127 g · Manche en bois de noyer (Walnut) · Lame verrouillable · Fabriqué en Suisse"
        },
        {
            nom: "Victorinox Fisherman — Couteau de Pêche",
            reference: "1.4733.72",
            prix: "25 000 FCFA",
            images: ["../photos/fisherman.jpg"],
            description: "Lorsque vous entendez parler du couteau suisse, il y a fort à parier que vous pensiez d'abord au légendaire couteau d'officier original. Et la légende se poursuit avec le couteau de poche Fisherman. Conçu pour les pêcheurs, il comprend, bien sûr, un écailleur à poissons et un dégorgeoir. Gardez-le dans votre boîte à accessoires, prêt à venir à bout de vos plus grosses prises.",
            caracteristiques: [
                "Grande lame / Petite lame",
                "Ouvre-boîtes",
                "Tournevis 3 mm et 6 mm",
                "Décapsuleur",
                "Dénudeur de fils électriques",
                "Poinçon alésoir",
                "Ciseaux",
                "Tournevis Phillips 1/2",
                "Crochet multi-usages",
                "Écailleur à poissons",
                "Dégorgeoir",
                "Règle (cm et po)",
                "Anneau, pincettes et cure-dents"
            ],
            dimensions: "Hauteur 20 mm · Longueur 91 mm · Largeur 26 mm · Poids 99 g · 18 fonctions · Fabriqué en Suisse"
        },
        {
            nom: "Victorinox Traveller Lite",
            reference: "1.7905.AVT",
            prix: "70 000 FCFA",
            images: ["../photos/traveller-lite.jpg"],
            description: "Le compagnon idéal pour les voyages et les aventures en plein air. Doté de nombreuses fonctions pratiques ainsi que d'outils électroniques intégrés, il vous aide à rester orienté, informé et prêt à toute situation.",
            caracteristiques: [
                "Grande lame et petite lame",
                "Ciseaux de précision",
                "Lampe LED intégrée",
                "Horloge digitale et alarme",
                "Altimètre et baromètre",
                "Thermomètre",
                "Tournevis et ouvre-boîtes",
                "Qualité suisse Victorinox 🇨🇭"
            ]
        },
        {
            nom: "Victorinox Expedition Kit",
            reference: "1.8741.AVT",
            prix: "80 000 FCFA",
            images: ["../photos/expedition-kit.jpg"],
            description: "Conçu pour les aventuriers, les voyageurs et les passionnés d'activités en plein air, l'Expedition Kit est l'un des couteaux suisses les plus complets de la gamme Victorinox. Associant outils traditionnels et accessoires d'orientation, il vous accompagne dans toutes vos explorations avec fiabilité et précision.",
            caracteristiques: [
                "41 fonctions pratiques",
                "Boussole et loupe intégrées",
                "Scie à bois et lime à métaux",
                "Horloge, thermomètre et altimètre",
                "Lampe LED",
                "Étui de transport inclus",
                "Qualité suisse reconnue dans le monde entier 🇨🇭"
            ],
            dimensions: "41 fonctions · Boussole, loupe et pierre à aiguiser · Étui en cuir inclus · Fabriqué en Suisse"
        },
        {
            nom: "Victorinox Golf Tool",
            reference: "0.7052.T",
            prix: "20 000 FCFA",
            image: "../photos/0.7052.T.jpg",
            description: "Le Victorinox Golf Tool est un outil multifonction spécialement conçu pour les joueurs de golf. Il combine plusieurs fonctions utiles dans un format compact et portable, à emporter facilement sur le parcours. Disponible en rouge ou noir.",
            caracteristiques: [
                "Outil divot — réparation des marques sur le green ⛳",
                "Marqueur de balle magnétique",
                "Brosse de nettoyage pour crampons",
                "Petit couteau / lame utilitaire (selon version)",
                "Anneau porte-clés pour un transport facile",
                "Format compact et portable"
            ]
        }
    ],
    swiss_cards: [
        {
            nom: "Victorinox SwissCard Classic Sapphire (Bleu)",
            reference: "0.7122.T2",
            prix: "15 000 FCFA",
            image: "../photos/0.7122.T2.jpg",
            description: "Toute l'ingéniosité du couteau suisse dans un format carte pratique et élégant. Glissez-la dans votre portefeuille et gardez à portée de main plusieurs outils essentiels pour le quotidien : ciseaux, lime à ongles, tournevis, stylo, pince à épiler et bien plus encore.",
            caracteristiques: [
                "Compacte et légère",
                "Design intelligent",
                "Qualité suisse reconnue dans le monde entier",
                "Idéale pour le bureau, les voyages et les usages quotidiens"
            ]
        },
        {
            nom: "Victorinox SwissCard Classic Ruby (Rouge)",
            reference: "0.7100.T",
            prix: "15 000 FCFA",
            image: "../photos/0.7100.T.jpg",
            description: "Toute l'ingéniosité du couteau suisse dans un format carte pratique et élégant. Glissez-la dans votre portefeuille et gardez à portée de main plusieurs outils essentiels pour le quotidien : ciseaux, lime à ongles, tournevis, stylo, pince à épiler et bien plus encore.",
            caracteristiques: [
                "Compacte et légère",
                "Design intelligent",
                "Qualité suisse reconnue dans le monde entier",
                "Idéale pour le bureau, les voyages et les usages quotidiens"
            ]
        },
        {
            nom: "Victorinox SwissCard Classic Onyx (Noir)",
            reference: "0.7133.T3",
            prix: "15 000 FCFA",
            image: "../photos/0.7133.T3.jpg",
            description: "Toute l'ingéniosité du couteau suisse dans un format carte pratique et élégant. Glissez-la dans votre portefeuille et gardez à portée de main plusieurs outils essentiels pour le quotidien : ciseaux, lime à ongles, tournevis, stylo, pince à épiler et bien plus encore.",
            caracteristiques: [
                "Compacte et légère",
                "Design intelligent",
                "Qualité suisse reconnue dans le monde entier",
                "Idéale pour le bureau, les voyages et les usages quotidiens"
            ]
        },
        {
            nom: "Victorinox SwissCard Lite (Rouge / Noir / Bleu)",
            reference: "0.7300.T",
            prix: "15 000 FCFA",
            image: "../photos/swisscard-lite.jpg",
            description: "Toute l'ingéniosité du couteau suisse dans un format carte pratique et élégant, avec une lampe LED intégrée. Glissez-la dans votre portefeuille et gardez à portée de main vos outils essentiels, de jour comme de nuit. Disponible en Rouge, Noir et Bleu.",
            caracteristiques: [
                "Lampe LED intégrée",
                "Compacte et légère",
                "Design intelligent",
                "Qualité suisse reconnue dans le monde entier",
                "Idéale pour le bureau, les voyages et les usages quotidiens"
            ]
        }
    ],
    viande: [
        { nom: "Couteau à Désosser Fibrox Rouge", reference: "5.6001.15", prix: "20 000 FCFA", image: "../photos/5615.JPEG", description: "Couteau à désosser à lame étroite de 15 cm et manche Fibrox antidérapant, pour un désossage net et précis de la viande." },
        { nom: "Couteau à Désosser Fibrox Bleu", reference: "5.6002.15", prix: "20 000 FCFA", image: "../photos/56215.JPEG", description: "Couteau à désosser à lame de 15 cm et manche Fibrox bleu (codage couleur HACCP), pour une découpe professionnelle et hygiénique." },
        { nom: "Couteau à Désosser Fibrox Noir", reference: "5.6003.15", prix: "20 000 FCFA", image: "../photos/56315.JPEG", description: "Couteau à désosser à lame de 15 cm et manche Fibrox noir antidérapant, robuste et précis pour les professionnels de la viande." },
        { nom: "Couteau à Saigner Fibrox Rouge", reference: "5.5501.18", prix: "20 000 FCFA", image: "../photos/5518.JPEG", description: "Couteau à saigner à lame pointue et rigide de 18 cm, conçu pour l'abattage et la saignée dans le respect des règles d'hygiène." },
        { nom: "Couteau à Saigner Fibrox Bleu", reference: "5.5502.18", prix: "20 000 FCFA", image: "../photos/55218.JPEG", description: "Couteau à saigner à lame de 18 cm et manche Fibrox bleu, robuste et précis pour un usage professionnel intensif." },
        { nom: "Couteau Boucher Fibrox Noir (18 cm)", reference: "5.7403.18", prix: "20 000 FCFA", image: "../photos/5718.JPEG", description: "Couteau de boucher professionnel à lame large de 18 cm, idéal pour parer, dépecer et trancher avec puissance." },
        { nom: "Couteau Boucher Fibrox Noir (20 cm)", reference: "5.7403.20", prix: "20 000 FCFA", image: "../photos/5720.JPEG", description: "Couteau de boucher professionnel à lame de 20 cm, parfait équilibre entre précision et puissance pour la découpe des grosses pièces." },
        { nom: "Couteau Boucher Fibrox Noir (25 cm)", reference: "5.7403.25", prix: "20 000 FCFA", image: "../photos/5725.JPEG", description: "Couteau de boucher à grande lame de 25 cm, conçu pour dépecer et trancher les pièces les plus volumineuses." },
        { nom: "Couteau à Volaille Nylon Noir", reference: "5.5103.10", prix: "20 000 FCFA", image: "../photos/5510.JPEG", description: "Couteau à volaille robuste à manche nylon, idéal pour désosser et découper la volaille." },
        { nom: "Couperet de Cuisine", reference: "5.4003.18", prix: "20 000 FCFA", image: "../photos/5418.JPEG", description: "Couperet puissant à lame large de 18 cm pour hacher et trancher la viande avec efficacité." },
        { nom: "Couteau à Découper Fibrox", reference: "5.2003.22", prix: "20 000 FCFA", image: "../photos/5222.JPEG", description: "Couteau à découper à lame de 22 cm et manche Fibrox antidérapant, conçu pour trancher viandes et rôtis avec aisance." }
    ],
    couteaux_cuisine: [
        { nom: "Swiss Classic, Couteau d'Office 10 cm Lisse", reference: "6.7704.C1", prix: "20 000 FCFA", image: "../photos/67C1.JPEG", description: "Couteau d'office polyvalent à lame lisse de 10 cm, idéal pour éplucher, parer et trancher au quotidien." },
        { nom: "Swiss Classic, Couteau d'Office 10 cm", reference: "6.7705.C1", prix: "20 000 FCFA", image: "../photos/675C1.JPEG", description: "Couteau d'office Swiss Classic de 10 cm, maniable et précis pour tous les petits travaux de cuisine." },
        { nom: "Couteau à Décorer", reference: "7.6054.3", prix: "Prix sur demande", image: "../photos/7.6054.3.jpg", description: "Couteau à décorer à denture plate de 4 mm, lame de 8,5 cm. Idéal pour la présentation des fruits et légumes." },
        { nom: "Couteau à Décorer Forgé", reference: "7.6052 / 7.6053.3", prix: "Prix sur demande", image: "../photos/7.6053.3.jpg", description: "Couteau à décorer forgé à denture profonde de 5 mm, lame de 11 cm. Manche bois lamellé (7.6052) ou synthétique sans rivets (7.6053.3)." },
        { nom: "Couteau à Huîtres, Manche Bois", reference: "7.6391 / 7.6392", prix: "Prix sur demande", image: "../photos/7.6391.jpg", description: "Couteau à huîtres avec garde de protection. Manche en bois lamellé (7.6391) ou synthétique noir (7.6392)." },
        { nom: "Couteau à Huîtres avec Garde", reference: "7.6393", prix: "Prix sur demande", image: "../photos/7.6393.jpg", description: "Couteau à huîtres à lame inox robuste, garde de protection et manche synthétique antidérapant." }
    ],
    cuisine: [
        {
            nom: "Bloc Porte-Couteaux Swiss Classic, 11 Pièces",
            reference: "6.7153.11",
            prix: "150 000 FCFA",
            image: "../photos/6.7153.11.jpg",
            images: [
                "../photos/6.7153.11.jpg",
                "../photos/6.7153.11-cuisine.jpg",
                "../photos/6.7153.11-couteaux.jpg"
            ],
            description: "Bloc porte-couteaux multifonction au design naturel. Le bloc porte-couteaux comprend des ustensiles de qualité professionnelle et déborde d'inspiration. Chacune de ses 11 pièces est conçue pour vous aider à arriver à vos fins plus efficacement et plus agréablement que vous ne l'auriez imaginé. Il comporte tout ce dont vous avez besoin pour repousser les limites de votre créativité culinaire… Imaginez les possibilités qui s'offrent à vous !",
            caracteristiques: [
                "Éplucheur, deux tranchants",
                "Couteau à steak Swiss Classic, tranchant denté, 11 cm",
                "Couteau d'office Swiss Classic, tranchant denté, 8 cm",
                "Couteau d'office Swiss Classic, pointe milieu, 8 cm",
                "Couteau d'office Swiss Classic, pointe milieu, 10 cm",
                "Couteau à tomates et de table Swiss Classic, tranchant denté, 11 cm",
                "Couteau à découper Swiss Classic, 15 cm",
                "Couteau à découper Swiss Classic, 22 cm",
                "Couteau Santoku Swiss Classic, lame alvéolée, 17 cm",
                "Couteau à pain Swiss Classic, tranchant denté, 21 cm",
                "Fusil de ménage, rond, 20 cm"
            ],
            dimensions: "Hauteur 35,5 cm · Bloc en bois de hêtre · Fabriqué en Suisse 🇨🇭"
        },
        {
            nom: "Mallette de Chef Victorinox, 14 Pièces",
            reference: "5.4903",
            prix: "250 000 FCFA",
            image: "../photos/5.4903.jpg",
            description: "👨‍🍳 Pensée pour les passionnés de cuisine comme pour les professionnels, cette mallette de chef Victorinox réunit les essentiels pour travailler avec précision, confort et efficacité. La qualité suisse au service de votre créativité en cuisine. 🇨🇭🔪",
            caracteristiques: [
                "Une sélection de couteaux indispensables pour toutes les préparations",
                "Un fusil à aiguiser pour maintenir un tranchant optimal",
                "Des ustensiles de cuisine soigneusement sélectionnés",
                "Une mallette robuste et pratique pour transporter et protéger votre matériel",
                "Lames en acier inoxydable de haute qualité",
                "Tranchant durable et précision exceptionnelle",
                "Poignées ergonomiques pour une prise en main confortable",
                "Idéale pour les chefs, étudiants en cuisine et passionnés de gastronomie"
            ],
            dimensions: "Mallette 46 × 32 cm · 14 pièces · Fabriqué en Suisse 🇨🇭"
        },
        {
            nom: "Ménagère Victorinox Swiss Classic 12 Pièces",
            reference: "6.7833.12",
            prix: "50 000 FCFA",
            image: "../photos/6.7833.12.jpg",
            description: "Le set Victorinox Swiss Classic 12 pièces est une ménagère élégante et pratique conçue pour un usage quotidien, idéale pour les repas en famille ou les occasions spéciales. Ce coffret comprend 6 couteaux de table à lame dentelée de 11 cm et 6 fourchettes assorties. Les lames tranchantes et dentelées, inspirées des couteaux de cuisine Victorinox, coupent sans effort viandes, légumes et aliments du quotidien, tandis que les manches ergonomiques en polypropylène offrent une prise en main confortable et sécurisée.",
            caracteristiques: [
                "6 couteaux de table à lame dentelée 11 cm + 6 fourchettes assorties",
                "Design simple et moderne",
                "Très résistant et durable",
                "Légers et faciles à utiliser",
                "Compatibles lave-vaisselle",
                "Idéal pour un usage quotidien ou professionnel"
            ]
        },
        {
            nom: "Victorinox Swiss Classic — Set de Cuisine 5 Pièces",
            reference: "6.7133.5",
            prix: "45 000 FCFA",
            image: "../photos/6.7133.5.webp",
            description: "Le set de cuisine Victorinox Swiss Classic 5 pièces est un coffret de couteaux polyvalents conçu pour répondre à tous les besoins essentiels en cuisine. Il comprend un couteau d'office (petits travaux, épluchage), un couteau universel, un couteau à légumes / éminceur, un couteau de chef (ou Santoku selon la version) et un couteau à pain. Les lames en acier inoxydable Victorinox sont reconnues pour leur durabilité, leur tranchant précis et leur facilité d'aiguisage, tandis que les manches ergonomiques assurent une excellente prise en main, confortable et sécurisée.",
            caracteristiques: [
                "Polyvalent pour toutes les préparations",
                "Qualité professionnelle Victorinox",
                "Lames tranchantes et résistantes",
                "Bonne prise en main ergonomique",
                "Idéal pour une cuisine maison ou professionnelle"
            ]
        },
        {
            nom: "Ciseaux de Cuisine Victorinox",
            reference: "7.6363",
            prix: "7 000 FCFA",
            images: [
                "../photos/ciseaux-cuisine.jpg",
                "../photos/ciseaux-cuisine-noir.jpg"
            ],
            description: "L'allié indispensable de votre cuisine. Robustes, précis et confortables, les ciseaux de cuisine Victorinox facilitent toutes vos découpes au quotidien grâce à leur qualité suisse reconnue dans le monde entier.",
            caracteristiques: [
                "Acier inoxydable de haute qualité",
                "Coupe nette et précise",
                "Prise en main confortable",
                "Robustes et durables",
                "Swiss Made 🇨🇭"
            ]
        },
        {
            nom: "Tire-Bouchon avec Coupe-Capsule Intégré",
            reference: "7.6903",
            prix: "8 000 FCFA",
            image: "../photos/7.6903.jpg",
            images: [
                "../photos/7.6903.jpg",
                "../photos/tire-bouchon-capsule.jpg",
                "../photos/tire-bouchon-boite.jpg"
            ],
            description: "Plus besoin de combines laborieuses, voire dangereuses, pour ouvrir vos bouteilles, vous allez désormais pouvoir les déboucher en un clin d'œil. Après avoir retiré l'aluminium qui entoure le goulot de la bouteille, il vous suffit d'insérer la spirale de notre tire-bouchon dans le bouchon et de tourner doucement afin que le bouchon sorte progressivement de la bouteille. Plus besoin de forcer ni de lutter contre des bouchons récalcitrants : laissez la magie opérer, sans effort et tout en délicatesse.",
            caracteristiques: [
                "Coupe-capsule intégré pour retirer l'aluminium du goulot",
                "Spirale qui extrait le bouchon en douceur, progressivement",
                "Ouverture sans effort et sans forcer",
                "Vient à bout des bouchons les plus récalcitrants",
                "Prise en main confortable et sûre",
                "Qualité Victorinox 🇨🇭"
            ],
            dimensions: "Spirale sans fin · Coupe-capsule intégré · Ouverture sans effort"
        },
        { nom: "Ciseaux de Cuisine «Professional» Forgés", reference: "7.6376", prix: "Prix sur demande", image: "../photos/7.6376.jpg", description: "Ciseaux de cuisine multi-usages forgés à chaud, entièrement en inox. Longueur totale 19,5 cm." },
        { nom: "Cisaille à Volaille «Victorinox»", reference: "7.6343", prix: "Prix sur demande", image: "../photos/7.6343.jpg", description: "Cisaille à volaille en inox, longueur totale 25 cm. Ressort spiralé remplaçable (7.6343.11)." },
        { nom: "Cisaille à Volaille «Professional»", reference: "7.6344", prix: "Prix sur demande", image: "../photos/7.6344.jpg", description: "Cisaille à volaille professionnelle en inox, longueur totale 25 cm." },
        { nom: "Cisaille à Volaille à Ressort Tampon", reference: "7.6345", prix: "Prix sur demande", image: "../photos/7.6345.jpg", description: "Cisaille à volaille tout inox avec ressort tampon, longueur totale 25 cm." },
        { nom: "Cisaille à Volaille Démontable", reference: "7.6350", prix: "Prix sur demande", image: "../photos/7.6350.jpg", description: "Cisaille à volaille en inox, longueur totale 25 cm, facilement démontable pour le nettoyage." },
        { nom: "Masticateur — Cisaille à Viande", reference: "7.6380", prix: "Prix sur demande", image: "../photos/7.6380.jpg", description: "Cisaille hachoir à viande incurvée en inox, longueur totale 18 cm. Vis et ressort de rechange disponibles." },
        { nom: "Batte à Viande Inox", reference: "7.7305", prix: "Prix sur demande", image: "../photos/7.7305.jpg", description: "Batte à viande professionnelle entièrement en inox, 1250 g. Pour attendrir et aplatir les viandes." },
        { nom: "Éplucheur à Pommes de Terre", reference: "5.0103 / 5.0101", prix: "Prix sur demande", image: "../photos/5.0103.jpg", description: "Éplucheur à un tranchant pour droitier. Manche synthétique noir (5.0103) ou rouge (5.0101)." },
        { nom: "Éplucheur, Deux Tranchants", reference: "5.0203 / 5.0201", prix: "Prix sur demande", image: "../photos/5.0203.jpg", description: "Éplucheur à double tranchant, manche synthétique noir ou rouge. Existe aussi en version dentée (5.0203.S / 5.0201.S)." },
        { nom: "Éplucheur Manche Bois", reference: "5.0109", prix: "Prix sur demande", image: "../photos/5.0109.jpg", description: "Éplucheur à un tranchant pour droitier, manche en bois." },
        { nom: "Éplucheur Manche Bois, Deux Tranchants", reference: "5.0209", prix: "Prix sur demande", image: "../photos/5.0209.jpg", description: "Éplucheur à double tranchant, manche en bois. Existe aussi en version dentée (5.0209.S)." },
        { nom: "Éplucheur «REX»", reference: "7.6070", prix: "Prix sur demande", image: "../photos/7.6070.jpg", description: "Le légendaire éplucheur suisse en aluminium à lame pivotante. Lame de rechange disponible (7.6071)." },
        { nom: "Éplucheur «RAPID»", reference: "7.6070.7", prix: "Prix sur demande", image: "../photos/7.6070.7.jpg", description: "Éplucheur ultra-léger à lame pivotante. Lame de rechange disponible (7.6071)." },
        { nom: "Coupe-Julienne «J-Star»", reference: "7.6072", prix: "Prix sur demande", image: "../photos/7.6072.jpg", description: "Coupe-julienne à lame pivotante, tout inox. Parfait pour tailler légumes et crudités en fins bâtonnets." },
        { nom: "Éplucheur à Lame Pivotante Inox", reference: "7.6073.3 / 7.6073 / 7.6073.7", prix: "Prix sur demande", image: "../photos/7.6073.3.jpg", description: "Éplucheur à lame pivotante en inox. Noir (7.6073.3), rouge (7.6073) ou blanc (7.6073.7). Lame de rechange 7.6073.03." },
        { nom: "Éplucheur Universel", reference: "7.6075", prix: "Prix sur demande", image: "../photos/7.6075.jpg", description: "Éplucheur universel à lame pivotante inox, tranchant denté, double tranchant. Disponible en 6 coloris." },
        { nom: "Éplucheur, Tranchant Denté", reference: "7.6077", prix: "Prix sur demande", image: "../photos/7.6077.jpg", description: "Éplucheur à lame inox dentée, double tranchant. Disponible en 6 coloris." },
        { nom: "Éplucheur à Tomates et Kiwis", reference: "7.6079", prix: "Prix sur demande", image: "../photos/7.6079.jpg", description: "Éplucheur à lame pivotante inox dentée, double tranchant. Idéal pour les peaux fines (tomates, kiwis). 6 coloris." },
        { nom: "Éplucheur Inox à Éjection", reference: "7.6074", prix: "Prix sur demande", image: "../photos/7.6074.jpg", description: "Éplucheur tout inox qui rejette la peau vers l'arrière pendant l'épluchage." },
        { nom: "Râpe à Fromage Inox", reference: "7.6076", prix: "Prix sur demande", image: "../photos/7.6076.jpg", description: "Râpe à fromage compacte entièrement en inox." },
        { nom: "Mandoline «Handslicer» Complète", reference: "7.6078", prix: "Prix sur demande", image: "../photos/7.6078.jpg", description: "Coupe-légumes complet avec 3 éléments en inox : trancheur double tranchant, julienne et râpe, plus porte-aliment de sécurité." },
        {
            nom: "Râpe de Cuisine, Gros Grain",
            reference: "7.6081.1",
            prix: "Prix sur demande",
            images: [
                "../photos/7.6081.1.jpg",
                "../photos/7.6081.1-protege.jpg"
            ],
            description: "Râpe de cuisine en inox à gros grain, pieds antidérapants et protection de lame incluse."
        },
        {
            nom: "Râpe de Cuisine, Grain Fin",
            reference: "7.6082.4",
            prix: "Prix sur demande",
            images: [
                "../photos/7.6082.4.jpg",
                "../photos/7.6082.4-protege.jpg"
            ],
            description: "Râpe de cuisine en inox à grain fin, pieds antidérapants et protection de lame incluse."
        },
        { nom: "Canneleur — Décorateur d'Agrumes", reference: "5.3403", prix: "Prix sur demande", image: "../photos/5.3403.jpg", description: "Canneleur à agrumes, manche synthétique noir. Pour décorer citrons et oranges." },
        { nom: "Zesteur d'Agrumes", reference: "5.3503", prix: "Prix sur demande", image: "../photos/5.3503.jpg", description: "Zesteur à agrumes, manche synthétique noir. Prélève finement les zestes." },
        { nom: "Vide-Pomme Ø 16 mm", reference: "5.3603.16", prix: "Prix sur demande", image: "../photos/5.3603.16.jpg", description: "Vide-pomme en inox Ø 16 mm, manche synthétique noir." },
        { nom: "Canneleur Manche Bois", reference: "5.3400", prix: "Prix sur demande", image: "../photos/5.3400.jpg", description: "Canneleur — décorateur d'agrumes avec manche en bois." },
        { nom: "Zesteur Manche Bois", reference: "5.3500", prix: "Prix sur demande", image: "../photos/5.3500.jpg", description: "Zesteur d'agrumes avec manche en bois." },
        { nom: "Vide-Pomme Manche Bois Ø 16 mm", reference: "5.3609.16", prix: "Prix sur demande", image: "../photos/5.3609.16.jpg", description: "Vide-pomme Ø 16 mm avec manche en bois laqué." },
        { nom: "Cuillère à Pommes Parisienne", reference: "7.6153.22", prix: "Prix sur demande", image: "../photos/7.6153.22.jpg", description: "Cuillère parisienne en inox, 1 coupe Ø 22 mm. Pour billes de fruits et légumes." },
        { nom: "Cuillère Parisienne Double", reference: "7.6163 / 7.6160", prix: "Prix sur demande", image: "../photos/7.6163.jpg", description: "Cuillère parisienne en inox, 2 coupes Ø 22 + 25 mm. Manche synthétique (7.6163) ou bois (7.6160)." },
        { nom: "Spatule Multi-Usages Flexible", reference: "7.6230 / 7.6233", prix: "Prix sur demande", image: "../photos/7.6230.jpg", description: "Spatule flexible ajourée, lame 8 × 16 cm. Manche bois (7.6230) ou synthétique (7.6233)." },
        { nom: "Spatule Coudée Flexible", reference: "7.6251", prix: "Prix sur demande", image: "../photos/7.6251.jpg", description: "Spatule coudée flexible, lame 8 × 11 cm, manche en palissandre." },
        { nom: "Ouvre-Boîtes Universel", reference: "7.6857 / 7.6857.3", prix: "Prix sur demande", images: ["../photos/ouvre-boites-noir.jpg", "../photos/ouvre-boites-rouge.jpg"], description: "Ouvre-boîtes universel robuste avec décapsuleur intégré. Manche synthétique antidérapant, disponible en noir (7.6857.3) ou rouge (7.6857)." },
        { nom: "Cisaille Universelle", reference: "7.6871.3 / 7.6875.3", prix: "Prix sur demande", image: "../photos/7.6871.3.jpg", description: "Cisaille tout usage à ressort. Longueur totale 15 cm (7.6871.3) ou 19 cm (7.6875.3)." },
        { nom: "Ouvre-Bouteilles PET / Décapsuleur", reference: "7.6912 / 7.6912.3", prix: "Prix sur demande", image: "../photos/7.6912.3.jpg", description: "Décapsuleur avec ouvre-bouteilles PET intégré. Rouge (7.6912) ou noir (7.6912.3)." },
        
        
        { nom: "Aiguille à Brider", reference: "7.7340 / 7.7342 / 7.7343", prix: "Prix sur demande", image: "../photos/7.7340.jpg", description: "Aiguille à brider en inox : droite 18 cm (7.7340), droite 24 cm (7.7342) ou courbée 20 cm (7.7343)." },
        { nom: "Aiguille à Larder", reference: "7.7347 / 7.7348", prix: "Prix sur demande", image: "../photos/7.7347.jpg", description: "Aiguille à larder courbée en inox : 16 cm (7.7347) ou 24 cm (7.7348)." },
        { nom: "Set de 10 Douilles Unies", reference: "7.6700", prix: "Prix sur demande", image: "../photos/7.6700.jpg", description: "Set de 10 douilles à pâtisserie unies en inox, tailles assorties." },
        { nom: "Set de 10 Douilles à Décorer", reference: "7.6750", prix: "Prix sur demande", image: "../photos/7.6750.jpg", description: "Set de 10 douilles cannelées en inox pour la décoration, tailles assorties." },
        { nom: "Poche à Douille 43 cm", reference: "7.6760", prix: "Prix sur demande", image: "../photos/7.6760.jpg", description: "Poche à douille de 43 cm en coton enduit de polyuréthane, résistante à l'ébullition." }
    ],
    accessoires: [
        {
            nom: "Victorinox Belt Hanger / Multiclip",
            reference: "4.1858",
            prix: "5 000 FCFA",
            image: "../photos/4.1858.jpg",
            images: [
                "../photos/4.1858.jpg",
                "../photos/belt-hanger-porte.jpg",
                "../photos/belt-hanger-chaine.jpg"
            ],
            video: "../photos/belt-hanger-demo.mp4",
            description: "Le Belt Hanger Victorinox 4.1858 est un accessoire de port multifonction conçu pour garder vos clés ou votre couteau suisse toujours à portée de main. Grâce à son système d'attache robuste, il s'accroche facilement à une ceinture, un passant de pantalon ou un sac, tout en offrant un accès rapide et sécurisé. Équipé d'un clip de ceinture solide, d'un anneau porte-clés et d'un mousqueton, il offre plusieurs options d'attache selon l'usage — idéal pour porter un couteau suisse ou des clés sur soi, sans risque de les perdre.",
            caracteristiques: [
                "Acier inoxydable solide",
                "Fixation facile à la ceinture",
                "Mousqueton + anneau porte-clés",
                "Sécurise le couteau contre les pertes",
                "Design compact et léger",
                "Fabriqué en Suisse 🇨🇭"
            ]
        },
        {
            nom: "Victorinox Nail Clipper",
            reference: "8.2055.C",
            prix: "7 000 FCFA",
            images: [
                "../photos/nail-clipper.jpg",
                "../photos/nail-clipper-usage.jpg"
            ],
            description: "Compact, élégant et extrêmement pratique, le coupe-ongles Victorinox 8.2055.C est conçu pour offrir une coupe nette et précise où que vous soyez. Fabriqué en acier inoxydable de haute qualité, il se replie facilement pour un transport sécurisé dans une poche, un sac ou un trousseau de clés.",
            caracteristiques: [
                "Acier inoxydable résistant à la corrosion",
                "Design compact et pliable",
                "Coupe précise et confortable",
                "Léger et facile à transporter",
                "Qualité suisse Victorinox 🇨🇭"
            ]
        },
        {
            nom: "Aiguiseur de Couteaux Deux Étapes — Disques Céramique",
            reference: "7.8721",
            prix: "15 000 FCFA",
            image: "../photos/7.8721.jpg",
            images: [
                "../photos/7.8721.jpg",
                "../photos/aiguiseur-usage.jpg"
            ],
            video: "../photos/aiguiseur-demo.mp4",
            description: "Aiguisez rapidement, facilement et en toute sécurité tous les couteaux à lame lisse de votre cuisine de manière optimale avec notre aiguiseur de couteaux. Conçu pour être manipulé de la façon la plus sûre possible, ce produit est idéal pour une utilisation domestique. Le design moderne comprend deux disques en céramique dont le fonctionnement compte deux étapes : le « pré-aiguisage » (qui conditionne la lame à l'affûtage) et l'« aiguisage de précision » (qui aiguise la lame). Il convient aux gauchers comme aux droitiers.",
            caracteristiques: [
                "Aiguisage en deux étapes : pré-aiguisage puis aiguisage de précision",
                "Deux disques en céramique haute performance",
                "Pour tous les couteaux de cuisine à lame lisse",
                "Utilisation simple, rapide et parfaitement sécurisée",
                "Convient aux gauchers comme aux droitiers",
                "Idéal pour un usage domestique"
            ],
            dimensions: "Deux disques en céramique · Pré-aiguisage + aiguisage de précision · Gauchers et droitiers"
        },
        { nom: "Fusil de Ménage Rond", reference: "7.8003 / 7.8013 / 7.8033", prix: "Prix sur demande", image: "../photos/7.8003.jpg", description: "Fusil de ménage rond, taille mi-fine. Longueurs disponibles : 18 cm (7.8003), 20 cm (7.8013) ou 23 cm (7.8033)." },
        { nom: "Fusil de Ménage Ovale, Manche Hêtre", reference: "7.8020", prix: "Prix sur demande", image: "../photos/7.8020.jpg", description: "Fusil de ménage ovale de 20 cm, taille mi-fine, manche en bois de hêtre." },
        { nom: "Fusil de Ménage, Manche Palissandre", reference: "7.8210", prix: "Prix sur demande", image: "../photos/7.8210.jpg", description: "Fusil de ménage rond de 20 cm, taille mi-fine, manche en palissandre." },
        { nom: "Fusil de Ménage Rond 20 cm", reference: "7.8213", prix: "Prix sur demande", image: "../photos/7.8213.jpg", description: "Fusil de ménage rond de 20 cm, taille mi-fine, manche synthétique." },
        { nom: "Fusil de Cuisine Rond 25 cm", reference: "7.8303", prix: "Prix sur demande", image: "../photos/7.8303.jpg", description: "Fusil de cuisine rond de 25 cm, taille mi-fine." },
        { nom: "Fusil de Cuisine Diamanté", reference: "7.8313 / 7.8323", prix: "Prix sur demande", image: "../photos/7.8323.jpg", description: "Fusil de cuisine ovale à revêtement diamant : 23 cm (7.8313) ou 26 cm (7.8323)." },
        { nom: "Fusil de Cuisine Diamanté 27 cm", reference: "7.8327", prix: "Prix sur demande", image: "../photos/7.8327.jpg", description: "Fusil de cuisine ovale de 27 cm à revêtement diamant." },
        { nom: "Fusil de Cuisine, Manche Hêtre 27 cm", reference: "7.8330 / 7.8340", prix: "Prix sur demande", image: "../photos/7.8330.jpg", description: "Fusil de cuisine de 27 cm, taille mi-fine, manche en hêtre. Rond (7.8330) ou ovale (7.8340)." },
        { nom: "Fusil de Cuisine 27 cm", reference: "7.8333 / 7.8343", prix: "Prix sur demande", image: "../photos/7.8333.jpg", description: "Fusil de cuisine de 27 cm, taille mi-fine. Rond (7.8333) ou ovale (7.8343)." },
        { nom: "Fusil de Cuisine Professionnel 27 cm", reference: "7.8403", prix: "Prix sur demande", image: "../photos/7.8403.jpg", description: "Fusil de cuisine rond de 27 cm, taille mi-fine, avec garde boule. Le même modèle que dans la mallette de chef." },
        { nom: "Fusil de Boucher 30 cm", reference: "7.8413 / 7.8423", prix: "Prix sur demande", image: "../photos/7.8413.jpg", description: "Fusil de boucher de 30 cm, taille mi-fine. Rond (7.8413) ou ovale (7.8423)." },
        { nom: "Fusil de Boucher Fin 30 cm", reference: "7.8513 / 7.8523", prix: "Prix sur demande", image: "../photos/7.8513.jpg", description: "Fusil de boucher de 30 cm, taille fine. Rond (7.8513) ou ovale (7.8523)." },
        { nom: "Fusil de Boucher, Manche Hêtre 30 cm", reference: "7.8620", prix: "Prix sur demande", image: "../photos/7.8620.jpg", description: "Fusil de boucher ovale de 30 cm, taille micro-fine, manche en bois de hêtre." },
        { nom: "Fusil de Boucher Micro-Fin 30 cm", reference: "7.8623", prix: "Prix sur demande", image: "../photos/7.8623.jpg", description: "Fusil de boucher ovale de 30 cm, taille micro-fine, manche synthétique." },
        { nom: "Aiguiseur Duo Céramique", reference: "7.8553", prix: "Prix sur demande", image: "../photos/7.8553.jpg", description: "Aiguiseur rond à deux disques céramique : bleu grain 360 (dégrossissage) et blanc grain 1000 (finition). 26 cm." }
    ]
};

// =========================================
// INITIALISATION AU CHARGEMENT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    initProductPage();
    initOffres();
    initHeaderScroll();
});

// =========================================
// OFFRE DU MOMENT (AFFICHES) — CARROUSEL + ZOOM
// =========================================
function initOffres() {
    const track = document.getElementById('offres-track');
    if (!track) return;

    // Défilement via les flèches
    const scrollByCard = (dir) => {
        const card = track.querySelector('.offre-card');
        const amount = card ? card.getBoundingClientRect().width + 26 : 340;
        track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };
    const prev = document.querySelector('.offres-prev');
    const next = document.querySelector('.offres-next');
    if (prev) prev.addEventListener('click', () => scrollByCard(-1));
    if (next) next.addEventListener('click', () => scrollByCard(1));

    // Masque les flèches en bout de course
    const updateNav = () => {
        const max = track.scrollWidth - track.clientWidth - 4;
        if (prev) prev.style.opacity = track.scrollLeft <= 4 ? '0' : '1';
        if (next) next.style.opacity = track.scrollLeft >= max ? '0' : '1';
    };
    track.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    updateNav();

    // Lightbox plein écran au clic sur une affiche
    let lb = document.querySelector('.offre-lightbox');
    if (!lb) {
        lb = document.createElement('div');
        lb.className = 'image-modal offre-lightbox';
        lb.style.zIndex = '10002';
        lb.innerHTML = `
            <span class="close-modal" aria-label="Fermer">&times;</span>
            <img class="modal-content" id="offre-lb-img" alt="Affiche promotionnelle Victorinox">
        `;
        document.body.appendChild(lb);
        lb.querySelector('.close-modal').addEventListener('click', (e) => { e.stopPropagation(); closeOffreLb(); });
        lb.addEventListener('click', (e) => { if (e.target === lb) closeOffreLb(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lb.classList.contains('open')) closeOffreLb();
        });
    }
    track.querySelectorAll('.offre-img-wrap').forEach(wrap => {
        const img = wrap.querySelector('img');
        wrap.addEventListener('click', () => {
            const lbImg = lb.querySelector('#offre-lb-img');
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            lb.style.display = 'flex';
            lb.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });
}

function closeOffreLb() {
    const lb = document.querySelector('.offre-lightbox');
    if (!lb) return;
    lb.style.display = 'none';
    lb.classList.remove('open');
    document.body.style.overflow = '';
}

// =========================================
// MENU MOBILE
// =========================================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// =========================================
// ANIMATIONS AU SCROLL (FADE UP)
// =========================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

// =========================================
// HEADER SCROLL EFFECT
// =========================================
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// =========================================
// BOUTON RETOUR EN HAUT
// =========================================
function initBackToTop() {
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backBtn.style.display = 'flex';
            } else {
                backBtn.style.display = 'none';
            }
        });

        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// =========================================
// FORMULAIRE DE CONTACT (MAILTO)
// =========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const subject = document.getElementById('subject')?.value.trim() || '';
        const message = document.getElementById('message')?.value.trim() || '';

        if (!name || !email || !subject || !message) {
            showFormMessage('Veuillez remplir tous les champs.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const btnLabel = btn ? btn.innerHTML : '';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Envoi en cours...';
        }
        showFormMessage('Envoi de votre message...', 'success');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(form)
            });
            const data = await response.json();

            if (data.success) {
                showFormMessage('Merci ! Votre message a bien été envoyé. Notre équipe vous répondra rapidement.', 'success');
                form.reset();
            } else {
                showFormMessage("Une erreur est survenue lors de l'envoi. Réessayez ou contactez-nous par téléphone.", 'error');
            }
        } catch (err) {
            showFormMessage("Impossible d'envoyer le message. Vérifiez votre connexion internet et réessayez.", 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = btnLabel;
            }
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(email);
}

function showFormMessage(msg, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.innerHTML = `<div class="form-message ${type}">${msg}</div>`;
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 5000);
    }
}

// =========================================
// OUTILS
// =========================================
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Prix « sur demande » (produits du catalogue sans tarif affiché)
function prixSurDemande(prod) {
    return !prod.prix || /sur demande/i.test(prod.prix);
}

// Lien d'achat WhatsApp avec message pré-rempli
function lienWhatsApp(prod) {
    const msg = prixSurDemande(prod)
        ? `Bonjour, je suis intéressé(e) par : ${prod.nom} (Réf. ${prod.reference}). Pouvez-vous m'indiquer son prix et sa disponibilité ?`
        : `Bonjour, je suis intéressé(e) par : ${prod.nom} (Réf. ${prod.reference}) — ${prod.prix}. Est-il disponible ?`;
    return `https://wa.me/${WHATSAPP_ACHAT}?text=${encodeURIComponent(msg)}`;
}

// =========================================
// PAGE PRODUITS - AFFICHAGE & FICHE DÉTAIL
// =========================================
function initProductPage() {
    const container = document.getElementById('products-container');
    if (!container) return;

    const boutons = document.querySelectorAll('.cat-btn');

    createProductModal();

    function afficherProduits(categorie) {
        container.innerHTML = '<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i> Chargement...</div>';

        setTimeout(() => {
            const produits = catalogueProduits[categorie];
            container.innerHTML = '';

            if (produits && produits.length > 0) {
                produits.forEach(prod => {
                    const card = document.createElement('div');
                    card.className = 'product-card fade-up';
                    card.setAttribute('role', 'button');
                    card.setAttribute('tabindex', '0');

                    const medias = getProductMedias(prod);
                    const thumb = medias.length ? (medias[0].poster || medias[0].src) : '../photos/logo.jpg';
                    const mediaCount = medias.length;
                    const hasVideo = medias.some(m => m.type === 'video');
                    const badge = mediaCount > 1
                        ? `<span class="product-media-badge">${hasVideo ? '<i class="fa-solid fa-video"></i> ' : '<i class="fa-solid fa-images"></i> '}${mediaCount}</span>`
                        : '';

                    card.innerHTML = `
                        <div class="product-img-wrap">
                            <img src="${thumb}" alt="${escapeHtml(prod.nom)}" loading="lazy" onerror="this.onerror=null;this.src='../photos/logo.jpg'">
                            ${badge}
                        </div>
                        <h3 class="product-title">${escapeHtml(prod.nom)}</h3>
                        <p class="product-ref">Réf : ${escapeHtml(prod.reference)}</p>
                        <div class="product-bottom">
                            <p class="product-price${prixSurDemande(prod) ? ' sur-demande' : ''}">${escapeHtml(prod.prix || 'Prix sur demande')}</p>
                            <span class="product-cta">Voir le produit <i class="fa-solid fa-arrow-right"></i></span>
                        </div>
                    `;

                    card.addEventListener('click', () => openProductModal(prod));
                    card.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openProductModal(prod);
                        }
                    });

                    container.appendChild(card);
                });

                const newElements = container.querySelectorAll('.fade-up');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                newElements.forEach(el => observer.observe(el));
            } else {
                container.innerHTML = '<p class="no-products">Aucun produit disponible dans cette catégorie pour le moment.</p>';
            }
        }, 300);
    }

    // Nombre de produits affiché sur chaque bouton de catégorie
    boutons.forEach(btn => {
        const cat = btn.getAttribute('data-cat');
        if (catalogueProduits[cat]) {
            const count = document.createElement('span');
            count.className = 'cat-count';
            count.textContent = catalogueProduits[cat].length;
            btn.appendChild(count);
        }
    });

    // Catégorie demandée dans l'URL (ex : produits.html?cat=cuisine), sinon celle par défaut
    const catParam = new URLSearchParams(window.location.search).get('cat');
    if (catParam && catalogueProduits[catParam]) {
        boutons.forEach(b => b.classList.toggle('active', b.getAttribute('data-cat') === catParam));
    }
    const defautBtn = document.querySelector('.cat-btn.active');
    afficherProduits(defautBtn ? defautBtn.getAttribute('data-cat') : 'suisses');

    boutons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            boutons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const categorie = e.currentTarget.getAttribute('data-cat');
            afficherProduits(categorie);
        });
    });
}

// =========================================
// FICHE DÉTAIL PRODUIT (MODALE)
// =========================================
function createProductModal() {
    if (document.querySelector('.product-modal')) return;

    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
        <div class="product-modal-box">
            <button class="product-modal-close" aria-label="Fermer">&times;</button>
            <div class="product-modal-media">
                <div class="pm-carousel">
                    <div class="pm-track"></div>
                    <button class="pm-nav pm-prev" type="button" aria-label="Média précédent"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="pm-nav pm-next" type="button" aria-label="Média suivant"><i class="fa-solid fa-chevron-right"></i></button>
                    <div class="pm-dots"></div>
                </div>
            </div>
            <div class="product-modal-info">
                <h3 class="pm-title"></h3>
                <p class="pm-ref"></p>
                <p class="pm-desc"></p>
                <ul class="pm-features"></ul>
                <p class="pm-dims"></p>
                <div class="pm-buy-row">
                    <p class="pm-price"></p>
                    <a class="btn-whatsapp pm-buy" href="#" target="_blank" rel="noopener">
                        <i class="fa-brands fa-whatsapp"></i> Commander sur WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    createZoomLightbox();

    const close = () => closeProductModal();
    modal.querySelector('.product-modal-close').addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });

    // Navigation du carrousel (flèches précédent / suivant)
    modal.querySelector('.pm-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentCarousel) currentCarousel.prev();
    });
    modal.querySelector('.pm-next').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentCarousel) currentCarousel.next();
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        const zoom = document.querySelector('.zoom-lightbox');
        const zoomOpen = zoom && zoom.classList.contains('open');

        if (e.key === 'Escape') {
            if (zoomOpen) closeZoom(); else close();
        } else if (!zoomOpen && currentCarousel) {
            if (e.key === 'ArrowLeft') currentCarousel.prev();
            else if (e.key === 'ArrowRight') currentCarousel.next();
        }
    });
}

// Contrôleur du carrousel actuellement affiché (pour clavier / flèches)
let currentCarousel = null;

// Construit la liste des médias d'un produit (images + vidéo éventuelle)
function getProductMedias(prod) {
    const medias = [];
    const imgs = (Array.isArray(prod.images) && prod.images.length)
        ? prod.images
        : (prod.image ? [prod.image] : []);
    imgs.forEach(src => medias.push({ type: 'image', src }));
    if (prod.video) medias.push({ type: 'video', src: prod.video, poster: imgs[0] || '' });
    return medias;
}

// Remplit le carrousel de la modale et renvoie un contrôleur { next, prev }
function buildCarousel(prod) {
    const modal = document.querySelector('.product-modal');
    const carousel = modal.querySelector('.pm-carousel');
    const track = modal.querySelector('.pm-track');
    const dotsWrap = modal.querySelector('.pm-dots');

    const medias = getProductMedias(prod);
    track.innerHTML = '';
    dotsWrap.innerHTML = '';
    track.style.transform = 'translateX(0)';

    medias.forEach((m, i) => {
        const slide = document.createElement('div');
        slide.className = 'pm-slide';
        if (m.type === 'video') {
            slide.innerHTML = `<video src="${m.src}" playsinline controls preload="metadata"${m.poster ? ` poster="${m.poster}"` : ''}></video>`;
        } else {
            slide.innerHTML = `<img src="${m.src}" alt="${escapeHtml(prod.nom)}" loading="lazy" onerror="this.onerror=null;this.src='../photos/logo.jpg'">`;
        }
        track.appendChild(slide);

        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'pm-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Média ' + (i + 1));
        dotsWrap.appendChild(dot);
    });

    // Une seule image : pas de flèches ni de pastilles
    carousel.classList.toggle('single', medias.length <= 1);

    let index = 0;
    const go = (i) => {
        index = (i + medias.length) % medias.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dotsWrap.querySelectorAll('.pm-dot').forEach((d, di) => d.classList.toggle('active', di === index));
        track.querySelectorAll('video').forEach(v => v.pause());
    };

    dotsWrap.querySelectorAll('.pm-dot').forEach((d, di) => {
        d.addEventListener('click', (e) => { e.stopPropagation(); go(di); });
    });

    // Zoom plein écran au clic sur une image
    track.querySelectorAll('img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => openZoom(img.src, img.alt));
    });

    // Glissement tactile (swipe) sur mobile
    let startX = null;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        startX = null;
    });

    return {
        next: () => go(index + 1),
        prev: () => go(index - 1),
        stop: () => track.querySelectorAll('video').forEach(v => v.pause())
    };
}

// =========================================
// AGRANDISSEMENT PHOTO (ZOOM PLEIN ÉCRAN)
// =========================================
function createZoomLightbox() {
    if (document.querySelector('.zoom-lightbox')) return;

    const zoom = document.createElement('div');
    zoom.className = 'image-modal zoom-lightbox';
    zoom.style.zIndex = '10001';
    zoom.innerHTML = `
        <span class="close-modal" aria-label="Fermer">&times;</span>
        <img class="modal-content" id="zoom-img" alt="Agrandissement de la photo">
    `;
    document.body.appendChild(zoom);

    zoom.querySelector('.close-modal').addEventListener('click', (e) => {
        e.stopPropagation();
        closeZoom();
    });
    zoom.addEventListener('click', (e) => {
        if (e.target === zoom) closeZoom();
    });
}

function openZoom(src, alt) {
    const zoom = document.querySelector('.zoom-lightbox');
    if (!zoom) return;
    const img = zoom.querySelector('#zoom-img');
    img.src = src;
    img.alt = alt || 'Agrandissement de la photo';
    zoom.style.display = 'flex';
    zoom.classList.add('open');
}

function closeZoom() {
    const zoom = document.querySelector('.zoom-lightbox');
    if (!zoom) return;
    zoom.style.display = 'none';
    zoom.classList.remove('open');
}

function openProductModal(prod) {
    const modal = document.querySelector('.product-modal');
    if (!modal) return;

    currentCarousel = buildCarousel(prod);

    modal.querySelector('.pm-title').textContent = prod.nom;
    modal.querySelector('.pm-ref').textContent = 'Réf : ' + prod.reference;
    const priceEl = modal.querySelector('.pm-price');
    priceEl.textContent = prod.prix || 'Prix sur demande';
    priceEl.classList.toggle('sur-demande', prixSurDemande(prod));

    const descEl = modal.querySelector('.pm-desc');
    descEl.textContent = prod.description || '';
    descEl.style.display = prod.description ? '' : 'none';

    const featuresEl = modal.querySelector('.pm-features');
    const features = Array.isArray(prod.caracteristiques) ? prod.caracteristiques : [];
    featuresEl.innerHTML = features.map(f => `<li>${escapeHtml(f)}</li>`).join('');
    featuresEl.style.display = features.length ? '' : 'none';

    const dimsEl = modal.querySelector('.pm-dims');
    if (prod.dimensions) {
        dimsEl.innerHTML = `<i class="fa-solid fa-ruler-combined"></i> ${escapeHtml(prod.dimensions)}`;
        dimsEl.style.display = '';
    } else {
        dimsEl.style.display = 'none';
    }

    modal.querySelector('.pm-buy').href = lienWhatsApp(prod);

    modal.querySelector('.product-modal-box').scrollTop = 0;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.querySelector('.product-modal');
    if (!modal) return;
    if (currentCarousel) currentCarousel.stop();
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Rafraîchir les animations après chargement
window.addEventListener('load', () => {
    initScrollAnimations();

    const elements = document.querySelectorAll('.fade-up');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            const delay = el.getAttribute('data-delay');
            if (delay) {
                setTimeout(() => el.classList.add('visible'), parseInt(delay));
            } else {
                el.classList.add('visible');
            }
        }
    });
});
