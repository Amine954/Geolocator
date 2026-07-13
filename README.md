# Photo Géolocalisateur

Application Next.js qui utilise l'API Anthropic (Claude claude-sonnet-4-6 avec vision) pour analyser une photo et identifier sa localisation géographique probable.

## Fonctionnalités

- Upload par glisser-déposer ou sélection de fichier (JPG, PNG, WEBP, GIF)
- Prévisualisation de l'image uploadée
- Analyse par Claude AI avec retour JSON structuré :
  - **Pays** et **ville / région** probable
  - **Niveau de confiance** : faible / moyen / élevé
  - **Liste des indices visuels** détectés (architecture, végétation, panneaux, véhicules, lumière…)
- Gestion des états : chargement, erreur, résultat

## Prérequis

- **Node.js 18+**
- Une **clé API Anthropic** — obtenez-en une sur [console.anthropic.com](https://console.anthropic.com/)

## Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Puis éditez `.env.local` et remplacez la valeur par votre clé :

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Build production

```bash
npm run build
npm run start
```

## Structure du projet

```
photo-geolocator/
├── app/
│   ├── api/geolocate/route.ts   # Route API : appel Anthropic
│   ├── globals.css               # Tailwind CSS
│   ├── layout.tsx
│   └── page.tsx                  # Page principale
├── components/
│   ├── DropZone.tsx              # Zone drag & drop
│   └── ResultCard.tsx            # Affichage du résultat
├── types/
│   └── index.ts                  # Types TypeScript
├── .env.example
└── README.md
```

## Stack technique

| Outil | Rôle |
|---|---|
| Next.js 15 (App Router) | Framework React SSR/SSG |
| TypeScript | Typage statique |
| Tailwind CSS 3 | Styles utilitaires |
| @anthropic-ai/sdk | Appel à l'API Anthropic |
| claude-sonnet-4-6 | Modèle Claude avec vision |

## Remarques

- La clé API reste côté serveur (route API Next.js) et n'est jamais exposée au client.
- L'image est transmise en base64 dans le corps de la requête POST — pas de stockage fichier.
- Le prompt demande à Claude de répondre uniquement en JSON valide. La route nettoie également les éventuels blocs markdown si Claude en insère malgré tout.
