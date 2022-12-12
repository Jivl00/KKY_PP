# Zadání semestrální práce KKY/PP

Na základě přiloženého matematického modelu (Quater-car model) vytvořte uživatelské rozhraní HMI pomocí jedné z následujících technologií: HTML + SVG + REST; HTML + Canvas + REST; Qt + QPainter + REST. 
Zadání technologie bude upřesněno na cvičení cvičícím!

HMI bude osahovat grafiku, která zobrazí aktuální stav kola na vozovce, tak aby si nezávislý uživatel dokázal představit v jaké stavu se systém nachází. 

HMI bude:
1. responzivní - umožní reakci na změnu velikosti okna prohlížeče, či aplikace
2. obsahovat hlavičku, navigační panel s ovládacími prvky a plochu pro zobrazení dat z modelu

Z hlediska uživatelského rozhraní bude HMI minimálně obsahovat:
1. Zobrazení výšky vozidla nad vozovkou (vizuálně i číselně včetně jednotek, zaokrouhleno na jedno desetinné místo, efekt zvětšit cca 10x aby byl viditelný)
2. Zobrazení (animace) pružiny a tlumiče na základě veličiny `pos_susp_meas` a průměru kola `pos_wheel` (vizuálně i číselně včetně jednotek, zaokrouhleno na jedno desetinné místo, efekt zvětšit cca 10x aby byl viditelný)
3. Deformaci kola `pos_wheel` (z kružnice do elipsy, efekt zvětšit cca 10x aby byl viditelný)
4. Velikost zrychlení působící na řidiče v kolmém směru na vozovku (například pomocí sloupcového grafu)
5. Aktuální hmotnost v [kg] působící na pneumatiku. Přepočet proměnné `Fl_tire`

Ovládaní aplikace:
1. Aktivace skokové poruchy `qcm.MP_NUDGE:BSTATE` a její intenzity `qcm.GAIN_NUDGE:k`
2. Aktivaci náhodné poruchy `qcm.SG_bumps:amp` a vhodně zvolené frekvence `qcm.SG_bumps:freq`
3. Zapnutí `qcm.CNB_RUN:YCN` a RESET modelu `qcm.MP_RESET:BSTATE`


Kromě samotné aplikace sepište semestrální práci, která minimálně bude obsahovat:
1. Zadání
2. Stručný popis použitých technologií
3. Popis postupu implementace vaší aplikace (vybrané ukázky zdrojového kódu - klíčové funkce)
4. Základní uživatelský manuál
5. Závěr

Hotovou aplikaci a semestrální práci odevzdáte příslušnému cvičícímu (HTML - Severa, Qt - Faist) přes Google Classroom jako jeden archiv .zip, který bude obsahovat semestrální práci (`*.pdf`) a nezbytné soubory pro sestavení aplikace:
- v případě Qt (`*.pro, *.h, *.cpp`)
- v případě HTML (`*.html,*.css,*.js`)

Práce bude zkontrolována funkčně a obsahově. V případě, že práce bude v pořádku, budete mít nárok na zápočet, který vám zapíše p. Balda u zkoušky.

Pro odevzdání budou tolerovány pouze 3 pokusy!


## Quarter-car model vLS2-2019
Model představuje levou přední část vozidla vybaveného aktivním tlumičem. Tlumič obsahuje aktuátor, kterému lze měnit vstupní sílu za jízdy v závislosti na působící poruše tak, aby byl jízdní komfort co nejlepší (bez vibrací).

### Vstupy: 
- `Fm` - akční zásah aktuátoru [N]
- `Fd` - porucha (síla od vozovky) [N]

### Výstupy: 
- `pos_car_abs` - poloha auta nad silnici [mm]
- `pos_susp_meas` - měřená relativní poloha auto-kolo (zpětná vazba pro řízení) [mm]
- `pos_wheel` - relativní poloha kolo-zem [mm]
- `acc_car` - zrychlení pusobíci na auto [m.s-2]
- `Fl_tire` - zátěžná síla na pneumatiku [N]

### Parametry:
- `k1`,`b1` - tuhost a tlumení odpružení [-]
- `k2`,`b2` - tuhost a tlumení kola [-]
- `base_pos_susp`,`base_pos_car` - absolutní offset meřených veličin
- `m1` - hmotnost auta [kg]
- `m2` - hmotnost kola [kg]
- `m_l` - dodatečná zátěž auta jako neurčitý parametr (palivo, náklad) [kg]