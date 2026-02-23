import React from "react";

const Terms = () => {
  return (
    <main className="max-w-4xl mx-auto p-6 text-gray-300">
      <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">
        Conditions Générales d'Utilisation
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          1. Services de Sourcing
        </h2>
        <p>
          Aurum (BJ Business) agit en tant qu'intermédiaire entre les usines en
          Chine et l'acheteur. Nous nous engageons à trouver des fournisseurs
          fiables, mais la qualité finale dépend du cahier des charges validé
          par le client.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          2. Groupage et Expédition
        </h2>
        <p>
          Les délais d'expédition sont donnés à titre indicatif. Aurum ne peut
          être tenu responsable des retards causés par les douanes ou les
          compagnies de transport maritime/aérien.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          3. Paiements et Frais
        </h2>
        <p>
          Toutes les commandes doivent être payées selon les modalités convenues
          (acompte/solde). Les frais de service de sourcing sont non
          remboursables une fois la recherche lancée.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">4. Responsabilité</h2>
        <p>
          L'utilisateur est responsable de l'exactitude des informations de
          livraison fournies. Tout colis non récupéré après un délai de 30 jours
          à l'entrepôt pourra faire l'objet de frais de stockage
          supplémentaires.
        </p>
      </section>
    </main>
  );
};

export default Terms;
