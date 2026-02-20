import React from "react";

const KYCPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-300">
      <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">
        Politique KYC & Vérification
      </h1>

      <section className="mb-8 bg-white/5 p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold text-[#D4AF37] mb-3">
          Pourquoi le KYC ?
        </h2>
        <p>
          Pour garantir la sécurité des transactions sur Aurum et respecter les
          réglementations internationales sur le commerce, nous exigeons que nos
          utilisateurs vérifient leur identité avant d'effectuer des opérations
          de sourcing ou de paiement importantes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          1. Documents requis
        </h2>
        <p>Pour valider votre compte, vous devez fournir :</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Une copie d'une pièce d'identité officielle (CNI, Passeport).</li>
          <li>
            Un justificatif de domicile récent (ou certificat de résidence).
          </li>
          <li>
            Pour les entreprises : Le registre de commerce (RCCM) et l'IFU.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          2. Processus de validation
        </h2>
        <p>
          Une fois soumis, nos services examinent vos documents sous 24h à 48h
          ouvrables. En cas de refus, un motif vous sera communiqué par e-mail.
        </p>
      </section>
    </div>
  );
};

export default KYCPolicy;
