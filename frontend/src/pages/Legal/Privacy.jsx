import React from "react";

const Privacy = () => {
  return (
    <main className="max-w-4xl mx-auto p-6 text-gray-300 leading-relaxed">
      <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">
        Politique de Confidentialité
      </h1>
      <p className="mb-4 text-[#D4AF37] font-bold">
        Dernière mise à jour : {new Date().toLocaleDateString()}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          1. Collecte des informations
        </h2>
        <p>
          Nous collectons des informations lors de votre inscription sur notre
          plateforme, notamment votre nom, adresse e-mail, numéro de téléphone
          et détails de livraison.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          2. Utilisation des données
        </h2>
        <p>Les informations que nous recueillons sont utilisées pour :</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Personnaliser votre expérience de sourcing.</li>
          <li>Traiter vos commandes de groupage et marketplace.</li>
          <li>Améliorer le service client et vos besoins de support.</li>
          <li>
            Vous envoyer des notifications relatives à l'état de vos colis.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          3. Protection des informations
        </h2>
        <p>
          Nous mettons en œuvre une variété de mesures de sécurité pour
          préserver la sécurité de vos informations personnelles. Nous utilisons
          un cryptage de pointe pour protéger les données sensibles transmises
          en ligne.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">4. Cookies</h2>
        <p>
          Nos cookies améliorent l'accès à notre site et identifient les
          visiteurs réguliers. Cependant, cette utilisation des cookies n'est en
          aucune façon liée à des informations personnelles identifiables sur
          notre site.
        </p>
      </section>
    </main>
  );
};

export default Privacy;
