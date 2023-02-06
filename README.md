# Monorepo

**Monorepo pour le OBP**

Un template avec les outils nécessaires paur repondre aux poblématiques d'une 3tiers apps, automatisée.

## Evolution

[x] Mise en place du monorepo pour répondre aux problématiques observées suivantes :

- Réécriture des interfaces côté backend et frontend (types, dtos, etc...)
- CI du backend n'est pas aligné avec celle du frontend et vise-versa.
- Inconsistence des packages entre les projets (version différentes et libraires non réutilisées)
- Difficulté de contributions entre backend et le frontend.
- Le gestion des versions est complexe et peut causer des effets de bords.

J'ai choisi des solutions très populaires, le monorepo a été généré par [Nx](https://nx.dev) avec seulement 2 commandes pour démarrer avec Nextjs en front et une API node fastify
`npx create-nx-workspace@latest --preset=next`
`npm run nx generate @nrwl/node:application backend --frontendProject client`

[X] Installation de la CI visant Vercel pour le Nextjs

[X] Installation de la lib pulumi dans un dossier infra (GCP IaC)
`npm run nx generate @nrwl/node:library infra`

[X] Génération de Workload Identity Federation dans GCP pour avoir un token OIDC avec github

[X] Un service account de GCP doit pouvoir se connecter au projet GCP depuis la pipepline avec le token OIDC

[X] Installation du artifact registry et des IAM en IaC dans GCP

[X] La pipeline doit pouvoir se connecter au artifact registry et push une image

[X] La pipeline peut déployer un service sur Cloud Run

[] La pipeline doit déclencher des commandes spécifiques uniquement dans les projets modifiés

[] Installation de Cloud SQL

[] Coordination du déploiement du backend et du frontend
