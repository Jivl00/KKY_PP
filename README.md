# Semestrální práce - KKY/PP (HTML + SVG + REST)

Tento repozitář obsahuje řešení semestrální práce z předmětu KKY/PP na Katedře Kybernetiky, Fakulty aplikovaných věd, Západočeské univerzity v Plzni. Cílem projektu je vytvořit uživatelské rozhraní (HMI) pro vizualizaci matematického modelu vozidla (Quater-car model) pomocí technologií HTML, SVG a REST.

## Obsah

1. [Popis projektu](#popis-projektu)
2. [Požadavky](#po%C5%BEadavky)
3. [Instalace](#instalace)
4. [Použití](#pou%C5%BEit%C3%AD)
5. [Struktura projektu](#struktura-projektu)

---

## Popis projektu

Úkolem je vytvořit responzivní HMI, které bude vizualizovat data z modelu vozidla. HMI má obsahovat:

* **Vizuální a číselné zobrazení výšky vozidla** nad vozovkou.
* **Animaci pružiny a tlumiče** na základě veličin `pos_susp_meas` a průměru kola `pos_wheell`.
* **Deformaci kola** (z kružnice do elipsy) na základě veličiny `pos_wheell`.
* **Sloupcový graf** zobrazující zrychlení působící na řidiče v kolmém směru.
* **Zobrazení aktuální hmotnosti** působící na pneumatiku (přepočet proměnné `Fl_tire`).
* **Zobrazení stavu spojení se serverem** s indikací, zda je možné zadávat hodnoty.

Ovládání aplikace má umožňovat:

* **Aktivaci skokové poruchy** `qcm.MP_NUDGE:BSTATE` a nastavení její intenzity `qcm.GAIN_NUDGE:k`.
* **Aktivaci náhodné poruchy** `qcm.SG_bumps:amp` a nastavení frekvence `qcm.SG_bumps:freq`.
* **Zapnutí** `qcm.CNB_RUN:YCN` a **RESET** modelu `qcm.MP_RESET:BSTATE`.


## Požadavky

* **Software:**
    * REXYGEN (pro spuštění lokálního serveru s modelem)
    * Webový prohlížeč (doporučeno Chrome, Firefox)


## Instalace

1. Nainstalujte a nakonfigurujte REXYGEN pro spuštění modelu Quater-car.
2. Ujistěte se, že je lokální server s REXYGENem spuštěn.

## Použití

1. Otevřete soubor `index.html` ve webovém prohlížeči.  Adresa by měla být `http://localhost:8008/hmi/index.html`.
2. Použijte ovládací prvky v postranním panelu pro interakci se simulací.
3. Sledujte vizualizace a grafy pro zobrazení stavu systému.

## Struktura projektu

Projekt se skládá z následujících souborů:

* `index.html`: Hlavní HTML soubor s uživatelským rozhraním.
* `CSS soubory`: Soubory se styly pro vzhled stránky.
* `JavaScript soubory`: Soubory s logikou aplikace, animacemi a komunikací s REXYGENem.
* Obrázky a další assets.

